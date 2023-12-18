// ListingTypes
type ListingID = string;
type ListingOwner = string;
type ListingURL = string;
type ListingTitle = string;
type ListingLanguage = string;
type ListingDescription = string;

// ListingMessageTypes
type MessageContent = string;
type MessageSent = boolean;

type Listing = {
  id: ListingID;
  owner: ListingOwner;
  url: ListingURL;
  title: ListingTitle;
  description: ListingDescription;
  lang: ListingLanguage;
  message: ListingMessage;
};

type ListingMessage = {
  messageContent: MessageContent;
  messageSent: MessageSent;
};
