import ListingDB from "./listings.db";

export default class ListingService implements IListingService {
  db: ListingDB;
  constructor() {
    this.db = new ListingDB();
  }

  getListing(id: string): IListing {
    return this.db.getListingById(id);
  }
  getListings(filter?: MessageSent): IListing[] {
    return this.db.getListings(filter.messageSent);
  }
  createListing(listing: IListing) {
    return this.db.createListing(listing);
  }
  createListings(listings: IListing[]) {
    return this.db.createListings(listings);
  }
  updateListing(listing: IListing) {
    return this.db.updateListing(listing);
  }
}
