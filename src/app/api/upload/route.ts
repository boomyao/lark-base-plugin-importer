import { NextRequest } from "next/server";
import { extractTextFromPDF } from "./pdf";
import { autoFillFields } from "./base";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const tableFields = formData.get('tableFields') as string;

  if (!file) {
    return new Response('No file found', { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const text = await extractTextFromPDF(new Uint8Array(buffer));
  const data = await autoFillFields(tableFields, text);

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
