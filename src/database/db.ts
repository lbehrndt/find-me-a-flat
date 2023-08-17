import 'lowdb';
import 'lowdb/adapters/FileSync';
import FileSync from "lowdb/adapters/FileSync";
import Lowdb from "lowdb";

const adapter = new FileSync<ListeningDB>('db.json');
export const db = Lowdb(adapter);
