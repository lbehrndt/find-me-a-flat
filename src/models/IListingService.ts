type MessageSentFilter = Pick<ListingMessage, "messageSent">;
interface IListingService {
  getListing(id: string): Listing;
  getListings(filter?: MessageSentFilter): Listing[];
  createListing(listing: Listing): void;
  createListings(listings: Listing[]): void;
  updateListing(listing: Listing): void;
}
