import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { addTask, updateTask } from "../services/tasks";
import { callDeepSeekWithRetry } from "../services/deepseek";
import { retrieveContext } from "../services/rag";

interface EvaluateRequest {
  cvText: string;
  projectText?: string;
  jobDescription: string;
}

const router = express.Router();

router.post("/evaluate", async (req: Request, res: Response) => {
  const { cvText, projectText, jobDescription } = req.body as EvaluateRequest;

  if (!cvText || !jobDescription) {
    return res
      .status(400)
      .json({ error: "cvText and jobDescription required" });
  }

  const jobId = uuidv4();
  addTask(jobId, { status: "queued" });

  // Simulate async job
  setTimeout(async () => {
    try {
      updateTask(jobId, { status: "processing" });

      const context = await retrieveContext(jobDescription);

      const prompt = `
You are an evaluator. Compare CV and Project Report against Job Description and Scoring Rubric.
Return a STRICT JSON with detailed scoring.

Context:
${context}

CV:
${cvText}

${projectText ? "Project Report:\n" + projectText : ""}

Return JSON strictly:
{
  "cv": {
    "technical_skills": 1-5,
    "experience_level": 1-5,
    "achievements": 1-5,
    "cultural_fit": 1-5,
    "match_rate": 0.0-1.0,
    "feedback": "..."
  },
  "project": {
    "correctness": 1-5,
    "code_quality": 1-5,
    "resilience": 1-5,
    "documentation": 1-5,
    "creativity": 1-5,
    "score": 0.0-10.0,
    "feedback": "..."
  },
  "overall_summary": "3-5 sentences summary (strengths, gaps, recommendations)"
}
`;

      // Call DeepSeek with retry
      const raw = await callDeepSeekWithRetry(prompt, 3);
      console.log("[DeepSeek Raw Response]", raw);

      // Sanitize JSON (remove ```json blocks)
      const clean = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let parsed;
      try {
        parsed = JSON.parse(clean);
      } catch (e) {
        console.error("[DeepSeek Parse Error]", e);
        throw new Error(
          "DeepSeek returned invalid JSON: " + clean.slice(0, 200)
        );
      }

      updateTask(jobId, { status: "completed", result: parsed });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("[Evaluation Error]", err.message);
        updateTask(jobId, { status: "failed", error: err.message });
      }
    }
  }, 1000);

  res.json({ id: jobId, status: "queued" });
});

export default router;
