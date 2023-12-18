import Requests from "../services/requests.service";
import ListingService from "../services/listings.service";
export default class MessageBot {
  DBService: ListingService;
  listings: Listing[];

  constructor() {
    this.DBService = new ListingService();
    this.listings = this.DBService.getListings({ messageSent: false });
    for (const listing of this.listings) this.contactListing(listing);
  }

  private async contactListing(listing: Listing) {
    let message = await this.prepareMessageTemplate(
      listing.lang,
      listing.owner
    );

    if (Bun.env.CHATGPT_MESSAGE) {
      message = await Requests.generateChatGptMessage({
        listingLanguage: listing.lang,
        listingDescription: listing.description,
        messageTemplate: message,
      });
    }

    this.sendMessage(listing, message);
  }

  private async sendMessage(listing: Listing, message: MessageContent) {
    const messageSent = await Requests.sendMessage(listing.id, message);

    if (messageSent) {
      const messageData: ListingMessage = {
        messageSent: true,
        messageContent: message,
      };

      listing.message = messageData;

      this.DBService.updateListing(listing);
    }
  }

  private async prepareMessageTemplate(
    owner: ListingOwner,
    language: ListingLanguage
  ) {
    const messageTemplateId =
      language === "eng" ? Bun.env.MESSAGE_ENG : Bun.env.MESSAGE_GER;
    const messageTemplate = await Requests.getMessageTemplate(
      messageTemplateId
    );
    messageTemplate.replaceAll("@owner_name", owner);
    return messageTemplate;
  }
}
