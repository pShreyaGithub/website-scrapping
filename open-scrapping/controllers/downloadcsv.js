const { Parser } = require("json2csv");
const site = require("../models/site");

const downloadCsv = async (req, res) => {
  try {
    // Fetch all site data
    const sites = await site
      .find()
      .sort({ createdAt: -1 })
      .select(
        "title url favicon createdAt companyDetails.name companyDetails.description companyDetails.phone companyDetails.email companyDetails.address"
      )
      .lean();

    // Define fields for CSV
    const fields = [
      { label: "Title", value: "title" },
      { label: "URL", value: "url" },
      { label: "favicon", value: "favicon" },
      { label: "Company Name", value: "companyDetails.name" },
      { label: "Company Description", value: "companyDetails.description" },
      { label: "Company Phone", value: "companyDetails.phone" },
      { label: "Company Email", value: "companyDetails.email" },
      { label: "Company Address", value: "companyDetails.address" },
      { label: "Created At", value: "createdAt" },
    ];

    // Create a new JSON2CSV parser
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(sites);

    // Set response headers for CSV download
   res.header("Content-Type", "text/csv");
   res.header("Content-Disposition", 'attachment; filename="sites.csv"');
   res.send(csv);
  } catch (err) {
    // Log the error and send a generic error response
    console.error("Error in downloadCsv:", err);
    res.status(500).send("Something went wrong");
  }
};

module.exports = { downloadCsv };
