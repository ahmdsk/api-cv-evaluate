import express, { Application, Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import routes from "./routes"
import { apiReference } from "@scalar/express-api-reference"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app: Application = express()
app.use(express.json())

// === Middleware logging request ===
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
  next()
})

// Routes utama
app.use("/", routes)

// Serve openapi.json statically
app.use("/spec", express.static(path.join(__dirname, "docs/openapi.json")))

// Scalar API Reference
app.use(
  "/docs",
  apiReference({
    spec: {
      url: "/spec"
    }
  })
)

// === Middleware error handler global ===
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR] ${err.message}`)
  res.status(500).json({ error: "Internal Server Error" })
})

export default app
