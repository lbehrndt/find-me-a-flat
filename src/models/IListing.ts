interface IListing {
  id: string;
  owner: string;
  url: string;
  title: string;
  description: string;
  lang: string;
  message: IListingMessage;
}
interface IListingMessage {
  messageContent: MessageContent;
  messageSent: boolean;
}

type MessageContent = string;
