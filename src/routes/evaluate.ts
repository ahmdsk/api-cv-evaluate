import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { addTask, updateTask } from "../services/tasks";
import { callDeepSeek } from "../services/deepseek";
import { retrieveContext } from "../services/rag";

interface EvaluateRequest {
  cvText: string;
  jobDescription: string;
}

const router = express.Router();

router.post("/evaluate", async (req: Request, res: Response) => {
  const { cvText, jobDescription } = req.body as EvaluateRequest;

  if (!cvText || !jobDescription) {
    return res
      .status(400)
      .json({ error: "cvText and jobDescription required" });
  }

  const jobId = uuidv4();
  addTask(jobId, { status: "queued" });

  // Async process
  setTimeout(async () => {
    try {
      const context = await retrieveContext(jobDescription);

      const result = await callDeepSeek(`
You are an evaluator. Compare CV with Job Description and return JSON strictly.

Context:
${context}

CV:
${cvText}

Job Description:
${jobDescription}

Return JSON:
{
  "cv_match_rate": <0..1>,
  "cv_feedback": "...",
  "project_score": <0..10>,
  "project_feedback": "...",
  "overall_summary": "..."
}
      `);

      updateTask(jobId, { status: "completed", result: JSON.parse(result) });
    } catch (err: unknown) {
      if (err instanceof Error)
        updateTask(jobId, { status: "failed", error: err.message });
    }
  }, 2000);

  res.json({ id: jobId, status: "queued" });
});

export default router;
