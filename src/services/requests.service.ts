import axios from "axios";
import { logger } from "../app";
import { UserData } from "../models/UserData";
import OpenAI from "openai";

export type ChatGptMessageParams = {
  listingLanguage: ListingLanguage;
  listingDescription: ListingDescription;
  messageTemplate: MessageContent;
};

type MessageTemplateId = string;

export default class RequestService {
  private static userData: UserData;
  private static loginData = {
    login_email_username: Bun.env.WGG_EMAIL,
    login_password: Bun.env.WGG_PASSWORD,
    login_form_auto_login: "1",
    display_language: "de",
  };
  private static headers = {
    "content-type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15",
  };

  static async getDocument(url: string): Promise<string> {
    try {
      const { data, status, statusText, request } = await axios.get(url, {
        headers: this.headers,
        responseType: "document",
      });

      logger.debug(
        `Status ${status} – ${statusText} with request: ${request} \n and response data: ${data}`
      );
      if (data) {
        return data;
      } else {
        logger.error("Empty document!");
      }
    } catch (error) {
      logger.error(error);
    }
  }

  static async login() {
    axios
      .post(Bun.env.LOGIN_URL, this.loginData)
      .then((response) => {
        if (response.status === 200) {
          this.userData = response.data;
          this.headers["cookie"] = response.headers["Set-Cookie"].toString();

          logger.debug(response.data);
          logger.info("Login successful!");
        }
      })
      .catch((err) => {
        logger.error(`Login error: ${err}`);
      });
  }

  static async getMessageTemplate(
    templateId: MessageTemplateId
  ): Promise<string> {
    return axios({
      method: "get",
      url: Bun.env.MESSAGE_TEMPLATE_URL + templateId,
      headers: this.headers,
    })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        logger.error(err);
      });
  }

  static async sendMessage(listingId: string, message: MessageContent) {
    const messageData = {
      user_id: this.userData.user_id,
      csrf_token: this.userData.csrf_token,
      messages: [{ content: message, message_type: "text" }],
      ad_type: "0",
      ad_id: listingId,
    };

    return axios({
      method: "post",
      url: Bun.env.SEND_MESSAGE_URL,
      headers: this.headers,
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

  static async generateChatGptMessage(data: ChatGptMessageParams) {
    const openai = new OpenAI({
      apiKey: Bun.env.OPENAI_API_KEY,
    });

    const adjectives = this.getAdjectives();
    const chatGptRequest = `Imagine you are looking for a room. I will give you a description of a listing and a message template. You will rewrite this message based on the provided description. I want it to sound ${adjectives}. Here is the description: "${data.listingDescription}". And here is the message template: "${data.messageTemplate}". Based on this, rewrite the message in ${data.listingLanguage}.`;
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: chatGptRequest }],
      model: "gpt-3.5-turbo",
    });
    const chatGptResponse = completion.choices[0].message.content;

    logger.debug("Request: ", chatGptRequest);
    logger.debug("Response: ", chatGptResponse);

    return chatGptResponse;
  }

  private static getAdjectives() {
    let tonality = "";

    const adjectives = Bun.env.TONALITY.split(",");
    const wordsCount = adjectives.length;
    adjectives.forEach((adjective, index) => {
      index < wordsCount - 1
        ? tonality + adjective + ", "
        : tonality + "and " + adjective;
    });
    return tonality;
  }
}
