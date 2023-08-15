require("dotenv").config();
const axios = require("axios");

const headers = {
  "content-type": "application/json",
  "User-Agent": "Chrome/64.0.3282.186 Safari/537.36",
};

async function getDocument() {
  const listingData = axios({
    method: "get",
    url: process.env.FILTER_URL,
    headers: headers,
  })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error(err);
    });

  return listingData;
}

module.exports = getDocument;
