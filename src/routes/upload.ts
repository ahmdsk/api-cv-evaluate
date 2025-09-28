import express, { Request, Response } from "express"
import multer, { FileFilterCallback } from "multer"
import { parseFile } from "../services/parser"

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error("Only PDF and DOCX allowed"))
  }
})

router.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" })
    const text = await parseFile(req.file)
    res.json({ status: "ok", textPreview: text.slice(0, 200), fullText: text })
  } catch (e: unknown) {
    if (e instanceof Error) res.status(400).json({ error: e.message })
    else res.status(500).json({ error: "Unexpected error" })
  }
})

export default router
