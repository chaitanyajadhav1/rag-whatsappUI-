import { prisma } from "./src/lib/db";

async function main() {
  const docs = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    take: 5
  });
  console.log(docs);
}
main();
