import { Database } from "bun:sqlite";

export default class ListingDB {
  db: Database;

  constructor() {
    this.db = new Database("listingdb.sqlite");
    this.db.run(
      "CREATE TABLE IF NOT EXISTS listings (id VARCHAR(8) PRIMARY KEY, owner VARCHAR(255), url VARCHAR(255), title VARCHAR(255), description TEXT, lang VARCHAR(3), messageSent BOOLEAN, messageContent TEXT;"
    );
  }

  getListings(messageSent?: boolean): IListing[] {
    return messageSent
      ? this.db.query<IListing, []>("SELECT * FROM listings;").all()
      : this.db
          .query<IListing, boolean>(
            "SELECT * FROM listings WHERE messageSent = $messageSent;"
          )
          .all(messageSent);
  }

  getListingById(id: string): IListing {
    const listing = this.db
      .query<IListing, { $id: string }>(
        "SELECT * FROM listings WHERE id = $id;"
      )
      .get({ $id: id });

    return listing;
  }

  createListing(listing: IListing) {
    this.db.run(
      "INSERT INTO listings (id, owner, url, title, description, lang, messageContent, messageSent) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
      [
        listing.id,
        listing.owner,
        listing.url,
        listing.title,
        listing.description,
        listing.lang,
        listing.message.messageContent,
        listing.message.messageSent,
      ]
    );
  }

  createListings(listings: IListing[]) {
    for (const listing of listings) this.createListing(listing);
  }

  updateListing(listing: IListing) {
    this.db.run(
      "UPDATE listings SET messageContent=?, messageSent=?, WHERE id=?;",
      [listing.message.messageContent, listing.message.messageSent, listing.id]
    );
  }
}
