
document.getElementById('generateBtn').addEventListener('click', async () => {
  const person = document.getElementById('personName').value;
  const company = document.getElementById('companyName').value;
  const output = document.getElementById('output');

  if (!person || !company) {
    output.value = "Please enter both a name and a company.";
    return;
  }

  output.value = "Generating insights...";

  const response = await fetch("https://tiktok-comment-helper.vercel.app/api/sales-helper", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ person, company })
  });

  const data = await response.json();
  output.value = data.insights || "No insights found.";
});
