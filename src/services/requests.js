require("dotenv").config();
const axios = require("axios");
const winston = require("winston");

const logger = winston.createLogger({
  level: "DEBUG",
  transport: [new winston.transports.Console()],
});

const headers = {
  "content-type": "application/json",
  "User-Agent": "Chrome/64.0.3282.186 Safari/537.36",
};

const loginData = {
  login_email_username: process.env.WGG_EMAIL,
  login_password: process.env.WGG_PASSWORD,
  login_form_auto_login: "1",
  display_language: "de",
};

let userData = {};

async function getDocument(url) {
  const listingData = axios({
    method: "get",
    url: url,
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

async function login() {
  axios({
    method: "post",
    url: process.env.LOGIN_URL,
    data: loginData,
  })
    .then((response) => {
      if (response.status === 200) {
        logger.info("Login successful");
        logger.debug(response.data);
        userData = response.data;
        headers["cookie"] = response.headers["set-cookie"].toString();
      }
    })
    .catch((err) => {
      console.log("Login error:", err);
    });
}

async function getMessageTemplate(messageId) {
  const messageTemplate = axios({
    method: "get",
    url: process.env.MESSAGE_TEMPLATE_URL,
    headers: headers,
  })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });

  return messageTemplate;
}

async function sendMessage(listingId, message) {
  const messageData = {
    user_id: userData.user_id,
    csrf_token: userData.csrf_token,
    messages: [{ content: message, message_type: "text " }],
    ad_type: "0",
    ad_id: listingId,
  };

  return axios({
    method: "post",
    url: process.env.SEND_MESSAGE_URL,
    headers: headers,
    data: message,
  }).then((response) => {
    if (response.status === 200) {
      logger.info("Listing: (", listingId, ") was contacted.");
    }
  });
}

module.exports = { getDocument, login, getMessageTemplate };
