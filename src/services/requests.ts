import axios from "axios";
import {headers, logger, loginData} from "../app";
import {UserData} from "../models/UserData";
import OpenAI from 'openai';



// Local Data
export let userData: UserData;
export async function getDocument(url: string) {
    return axios({
        method: 'get',
        url: url,
        headers: headers
    })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            logger.error(err);
        });
}

export async function login() {
    axios({
        method: 'POST',
        data: loginData,
        url: process.env.LOGIN_URL,
    }).then((response) => {
        if (response.status === 200) {
            logger.info("Login successful");
            logger.debug(response.data);
            userData = response.data;
            headers["cookie"] = response.headers["set-cookie"].toString();
        }
    })
        .catch((err) => {
            logger.error(`Login error: ${err}`);
        });
}

export async function getMessageTemplate(messageId) {
    return axios({
        method: "get",
        url: process.env.MESSAGE_TEMPLATE_URL,
        headers: headers,
    })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            logger.error(err);
        });
}

export async function sendMessage(listingId: String, message: String) {
    const messageData = {
        user_id: userData.user_id,
        csrf_token: userData.csrf_token,
        messages: [{ content: message, message_type: "text " }],
        ad_type: "0",
        ad_id: listingId,
    };

    return axios({
        method: "post",
        url: process.env.SEND_MESSAGE_URL,
        headers: headers,
        data: messageData,
    })
        .then((response) => {
            if (response.status === 200) {
                logger.info("Contacted listing:", listingId);
                return true;
            }
        })
        .catch((err) => {
            return false;
        });
}
export async function generateChatGptMessage(description: String, template: String, language: String) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const adjectives = getAdjectives();
    const chatGptRequest = `Imagine you are looking for a room. I will give you a description of a listing and a message template. You will rewrite this message based on the provided description. I want it to sound ${adjectives}. Here is the description: "${description}". And here is the message template: "${template}". Based on this, rewrite the message in ${language}.`;
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: chatGptRequest }],
        model: 'gpt-3.5-turbo',
    });
    const chatGptResponse = completion.choices[0].message.content;

    logger.debug("Request: ", chatGptRequest);
    logger.debug("Response: ", chatGptResponse);
}

function getAdjectives() {
    let tonality = "";

    const adjectives = process.env.TONALITY.split(",");
    const wordsCount = adjectives.length;
    adjectives.forEach((adjective, index) => {
        index < wordsCount - 1
            ? tonality + adjective + ", "
            : tonality + "and " + adjective;
    });
    return tonality;
}