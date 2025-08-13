console.log("[AI Sales Helper] ✅ Content script injected");

// Utility to get text content
function getText(selector) {
  const el = document.querySelector(selector);
  return el?.innerText.trim() || "";
}

// Get name from LinkedIn profile
let name = getText("h1.text-heading-xlarge");
if (!name) {
  const altName = document.querySelector('[data-test-id="profile-header"] h1');
  if (altName) name = altName.innerText.trim();
}

// Get headline (e.g. “Product Designer at Lumo Energy”)
const headline = getText(".text-body-medium.break-words");

// Get current company (fallback to part of headline)
let company = "";
const experienceSection = document.querySelector("#experience ~ div");
if (experienceSection) {
  const firstJob = experienceSection.querySelector("li");
  if (firstJob) {
    const companyEl = firstJob.querySelector("span[aria-hidden='true']");
    company = companyEl?.innerText.trim() || "";
  }
}
if (!company && headline.includes(" at ")) {
  company = headline.split(" at ")[1];
}

// Get location (renamed to avoid `location` conflict)
const userlocation = getText(".text-body-small.inline.t-black--light.break-words");

// Get 'About' section
const about = getText('#about ~ div span[aria-hidden="true"]');

// Get latest post (optional)
let latestPost = "";
const postEl = document.querySelector(".feed-shared-update-v2__description");
if (postEl) latestPost = postEl.innerText.trim();

// Log what we found
console.log("[AI Sales Helper] Scraped data:", { name, headline, company, userlocation, about, latestPost });

// Respond to popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_PROFILE_DATA") {
    sendResponse({
      name,
      headline,
      company,
      location: userlocation,
      about,
      latestPost
    });
  }
});
