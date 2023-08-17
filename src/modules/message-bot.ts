import {generateChatGptMessage, getMessageTemplate, sendMessage} from "../services/requests";
import {db} from "../database/db";

export async function contactListing(listing: Listening) {
    prepareMessageTemplate(listing.lang, listing.owner).then(
        async (messageTemplate) => {
            const message = process.env.CHATGPT_MESSAGE
                ? await generateChatGptMessage(
                    listing.description,
                    messageTemplate,
                    listing.lang
                )
                : messageTemplate;

            const messageSent = await sendMessage(listing.id, message);

            if (messageSent)
                db.get('listings').find(value => value.id == listing.id).update('message', value => {
                    return {
                        messageSent: true, content: message,
                    };
                })
        });

}

async function prepareMessageTemplate(language: String, owner: String) {
    const messageTemplateId =
        language === "eng" ? process.env.MESSAGE_ENG : process.env.MESSAGE_GER;
    const messageTemplate = await getMessageTemplate(messageTemplateId);
    messageTemplate.replaceAll("@owner_name", owner);
    return messageTemplate;
}