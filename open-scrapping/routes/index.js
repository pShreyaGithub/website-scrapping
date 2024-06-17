const express = require("express");
const {
  scrapSite,
  sites,
  siteDetails,
  deleteSite,
  deleteMultipleSite,
} = require("../controllers/scrapping");
const { downloadCsv } = require("../controllers/downloadcsv");
const router = express.Router();

router.post("/scrap_site", scrapSite);
router.get("/sites", sites);
router.get("/site_details/:id", siteDetails);
router.delete("/delete_site/:id", deleteSite);
router.post("/delete_multiple_site", deleteMultipleSite);
router.get("/download_csv", downloadCsv);

module.exports = router;
