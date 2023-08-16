const Parser = require("node-html-parser");
const franc = require("franc");
const db = require("../database/db.js");
const { getDocument } = require("../services/requests.js");

async function searchListings() {
  const filterPage = await getDocument(process.env.FILTER_URL);
  const newListings = await parseListings(filterPage);
  addListingsToDB(newListings);
}

function addListingsToDB(listings) {
  let countListings = listings.length;
  listings.forEach((listing) => {
    const listingExists = db.get("listings").find({ id: listing.id }).value();
    if (listingExists) {
      countListings--;
    } else {
      db.get("listings").push(listing).write();
    }
  });
  countListings === 0
    ? console.log(`No new listings!`)
    : console.log(`Adding ${countListings} new listings...`);
}

async function parseListings(document) {
  console.log("Looking for new listings...");

  const allListings = [];

  Parser.parse(document)
    .querySelectorAll(".wgg_card.offer_list_item") // find listing elements by class
    .forEach(async (listingHTML) => {
      const id = listingHTML.attrs.id.replace("liste-details-ad-", "");

      // for message to have appropiate owner name
      let owner =
        listingHTML.querySelector("span.ml5")?.rawText.replace(/ .*/, "") || "";
      if (owner.charAt(0) === "\n") {
        owner = "";
      }

      const titleHTML = listingHTML.querySelector(
        "h3.truncate_title.noprint > a"
      );
      const url = process.env.BASE_URL + titleHTML.attrs.href;
      const title = titleHTML.rawText || "";
      const description = await parseDescription(url); // new page must be opened to parse description
      const lang = franc(title, { only: ["eng", "deu"] });

      const listing = {
        id: id,
        owner: owner,
        url: url,
        title: title,
        description: description,
        lang: lang,
        message: {
          messageSent: false,
          content: "",
        },
      };

      allListings.push(listing);
    });

  return allListings;
}

async function parseDescription(listingUrl) {
  const document = await getDocument(listingUrl);

  /* TBD – add to object */
}

module.exports = searchListings;
