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
    // Retrieve the paginated data
    const sites = await site
      .find()
      .sort({ createdAt: -1 })
      .select(
        "title url favicon createdAt companyDetails.name companyDetails.description companyDetails.phone companyDetails.email companyDetails.address companyDetails.social_links"
      );


    // Send the paginated data and total count
    res.send(sites);
  } catch (err) {
    // Log the error and send a generic error response
    console.error("Error in sitesList:", err);
    res.status(500).send("Something went wrong");
  }
};

const siteDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is provided
    if (!id) {
      return res.status(400).send("ID is required!");
    }

    // Attempt to delete the site data by ID
    const getSite = await site.findById(id);

    // If no site data is found, return a 404 error
    if (!getSite) {
      return res.status(404).send("Site data not found!");
    }

    // Send a success message
    res.send(getSite);
  } catch (err) {
    // Log the error and send a generic error response
    console.error("Error in deleteSite:", err);
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

const deleteMultipleSite = async (req, res) => {
  try {
    const { ids } = req.body;

    // Check if the IDs are provided and if it's an array
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send("IDs are required and should be a non-empty array!");
    }

    // Attempt to delete the site data by IDs
    const result = await site.deleteMany({ _id: { $in: ids } });

    // If no site data is found, return a 404 error
    if (result.deletedCount === 0) {
      return res.status(404).send("No site data found for the provided IDs!");
    }

    // Send a success message
    res.send({ message: `${result.deletedCount} site(s) deleted successfully!` });
  } catch (err) {
    // Log the error and send a generic error response
    console.error("Error in deleteMultipleSite:", err);
    res.status(500).send("Something went wrong");
  }
};

module.exports = {
  scrapSite,
  sites,
  deleteSite,
  siteDetails,
  deleteMultipleSite,
};
