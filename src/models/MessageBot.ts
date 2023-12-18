type MessageTemplateParams = Pick<Listing, "lang" | "owner">;
type MessageTemplate = MessageContent;
type SendMessageParams = Pick<Listing, "id"> & MessageContent;
