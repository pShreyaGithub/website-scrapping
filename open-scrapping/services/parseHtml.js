const cheerio = require("cheerio");
const nlp = require("compromise");

// Function to parse HTML and extract relevant details
async function parseHtml(html, url) {
  const $ = cheerio.load(html);

  // Extract the title
  const title = $("title").text() || "No title found";

  // Extract meta description
  const metaDescription =
    $('meta[name="description"]').attr("content") ||
    "No meta description found";

  // Extract text from the page
  const text = $("body").text();

  // Extract text from the page for NLP processing
  const doc = nlp(text);

  // Extract company details
  const companyDetails = {
    name: findCompanyName(doc, $),
    description: findCompanyDescription(doc, $),
    website: findCompanyWebsite($),
    phone: findCompanyPhone(doc, $),
    email: findCompanyEmail($),
    social_links: findCompanySocialLinks($),
    address: findCompanyAddress(doc, $),
  };

  // Create an object to hold the extracted information
  const pageInfo = {
    url,
    title,
    metaDescription,
    favicon: findFavicon($, url),
    companyDetails,
  };

  return pageInfo;
}

// Function to find company name using NLP and common patterns
function findCompanyName(doc, $) {
  let name = "";
  const nameEntities = doc.match("#Organization").out("array");
  if (nameEntities.length > 0) {
    name = nameEntities[0];
  } else {
    name =
      $('meta[property="og:site_name"]').attr("content") || $("title").text();
  }
  return name.trim();
}

// Function to find company description using meta tags and paragraphs
function findCompanyDescription(doc, $) {
  let description =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    "";
  if (!description) {
    const paragraphs = $("p").toArray();
    for (let paragraph of paragraphs) {
      const text = $(paragraph).text();
      if (text.length > 50) {
        description = text;
        break;
      }
    }
  }
  return description.trim();
}

// Function to find company website by looking for common patterns in anchor tags
function findCompanyWebsite($) {
  let website = $('a[href^="http"]')
    .filter(
      (i, el) =>
        $(el).text().toLowerCase().includes("website") ||
        $(el).text().toLowerCase().includes("official")
    )
    .attr("href");
  return website || "";
}

// Function to find company phone number using NLP and regex
function findCompanyPhone(doc, $) {
  const phoneRegex = /(\+\d{1,3}[- ]?)?\d{10,13}/g;
  const phoneNumbers = doc.match("#PhoneNumber").out("array");

  if (phoneNumbers.length > 0) {
    return phoneNumbers[0];
  }

  const bodyText = $("body").text();
  const matchedPhones = bodyText.match(phoneRegex);

  return matchedPhones ? matchedPhones[0] : "";
}

// Function to find company email using mailto links and regex
function findCompanyEmail($) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  let email = $('a[href^="mailto:"]').attr("href");

  if (email) {
    return email.replace("mailto:", "");
  }

  const bodyText = $("body").text();
  const matchedEmails = bodyText.match(emailRegex);

  return matchedEmails ? matchedEmails[0] : "";
}

// Function to find company social links using common patterns
function findCompanySocialLinks($) {
  const socialLinks = {
    facebook: $('a[href*="facebook.com"]').attr("href"),
    instagram: $('a[href*="instagram.com"]').attr("href"),
    twitter: $('a[href*="twitter.com"]').attr("href"),
    linkedin: $('a[href*="linkedin.com"]').attr("href"),
  };
  return socialLinks;
}

// Function to find company address using NLP and regex
function findCompanyAddress(doc, $) {
  const addressRegex = /\d{1,5}\s\w+(\s\w+){1,5},?\s\w{2,}\s\d{5}/g;
  const addresses = doc.match("#Address").out("array");

  if (addresses.length > 0) {
    return addresses[0];
  }

  const bodyText = $("body").text();
  const matchedAddresses = bodyText.match(addressRegex);

  return matchedAddresses ? matchedAddresses[0] : "";
}

// Function to find favicon of the website
function findFavicon($, pageUrl) {
  // Try different common selectors for favicon
  let favicon =
    $('link[rel="shortcut icon"]').attr("href") ||
    $('link[rel="icon"]').attr("href") ||
    $('link[rel="apple-touch-icon"]').attr("href") ||
    $('link[rel="apple-touch-icon-precomposed"]').attr("href") ||
    $('link[rel="mask-icon"]').attr("href") ||
    $('link[rel="fluid-icon"]').attr("href") ||
    $('meta[itemprop="image"]').attr("content") ||
    "No favicon found";

  // If a favicon was found but it's a relative URL, convert it to an absolute URL
  if (pageUrl && favicon !== "No favicon found" && !favicon.startsWith("http")) {
    const parsedUrl = new URL(pageUrl);
    favicon = new URL(favicon, parsedUrl.origin).href;
  }

  return favicon;
}

module.exports = { parseHtml };
