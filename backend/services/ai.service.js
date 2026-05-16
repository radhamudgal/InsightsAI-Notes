// All AI calls go through this service so the Groq API key stays on the server
// The frontend never touches the key directly
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.LLM_API_KEY });

// shared helper — sends a prompt and returns the response text
const ask = async (prompt) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile', // free model, handles summarisation well
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5, // lower = more consistent, less creative
  });
  return response.choices[0].message.content.trim();
};

// returns a 2-3 sentence plain text summary
const generateSummary = (content) =>
  ask(`Summarize this note in 2-3 sentences. Return only the summary text:\n\n${content}`);

// returns a short title string (no quotes)
const suggestTitle = async (content) => {
  const title = await ask(
    `Suggest a short title (max 8 words) for this note. Return only the title, no quotes:\n\n${content}`
  );
  return title.replace(/^["']|["']$/g, '');
};

// returns a JS array of task strings parsed from the AI's JSON response
const extractActionItems = async (content) => {
  const text = await ask(
    `Extract action items from this note. Return a JSON array like ["Task 1", "Task 2"]. If none found, return [].\n\n${content}`
  );
  try {
    // the model sometimes wraps the array in extra text, so we extract just the array
    return JSON.parse(text.match(/\[[\s\S]*\]/)?.[0] || '[]');
  } catch {
    return [];
  }
};

module.exports = { generateSummary, suggestTitle, extractActionItems };
