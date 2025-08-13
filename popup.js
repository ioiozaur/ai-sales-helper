document.addEventListener('DOMContentLoaded', () => {
  const personInput = document.getElementById('personName');
  const companyInput = document.getElementById('companyName');
  const output = document.getElementById('output');
  const generateBtn = document.getElementById('generateBtn');

  let scrapedData = {};

  // Autofill from LinkedIn
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) {
      console.warn("[AI Sales Helper] No active tab found.");
      return;
    }

    chrome.tabs.sendMessage(tabs[0].id, { type: "GET_PROFILE_DATA" }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn("[AI Sales Helper] Content script error:", chrome.runtime.lastError.message);
        return;
      }

      if (response) {
        console.log("[AI Sales Helper] 🔍 Autofill from LinkedIn:", response);
        personInput.value = response.name || "";
        companyInput.value = response.company || "";
        scrapedData = response;
      } else {
        console.warn("[AI Sales Helper] ❌ No response from content script.");
      }
    });
  });

  // On Generate
  generateBtn.addEventListener('click', () => {
    const person = personInput.value.trim();
    const company = companyInput.value.trim();

    console.log("[AI Sales Helper] 🧪 Inputs on generate:", { person, company });

    if (!person || !company) {
      output.value = "Please enter both a name and a company.";
      return;
    }

    output.value = "Generating insights...";

    const requestBody = {
      person,
      company,
      headline: scrapedData.headline || "",
      location: scrapedData.location || "",
      about: scrapedData.about || "",
      latestPost: scrapedData.latestPost || ""
    };

    console.log("[AI Sales Helper] 📦 Sending request to background.js:", requestBody);

    chrome.runtime.sendMessage({
      type: "FETCH_SALES_INSIGHT",
      payload: requestBody
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("❌ Extension runtime error:", chrome.runtime.lastError.message);
        output.value = "Extension error. Please reload and try again.";
        return;
      }

      if (response?.success) {
        output.value = response.insights || "No insights found.";
      } else {
        console.error("❌ Background fetch failed:", response?.error);
        output.value = "Something went wrong. Please try again.";
      }
    });
  });
});
