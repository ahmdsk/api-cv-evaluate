import axios from "axios";

async function callDeepSeek(prompt: string): Promise<string> {
  const res = await axios.post(
    "https://api.deepseek.com/v1/chat/completions",
    {
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 20000,
    }
  );

  if (!res.data.choices || res.data.choices.length === 0) {
    throw new Error("No response from DeepSeek");
  }

  return res.data.choices[0].message.content as string;
}

export async function callDeepSeekWithRetry(
  prompt: string,
  retries = 3
): Promise<string> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await callDeepSeek(prompt);
    } catch (err) {
      lastError = err;
      console.warn(
        `[DeepSeek Retry] Attempt ${attempt} failed: ${(err as Error).message}`
      );
      await new Promise((r) => setTimeout(r, attempt * 2000)); // exponential backoff
    }
  }

  throw new Error(
    `DeepSeek API failed after ${retries} attempts: ${
      (lastError as Error).message
    }`
  );
}
