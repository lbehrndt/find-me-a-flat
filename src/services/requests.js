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

async function getLoginCookie() {
  try {
    const loginCookie = await login();
    console.log("Cookie:", loginCookie);
  } catch (error) {}
}

async function login() {
  let loginData = {
    login_email_username: process.env.WGG_EMAIL,
    login_password: process.env.WGG_PASSWORD,
    login_form_auto_login: "1",
    display_language: "de",
  };

  axios({
    method: "post",
    url: process.env.LOGIN_URL,
    data: loginData,
  })
    .then((response) => {
      if (response.status === 200) {
        console.log("Login successful!");
        console.log("set-cookie: ", response.headers["set-cookie"].toString());
        return response.headers["set-cookie"].toString();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { getDocument, getLoginCookie };
