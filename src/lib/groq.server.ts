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
            "You are a code formatter. Reformat the user's code with clean, consistent 2-space indentation and idiomatic style. Do NOT change behavior, DO NOT CHANGE THE ORIGINAL CODE PRESERVE IT. Reply with ONLY the formatted code, no markdown fences. If the user provides an 'AI note' describing intent, use it only to understand context — do not embed the note in the output.",
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
  // Clean up any stray markdown fences just in case
  out = out
    .replace(/^```[a-zA-Z]*\n?/, "")
    .replace(/```\s*$/, "")
    .trim();
  return out;
}

export async function inferTopicWithGroq(
  categoryName: string,
  existingTopics: { id: string; title: string }[],
  fileContentsPreview: string,
  currentTopicId: string | null
) {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY in .env");
  }

  const systemPrompt = `You are an AI assistant for a coding instructor. The instructor is uploading code files for a new lecture in the subject: "${categoryName}".
Your job is to read the file contents, compare them to the existing topics, and decide whether this lecture belongs to an existing topic or needs a new one.

Existing Topics:
${existingTopics.length > 0 ? existingTopics.map(t => `- ID: ${t.id} | Title: "${t.title}"`).join('\n') : "(None currently exist)"}
${currentTopicId ? `\nHint: The user is currently viewing the topic with ID "${currentTopicId}". Check if the uploaded files fit into this topic first. If they do, prefer using it. However, if the files obviously belong to a DIFFERENT existing topic, or require a brand new topic, do not use it.` : ""}

You must return a raw JSON object with the following schema:
{
  "action": "use_existing" | "create_new",
  "topicId": "string (only if use_existing, must match one of the IDs provided above)",
  "topicName": "string (only if create_new, give a concise title for the new topic, e.g. 'CSS Grid')",
  "dayTitle": "string (a concise title for this specific day's lecture based on the file contents, e.g. 'Grid Layout Basics' or 'Login Page UI')"
}
Do NOT wrap the JSON in markdown code blocks. Output ONLY valid JSON.`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `File contents snippet:\n\n${fileContentsPreview}` },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq API Error: ${res.status} ${text}`);
  }

  const data = await res.json();
  const out = data.choices?.[0]?.message?.content ?? "{}";
  try {
    return JSON.parse(out);
  } catch {
    throw new Error("Failed to parse Groq AI response as JSON");
  }
}
