const searchListings = require("./modules/listing-scraper.js");
const contactListing = require("./modules/message-bot.js");
const { login } = require("./services/requests.js");
const db = require("./database/db.js");

searchListings();
login();
db.read();
const listings = db.get("listings").filter({ messageSent: false }).value();
listings.forEach((listing) => {
  contactListing(listing);
});
setInterval(searchListings, 5 * 60 * 100);
