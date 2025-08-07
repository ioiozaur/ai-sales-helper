
document.getElementById('generateBtn').addEventListener('click', async () => {
  const person = document.getElementById('personName').value;
  const company = document.getElementById('companyName').value;
  const output = document.getElementById('output');

  if (!person || !company) {
    output.value = "Please enter both a name and a company.";
    return;
  }

  output.value = "Generating insights...";

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
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
🎯 Pitch Angle:

Be brief, specific, and assume the user is preparing for a first sales call.`
      }],
      temperature: 0.7
    })
  });

  const data = await response.json();
  const insights = data.choices?.[0]?.message?.content || "No insights found.";
  output.value = insights;
});
