require("dotenv").config();
const axios = require("axios");
const winston = require("winston");
const { ChatGPTAPI } = require("chatgpt");

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
    data: messageData,
  })
    .then((response) => {
      if (response.status === 200) {
        logger.info("Contacted listing:", listingId);
        return true;
      }
    })
    .catch((err) => {
      return false;
    });
}

async function generateChatGptMessage(description, template, language) {
  const chatGpt = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const adjectives = getAdjectives();

  const chatGptRequest = `Imagine you are looking for a room. I will give you a description of a listing and a message template. You will rewrite this message based on the provided description. I want it to sound ${adjectives}. Here is the description: "${description}". And here is the message template: "${template}". Based on this, rewrite the message in ${language}.`;

  const chatGptResponse = await chatGpt.sendMessage(chatGptRequest);

  console.log("Request: ", chatGptRequest);
  console.log("Response: ", chatGptResponse);
}

function getAdjectives() {
  let tonality = "";

  const adjectives = process.env.TONALITY.split(",");
  const wordsCount = adjectives.length;
  adjectives.forEach((adjective, index) => {
    index < wordsCount - 1
      ? tonality + adjective + ", "
      : tonality + "and " + adjective;
  });
  return tonality;
}

module.exports = {
  getDocument,
  login,
  getMessageTemplate,
  sendMessage,
  generateChatGptMessage,
};
