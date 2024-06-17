require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");
const connectDB = require("./config/db");
const app = express();

connectDB();

// * Cors
app.use(cors());

// * Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// * Api routes
app.use("/open/api", routes);

app.get("/", (req, res) => {
  res.send("welcome To Open Api of Open-Scrapping");
});

app.use("*", (req, res) => {
  res.status(404).send("Route not found");
});

let PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

