export async function formatCodeWithGroq(code: string, language: string, aiNote?: string) {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY in .env");
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "You are a code formatter. Reformat the user's code with clean, consistent 2-space indentation and idiomatic style. Do NOT change behavior. Reply with ONLY the formatted code, no markdown fences. If the user provides an 'AI note' describing intent, use it only to understand context — do not embed the note in the output.",
        },
        {
          role: "user",
          content: `Language: ${language}${aiNote ? `\nAI note (context): ${aiNote}` : ""}\n\n${code}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq API Error: ${res.status} ${text}`);
  }

  const data = await res.json();
  let out: string = data.choices?.[0]?.message?.content ?? code;
  // Clean up any stray markdown fences just in case
  out = out
    .replace(/^```[a-zA-Z]*\n?/, "")
    .replace(/```\s*$/, "")
    .trim();
  return out;
}
