import axios from "axios";

export async function callDeepSeek(prompt: string): Promise<string> {
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
    }
  );

  if (!res.data.choices || res.data.choices.length === 0) {
    throw new Error("No response from DeepSeek");
  }

  return res.data.choices[0].message.content as string;
}
