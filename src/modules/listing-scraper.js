const Parser = require("node-html-parser");
const franc = require("franc");
const db = require("../database/db.js");
const { getDocument } = require("../services/requests.js");

async function searchListings() {
  const filterPage = await getDocument();
  const newListings = parseListings(filterPage);
  addListingsToDB(newListings);
}

function addListingsToDB(listings) {
  let countListings = listings.length;
  listings.forEach((listing) => {
    const listingExists = db.get("listings").find({ id: listing.id });
    if (listingExists) {
      countListings--;
    } else {
      db.get("listings").push(listing).write();
    }
  });
  console.log(`Added ${countListings} new listings!`);
}

function parseListings(document) {
  console.log("Looking for new listings...");

  const allListings = [];

  Parser.parse(document)
    .querySelectorAll(".wgg_card.offer_list_item") // find listing elements by class
    .forEach((listingHTML) => {
      const id = listingHTML.attrs.id.replace("liste-details-ad-", "");
      const owner =
        listingHTML.querySelector("span.ml5")?.rawText.replace(/ .*/, "") || ""; // for message to have appropiate name
      const titleHTML = listingHTML.querySelector(
        "h3.truncate_title.noprint > a"
      );
      const url = titleHTML.attrs.href;
      const description = titleHTML.rawText || "";
      const lang = franc(description, { only: ["eng", "deu"] });

      const listing = {
        id: id,
        owner: owner,
        url: url,
        description: description,
        lang: lang,
        messageSent: false,
      };

      allListings.push(listing);
    });

  return allListings;
}
module.exports = searchListings;
