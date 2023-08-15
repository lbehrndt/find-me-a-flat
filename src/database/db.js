const Low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");

const db = Low(adapter);
db.defaults({ listings: [] }).write();

module.exports = db;
