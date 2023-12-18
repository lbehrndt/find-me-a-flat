import { createLogger, transports } from "winston";
import ListingScraper from "./modules/listing-scraper";
import Requests from "./services/requests.service";
import MessageBot from "./modules/message-bot";
import ListingService from "./services/listings.service";

export const logger = createLogger({
  level: "debug",
  transports: [new transports.Console()],
});

Requests.login();
setInterval(() => {
  new ListingService();
  new ListingScraper();
  new MessageBot();
}, 5 * 60 * 100);
