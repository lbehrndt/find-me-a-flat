interface ListeningDB {
    listings: Listening[];
}
interface Listening {
    id: String;
    owner: String;
    url: String;
    title: String;
    description: String;
    lang: String;
    message: ListeningMessage;
}
interface ListeningMessage {
    content: String;
    messageSent: boolean;
}