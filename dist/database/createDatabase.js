"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require("sqlite3");
const path = require("path");
sqlite3.verbose();
const dbPath = path.join(__dirname, './database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(`Error connecting to database: ${err.message}`);
        return;
    }
    console.log(`Connected at ${dbPath}`);
});
const createUsersTable = `
CREATE TABLE IF NOT EXISTS Users (
  user_id TEXT PRIMARY KEY UNIQUE,
  user_username TEXT NOT NULL,
  user_globalName TEXT,
  user_coins INT NOT NULL,
  user_commonPacks INT NOT NULL,
  user_rarePacks INT NOT NULL,
  user_epicPacks INT NOT NULL,
  user_legendaryPacks INT NOT NULL,
  user_ultimatePacks INT NOT NULL
);`;
const createPlayersTable = `
CREATE TABLE IF NOT EXISTS Players (
  player_id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_name TEXT NOT NULL,
  player_rank INT NOT NULL,
  player_pfp TEXT NOT NULL,
  player_cost INT NOT NULL,
  user_id TEXT,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);`;
const runQuery = (query) => {
    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if (err) {
                console.error(`Error executing query: ${err.message}`);
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
const initializeDatabase = async () => {
    try {
        await runQuery(createUsersTable);
        await runQuery(createPlayersTable);
        console.log('Tables created or already exist');
    }
    catch (error) {
        console.error('Failed to create tables', error);
    }
};
initializeDatabase();
exports.default = db;
