const cheerio = require("cheerio");
const nlp = require("compromise");

nlp.extend((Doc, world) => {
  // Adding custom patterns for better entity recognition
  world.addWords({
    inc: "Organization",
    corp: "Organization",
    ltd: "Organization",
    company: "Organization",
    technologies: "Organization",
    systems: "Organization",
    group: "Organization",
    holdings: "Organization",
    enterprise: "Organization",
    associates: "Organization",
    street: "Street",
    st: "Street",
    road: "Road",
    rd: "Road",
    avenue: "Avenue",
    ave: "Avenue",
    boulevard: "Boulevard",
    blvd: "Boulevard",
    lane: "Lane",
    ln: "Lane",
    drive: "Drive",
    dr: "Drive",
    court: "Court",
    ct: "Court",
    plaza: "Plaza",
    plz: "Plaza",
    square: "Square",
    sq: "Square",
  });
});

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
    name: findCompanyName(url, $),
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
function findCompanyName(url, $) {
  let names = [];
  const hostname = new URL(url).hostname;
  names.push(hostname.replace(/^www\./, "").split(".")[0]);

  let metaTitle = $("title").text();
  if (metaTitle) {
    names.push(metaTitle);
  }

  // Check Open Graph site name
  let ogSiteName = $('meta[property="og:site_name"]').attr("content");
  if (ogSiteName) {
    names.push(ogSiteName);
  }

  // Check additional metadata for organization name
  let metaOrganization = $('meta[name="organization"]').attr("content");
  if (metaOrganization) {
    names.push(metaOrganization);
  }

  // Remove duplicates and choose the most likely candidate
  names = [...new Set(names)]; // Remove duplicates
  return names.length > 0 ? names[0].trim() : "No company name found";
}

// Function to find company description using meta tags and paragraphs
function findCompanyDescription(doc, $) {
  // First attempt to get description from meta tags
  let description =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content");

  // If no meta description, attempt to get from Twitter meta data
  if (!description) {
    description = $('meta[name="twitter:description"]').attr("content");
  }

  // If still no description, look for any large blocks of text in paragraphs
  if (!description) {
    let largestParagraph = "";
    $("p").each((i, el) => {
      let paragraphText = $(el).text().trim();
      if (paragraphText.length > largestParagraph.length) {
        largestParagraph = paragraphText;
      }
    });
    description = largestParagraph;
  }

  // Finally, check for prominent text in headers if still no description found
  if (!description) {
    description = $("h1, h2")
      .filter((i, el) => $(el).text().length > 30)
      .first()
      .text();
  }

  return description.trim();
}

// Function to find company website by looking for common patterns in anchor tags
function findCompanyWebsite($) {
  // First attempt to find links directly labeled as "website" or "official"
  let website = $('a[href^="http"]')
    .filter((i, el) => {
      const linkText = $(el).text().toLowerCase();
      return linkText.includes("website") || linkText.includes("official");
    })
    .attr("href");

  // If no direct matches, look for relevant meta tags
  if (!website) {
    website =
      $('link[rel="canonical"]').attr("href") ||
      $('meta[property="og:url"]').attr("content");
  }

  // Fallback to finding any domain that repeats frequently, assuming it could be the main site
  if (!website) {
    let links = {};
    $('a[href^="http"]').each((i, el) => {
      let href = $(el).attr("href");
      let domain = new URL(href).hostname;
      links[domain] = (links[domain] || 0) + 1;
    });
    let mostCommonDomain = Object.keys(links).reduce(
      (a, b) => (links[a] > links[b] ? a : b),
      null
    );
    if (mostCommonDomain) {
      website = `https://${mostCommonDomain}`;
    }
  }

  return website || "";
}

// Function to find company phone number using NLP and regex
function findCompanyPhone(doc, $) {
  const phoneRegex = /(\+\d{1,3}[- ]?)?(\(?\d{1,3}\)?[- ]?)?[\d\s-]{7,13}/g;
  const bodyText = $("body").text();
  const matchedPhones = bodyText.match(phoneRegex) || [];
  const phoneNumbers = doc.match("#PhoneNumber").out("array");

  return phoneNumbers[0] || matchedPhones[0] || "";
}

// Function to find company email using mailto links and regex
function findCompanyEmail($) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;
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

function cleanAddress(address) {
  // Normalize whitespace and remove any unwanted characters
  address = address.replace(/[\t\n\r]/g, " ").replace(/\s+/g, " ");

  // Remove common prefixes that are not part of the actual address
  const prefixes = ["address:", "location:", "find us at:", "office location:"];
  const regex = new RegExp("^(" + prefixes.join("|") + ")", "i");
  address = address.replace(regex, "").trim();

  // Optional: Remove any trailing punctuation or special characters that are common in messy scrapes
  address = address.replace(/^[,.]/, "").trim();

  return address;
}

// Function to find company address using NLP and regex
function findCompanyAddress(doc, $) {
  let addresses = [];

  let addressElements = [
    ".address", // Common class for addresses
    "footer .address", // Addresses often found in footers
    '*[itemtype="http://schema.org/PostalAddress"]', // Schema.org format
    ".contact-info .address", // Addresses in a contact info section
    ".footer-address", // Another common footer address class
    "address", // HTML5 address tag
  ];

  for (let i = 0; i < addressElements.length; i++) {
    let currentAddress = $(addressElements[i]).text().trim();
    if (currentAddress && currentAddress.length > 10) {
      addresses.push(currentAddress);
      break;
    }
  }
  $("*[class*='address']").each(function () {
    let address = $(this).text().trim();
    if (address && address.length > 10) {
      // Ensure it's a substantial piece of text
      addresses.push(address);
      return false; // Break the loop once a valid address is found
    }
  });

  const addressRegex =
    /\d{1,5}\s[\w\s.]{2,99}(?:street|st|road|rd|avenue|ave|boulevard|blvd|lane|ln|drive|dr|court|ct|plaza|plz|square|sector|sq)\s?,?\s?[A-Za-z]{2,},?\s?[A-Za-z]{2,}\s?\d{5}/gi;

  // Look for address in common HTML structures
  const potentialAddressSelectors = [
    ".address", // Common class for addresses
    '[class*="address"]', // Any class containing "address"
    "address", // Address tag
    'img[alt*="address"], img[alt*="location"], img[title*="address"], img[title*="location"]', // Images with alt/title containing "address" or "location"
  ];

  potentialAddressSelectors.forEach((selector) => {
    $(selector).each((i, el) => {
      let text = $(el).text().trim();
      let match = text.match(addressRegex);
      if (match) {
        addresses.push(match[0]);
      }
    });
  });

  // Using NLP to match patterns tagged as potential addresses
  const nlpResults = doc.match("#Value+ #Street").out("array");
  addresses = [...addresses, ...nlpResults];

  // Using the body text as a fallback if no address is found
  if (!addresses.length) {
    const bodyText = $("body").text();
    addresses = bodyText.match(addressRegex) || [];
  }

  // Combine and filter unique results from regex, NLP, and specific selectors
  addresses = [...new Set(addresses)];

  return addresses.length > 0 ? cleanAddress(addresses[0]) : "No address found";
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
  if (
    pageUrl &&
    favicon !== "No favicon found" &&
    !favicon.startsWith("http")
  ) {
    const parsedUrl = new URL(pageUrl);
    favicon = new URL(favicon, parsedUrl.origin).href;
  }

  return favicon;
}

module.exports = { parseHtml };