import mammoth from "mammoth"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"

export async function parseFile(file: Express.Multer.File): Promise<string> {
  if (file.mimetype === "application/pdf") {
    return await parsePdf(file.buffer)
  }

  if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const result = await mammoth.extractRawText({ buffer: file.buffer })
    return result.value
  }

  throw new Error("Unsupported file type")
}

async function parsePdf(buffer: Buffer): Promise<string> {
  const data = new Uint8Array(buffer)

  // 🚀 ini penting: matikan fetch/worker
  const loadingTask = pdfjsLib.getDocument({ data, useWorkerFetch: false })
  const pdf = await loadingTask.promise

  let text = ""

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const content = await page.getTextContent()
    const pageText = content.items.map((item: any) => item.str).join(" ")
    text += pageText + "\n"
  }

  return text.trim() || "[No extractable text found]"
}
