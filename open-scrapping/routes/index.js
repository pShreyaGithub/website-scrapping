const express = require("express");
const { scrapSite, sites, deleteSite } = require("../controllers/scrapping");
const router = express.Router();

router.post("/scrap_site", scrapSite);
router.get("/sites", sites);
router.delete("/delete_site/:id", deleteSite);

module.exports = router;
