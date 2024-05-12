import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import "pdfjs-dist/legacy/build/pdf.worker.mjs"

export async function extractTextFromPDF(pdf: Uint8Array) {
  const doc = await pdfjsLib.getDocument(pdf).promise;
  const text = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text.push(content.items.map((item) => item.str).join(""));
  }
  return text.join("\n");
}
