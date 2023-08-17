import {createLogger, transports} from "winston";
import 'dotenv/config'
import {searchListings} from "./modules/listing-scraper";
import {login} from "./services/requests";
import {db} from "./database/db";
import {contactListing} from "./modules/message-bot";


export const logger = createLogger({
    level: 'debug',
    transports: [new transports.Console()]
});
export  const headers = {
    "content-type": "application/json",
    "User-Agent": "Chrome/64.0.3282.186 Safari/537.36",
};

export const loginData = {
    login_email_username: process.env.WGG_EMAIL,
    login_password: process.env.WGG_PASSWORD,
    login_form_auto_login: "1",
    display_language: "de",
};

searchListings();
login();
db.read();
const listings = db.get("listings").filter(value => value.message.messageSent === false).value();
listings.forEach((listing) => {
    contactListing(listing).then();
});
db.write()
setInterval(searchListings, 5 * 60 * 100);
