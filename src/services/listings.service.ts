import ListingDB from "../database/listings.db";

export default class ListingService implements IListingService {
  db: ListingDB;
  constructor() {
    this.db = new ListingDB();
  }

  getListing(id: string): Listing {
    return this.db.getListingById(id);
  }
  getListings(filter?: MessageSentFilter): Listing[] {
    return filter
      ? this.db.getListings(filter.messageSent)
      : this.db.getListings();
  }
  createListing(listing: Listing) {
    return this.db.createListing(listing);
  }
  createListings(listings: Listing[]) {
    return this.db.createListings(listings);
  }
  updateListing(listing: Listing) {
    return this.db.updateListing(listing);
  }
}
