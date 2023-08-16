const searchListings = require("./modules/listing-scraper.js");

searchListings();
setInterval(searchListings, 5 * 60 * 100);
