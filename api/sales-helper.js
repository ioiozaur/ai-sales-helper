export default async function handler(req, res) {
  console.log("[API] ✅ Running latest deployed version with CORS patch");

  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { person, company, headline, location, about, latestPost } = req.body;

  if (!person || !company) {
    return res.status(400).json({ error: 'Missing person or company' });
  }

  const safeText = (val) => val?.trim() || "Not available";

  const prompt = `
You're an expert sales strategist helping a user prepare for a first outreach call.

Here is the scraped LinkedIn info:
- Name: ${safeText(person)}
- Company: ${safeText(company)}
- Title/Headline: ${safeText(headline)}
- Location: ${safeText(location)}
- About: ${safeText(about)}
- Recent Post: ${safeText(latestPost)}

Use this info to write a short, structured insight pack with the following format:

👤 Person Summary:
🏢 Company Insight:
💬 Suggested Opener:
🎯 Conversation Angle:

Keep the tone friendly and brief. Avoid assumptions if data is vague.
`.trim();

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You generate helpful, concise sales briefings." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      }),
    });

    const data = await response.json();
    const insights = data.choices?.[0]?.message?.content || "No insights found.";
    return res.status(200).json({ insights });

  } catch (err) {
    console.error("[API] ❌ Failed to fetch from OpenAI:", err);
    return res.status(500).json({ error: "Failed to fetch from OpenAI." });
  }
}
