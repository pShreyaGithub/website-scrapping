const site = require("../models/site");
const { parseHtml } = require("../services/parseHtml");
const { getHtml } = require("../services/puppeter");
const { uploadImage } = require("../services/uploadImage");

const scrapSite = async (req, res) => {
  try {
    const { url } = req.body;

    // Check if url is provided in the request body
    if (!url) {
      return res.status(400).send("url is required!");
    }

    // Validate the url and extract its origin
    let parsedUrl;
    try {
      parsedUrl = new URL(url).origin;
    } catch (err) {
      return res.status(400).send("Invalid URL!");
    }

    // Check if the site data already exists in the database
    const existingSiteData = await site.findOne({ url: parsedUrl });
    if (existingSiteData) {
      return res.send(existingSiteData);
    }

    // Retrieve the HTML and screenshot from the site
    const { html, screenShot } = await getHtml(parsedUrl);

    // Parse the HTML to extract relevant data
    const parsedData = await parseHtml(html, parsedUrl);

    // Upload the screenshot and add the link to the parsed data
    const screenShotLink = await uploadImage(
      screenShot,
      parsedData.title,
      `image of ${parsedData.title}`
    );
    parsedData.companyDetails.screenshot = screenShotLink;

    // Save the parsed data to the database
    const createdSiteData = await site.create(parsedData);

    // Send the created data as the response
    res.send(createdSiteData);
  } catch (err) {
    // Log the error and send a generic error response
    console.error("Error in scrapSite:", err);
    res.status(500).send("Something went wrong");
  }
};

const sites = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Parse page and limit as integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Validate page and limit
    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1
    ) {
      return res.status(400).send("Invalid page or limit value!");
    }

    // Calculate the number of documents to skip
    const skip = (pageNumber - 1) * limitNumber;

    // Get the total count of documents
    const totalDocuments = await site.countDocuments();

    // Retrieve the paginated data
    const sites = await site
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    // Send the paginated data and total count
    res.send({
      total: totalDocuments,
      page: pageNumber,
      limit: limitNumber,
      data: sites,
    });
  } catch (err) {
    // Log the error and send a generic error response
    console.error("Error in sitesList:", err);
    res.status(500).send("Something went wrong");
  }
};

const deleteSite = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is provided
    if (!id) {
      return res.status(400).send("ID is required!");
    }

    // Attempt to delete the site data by ID
    const deletedSite = await site.findByIdAndDelete(id);

    // If no site data is found, return a 404 error
    if (!deletedSite) {
      return res.status(404).send("Site data not found!");
    }

    // Send a success message
    res.send({ message: "Site data deleted successfully!" });
  } catch (err) {
    // Log the error and send a generic error response
    console.error("Error in deleteSite:", err);
    res.status(500).send("Something went wrong");
  }
};

module.exports = { scrapSite, sites, deleteSite };
