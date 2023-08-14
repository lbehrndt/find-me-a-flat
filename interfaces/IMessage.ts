import { IListing } from "./IListing";

export interface IMessageData {
  user_id: string;
  csrf_token: string;
  messages: IMessage;
  ad_type: "0";
  ad_id: IListing["id"];
}

export interface IMessage {
  content: string;
  message_type: "text";
}
	