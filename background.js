chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FETCH_SALES_INSIGHT") {
    console.log("[BG] Fetching sales insight with payload:", message.payload);

    fetch("https://ai-sales-helper-fxsi0m1at-iosif-matyas-projects.vercel.app/api/sales-helper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message.payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("[BG] ✅ Got response from API:", data);
        sendResponse({ success: true, insights: data.insights });
      })
      .catch((error) => {
        console.error("[BG] ❌ Failed to fetch from API:", error);
        sendResponse({ success: false, error: error.message });
      });

    // Keep the message channel open for async sendResponse
    return true;
  }
});
