import express, { Request, Response } from "express"
import { getTask, Task } from "../services/tasks"

const router = express.Router()

router.get("/result/:id", (req: Request, res: Response) => {
  const task: Task | undefined = getTask(req.params.id)
  res.json(task || { error: "Not found" })
})

export default router
