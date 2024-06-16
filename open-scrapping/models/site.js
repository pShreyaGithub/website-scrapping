const mongoose = require('mongoose');

const SiteSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    metaDescription: { type: String, required: true },
    companyDetails: {
      name: { type: String, default: "No name found" },
      description: { type: String, default: "No description found" },
      website: { type: String, default: null },
      phone: { type: String, default: null },
      email: { type: String, default: null },
      social_links: {
        facebook: { type: String, default: null },
        instagram: { type: String, default: null },
        twitter: { type: String, default: null },
        linkedin: { type: String, default: null },
      },
      address: { type: String, default: null },
      favicon: { type: String, default: "No favicon found" },
      screenshot: { type: String, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Site", SiteSchema);
