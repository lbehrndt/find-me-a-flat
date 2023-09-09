type MessageTemplateDetails = Pick<IListing, "lang" | "owner">;
type MessageDetails = MessageTemplateDetails & Pick<IListing, "description">;
type ChatGptMessageParams = MessageDetails & MessageContent;
type SendMessageParams = Pick<IListing, "id"> & MessageContent;
