const {
  getMessageTemplate,
  generateChatGptMessage,
  sendMessage,
} = require("../services/requests");

async function contactListing(listing) {
  prepareMessageTemplate(listing.lang, listing.owner).then(
    async (messageTemplate) => {
      const message = process.env.CHATGPT_MESSAGE
        ? await generateChatGptMessage(
            listing.desciption,
            messageTemplate,
            listing.language
          )
        : messageTemplate;

      const messageSent = await sendMessage(listing.id, message);

      if (messageSent) {
        db.get("listings")
          .find({ id: listing.id })
          .assign({
            message: {
              messageSent: 1,
              content: message,
            },
          })
          .write();
      }
    }
  );
}

async function prepareMessageTemplate(language, owner) {
  const messageTemplateId =
    language === "eng" ? process.env.MESSAGE_ENG : process.env.MESSAGE_GER;
  const messageTemplate = await getMessageTemplate(messageTemplateId);
  messageTemplate.replaceAll("@owner_name", owner);
  return messageTemplate;
}

module.exports = contactListing;
