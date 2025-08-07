
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { person, company } = req.body;

  if (!person || !company) {
    return res.status(400).json({ error: 'Missing person or company' });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: `Create a short sales briefing based on the following inputs:
- Person: ${person}
- Company: ${company}

Format the output using these sections:
👤 Person Summary:
🏢 Company Summary:
💬 Suggested Opener:
🎯 Pitch Angle:`
        }],
        temperature: 0.7
      }),
    });

    const data = await response.json();
    const insights = data.choices?.[0]?.message?.content || "No insights found.";
    return res.status(200).json({ insights });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch from OpenAI." });
  }
}
