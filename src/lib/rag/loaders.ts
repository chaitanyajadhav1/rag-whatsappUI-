import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { Document } from "@langchain/core/documents";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

export type SupportedFileType = "pdf" | "csv" | "xlsx" | "xls";

export function getFileType(filename: string): SupportedFileType | null {
  const ext = path.extname(filename).toLowerCase().replace(".", "");
  if (["pdf", "csv", "xlsx", "xls"].includes(ext)) {
    return ext as SupportedFileType;
  }
  return null;
}

export async function loadDocument(
  filePath: string,
  fileType: SupportedFileType
): Promise<Document[]> {
  switch (fileType) {
    case "pdf":
      return loadPDF(filePath);
    case "csv":
      return loadCSV(filePath);
    case "xlsx":
    case "xls":
      return loadExcel(filePath);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

async function loadPDF(filePath: string): Promise<Document[]> {
  // Use pdf-parse directly instead of LangChain's PDFLoader,
  // which breaks in Vercel serverless due to module resolution issues
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);

  return [
    new Document({
      pageContent: data.text,
      metadata: {
        source: filePath,
        pages: data.numpages,
      },
    }),
  ];
}

async function loadCSV(filePath: string): Promise<Document[]> {
  const loader = new CSVLoader(filePath);
  return loader.load();
}

async function loadExcel(filePath: string): Promise<Document[]> {
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const documents: Document[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

    if (jsonData.length === 0) continue;

    const headers = jsonData[0] as string[];
    const rows = jsonData.slice(1);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const rowContent = headers
        .map((header, idx) => `${header}: ${row[idx] ?? ""}`)
        .join(", ");

      documents.push(
        new Document({
          pageContent: rowContent,
          metadata: {
            source: filePath,
            sheet: sheetName,
            row: i + 1,
          },
        })
      );
    }
  }

  return documents;
}
