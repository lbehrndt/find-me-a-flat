const Parser = require("node-html-parser");
const { getMessageTemplate, getDocument } = require("../services/requests");

async function contactListing(listing) {
  const url = process.env.BASE_URL + listing.url;
  const listingPage = await getDocument(url);
  const description = parseDescription(listingPage);
  //const messageTemplate = getMessageTemplate();
}

async function parseDescription(document) {
  const removedBRs = document.replaceAll("<br>" || "</br>" || "<br/>", "");

  console.log(removedBRs);
}

module.exports = contactListing;
