import { parse } from "node-html-parser";
import Requests from "../services/requests.service";
import { logger } from "../app";
import { franc } from "franc";
import ListingService from "../services/listings.service";

/**
 * # ListingScraper Class
 * ## Overview
 * The ListingScraper class is designed to scrape and process listings from a web source, then add them to a database using the ListingService. This class employs TypeScript to ensure type safety and uses various external libraries and services for web scraping and data manipulation. It follows principles of clean code and code quality for maintainability and readability.
 *
 * ## Class Structure
 * - ListingScraper implements the ListingScraper interface, suggesting that there might be a missing definition for the interface itself.
 * - It initializes an instance of the ListingService (DBService) in the constructor to interact with the database.
 * - The class provides methods for fetching and processing listings, adding them to the database, and parsing their descriptions.
 * - It utilizes logging for informational purposes.
 *
 * ### Constructor
 * constructor()
 * - Initializes the DBService instance by creating a new ListingService.
 * - Fetches listings from a web source and immediately adds them to the database using addListingsToDB.
 *
 * ### Methods
 * ```typescript
 * getListings(): Promise<IListing[]>
 * ```
 * - Asynchronously fetches listings from a web source specified by the Bun.env.FILTER_URL.
 * - Parses the retrieved HTML document using external libraries.
 * - Returns a Promise that resolves to an array of IListing objects representing the listings.
 *
 * ```typescript
 * addListingsToDB(listings: IListing[]): void
 * ```
 * - Adds the provided listings to the database using the DBService.createListings(listings) method.
 * - Logs information about the number of new listings added or indicates if there are no new listings.
 *
 * ```typescript
 * parseListings(document: string): Promise<IListing[]>
 * ```
 * - Parses the HTML document string to extract listing information.
 * - Iterates over each listing in the document, extracting details like ID, owner, title, URL, description, and language.
 * - Determines if a listing is new by comparing it with existing listings in the database.
 * Returns an array of new listings as IListing objects.
 *
 * ```typescript
 * parseDescription(listingUrl: string): Promise<string>
 * ```
 * - Asynchronously retrieves the description of a listing from the provided listingUrl.
 * - Currently, a placeholder description ("Unknown description") is returned. This should be implemented with actual description parsing logic.
 *
 * ### Dependencies
 * This class relies on external libraries and services such as **`getDocument`** for fetching web pages, **parse** for HTML parsing, and the **franc** library for language detection.
 *
 * ### Considerations
 * The class should be used with a well-defined ListingScraper interface, which appears to be missing from the provided code.
 * The parseDescription method lacks implementation for actual description extraction. Implementing this logic is crucial for a complete scraper.
 * Proper error handling, testing, and exception handling should be added to ensure robustness in real-world scenarios.
 * Logging is used for informational purposes but can be configured for different log levels and destinations as needed.
 *
 * ### Example Usage
 * ```typescript
 * const scraper = new ListingScraper();
 * ```
 * This code initializes a ListingScraper instance and starts scraping and adding listings to the database immediately upon creation.
 */
export default class ListingScraper implements ListingScraper {
  DBService: ListingService;

  constructor() {
    this.DBService = new ListingService();
    this.getListings().then((listings) => this.addListingsToDB(listings));
  }

  async getListings(): Promise<Listing[]> {
    const filterPageDocument = await Requests.getDocument(Bun.env.FILTER_URL);
    const newListings = await this.parseListings(filterPageDocument);
    return newListings;
  }

  addListingsToDB(listings: Listing[]) {
    const listingsCount = listings.length;

    this.DBService.createListings(listings);

    if (listingsCount === 0) {
      logger.info("No new listings!");
    } else {
      logger.info(`Adding ${listingsCount} new listings...`);
    }
  }

  async parseListings(document: string) {
    logger.info("Looking for new listings...");
    const allListings: Listing[] = this.DBService.getListings();
    const newListings: Listing[] = [];

    for (const listingHTML of parse(document).querySelectorAll(
      ".wgg_card.offer_list_item"
    )) {
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
      const url = Bun.env.BASE_URL + titleHTML.attrs.href;
      const title = titleHTML.rawText || "";
      const description = await this.parseDescription(url); // new page must be opened to parse description
      const lang = franc(title, { only: ["eng", "deu"] });

      const listing: Listing = {
        id: id,
        owner: owner,
        url: url,
        title: title,
        description: description,
        lang: lang,
        message: {
          messageSent: false,
          messageContent: "",
        },
      };

      const isNewListing = allListings.includes(listing);

      if (isNewListing) newListings.push(listing);
    }
    return newListings;
  }

  async parseDescription(listingUrl: ListingURL) {
    const document = await Requests.getDocument(listingUrl);

    /* TBD – add to object */
    return "Unknown description";
  }

  /* async parseDoc(
    documentUrl: string,
    valueMap?: { object: { selector: string; value: any }[] }
  ): Promise<any | any[]> {
    const document = await Requests.getDocument(documentUrl);

    for (const html of parse())


    return {};
  } */
}
