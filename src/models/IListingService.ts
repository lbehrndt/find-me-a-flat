type MessageSent = Pick<IListingMessage, "messageSent">;

interface IListingService {
  getListing(id: string): IListing;
  getListings(filter?: MessageSent): IListing[];
  createListing(listing: IListing): void;
  createListings(listings: IListing[]): void;
  updateListing(listing: IListing): void;
}
