import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy";

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = "documents";

export async function uploadFile(
  file: Buffer,
  path: string,
  contentType: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, { contentType, upsert: true });

  if (error) throw new Error(`Upload failed: ${error.message}`);
  return data.path;
}

export async function downloadFile(path: string): Promise<Buffer> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(path);

  if (error) throw new Error(`Download failed: ${error.message}`);
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) throw new Error(`Delete failed: ${error.message}`);
}

export function getPublicUrl(path: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return data.publicUrl;
}
