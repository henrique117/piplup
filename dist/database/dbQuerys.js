"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlayer = exports.deleteItem = exports.deleteUser = exports.updateUserCoins = exports.itemsList = exports.findItem = exports.findUser = exports.findPlayer = exports.newPurchase = exports.insertItem = exports.insertPlayersInArray = exports.insertUser = exports.insertPlayer = void 0;
const createDatabase_1 = require("./createDatabase");
const insertPlayer = async (player_name, player_rank, player_pfp) => {
    const query = `INSERT INTO Players (player_name, player_rank, player_pfp, player_cost, user_id)
                   VALUES (?, ?, ?, ?, NULL)`;
    const player_cost = (1700 / Math.pow(player_rank, 0.1727) - 178) + (-0.0020500205002 * player_rank + 205);
    return new Promise((resolve, reject) => {
        createDatabase_1.default.run(query, [player_name, player_rank, player_pfp, Math.round(player_cost)], (err) => {
            if (err) {
                console.error(`Error inserting player: ${err.message}`);
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.insertPlayer = insertPlayer;
const insertUser = async (user_id, user_username, user_globalName) => {
    const query = `INSERT INTO Users (user_id, user_username, user_globalname, user_coins, user_commonPacks, user_rarePacks, user_epicPacks, user_legendaryPacks, user_ultimatePacks)
                   VALUES (?, ?, ?, 50, 0, 0, 0, 0, 0)`;
    const globalName = user_globalName ? user_globalName : null;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.run(query, [user_id, user_username, globalName], (err) => {
            if (err) {
                console.error(`Error inserting user: ${err.message}`);
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.insertUser = insertUser;
const insertPlayersInArray = async (data) => {
    const values = data.map(d => {
        const player_cost = (1700 / Math.pow(d.player_rank, 0.1727) - 178) + (-0.0020500205002 * d.player_rank + 205);
        return `('${d.player_name}', ${d.player_rank}, '${d.player_pfp}', ${Math.round(player_cost)}, NULL)`;
    }).join(', ');
    const query = `INSERT INTO players (player_name, player_rank, player_pfp, player_cost, user_id) VALUES ${values}`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.run(query, (err) => {
            if (err) {
                console.error(`Error inserting player: ${err.message}`);
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.insertPlayersInArray = insertPlayersInArray;
const insertItem = async (item_name, item_description, item_cost) => {
    const query = `INSERT INTO Items (item_name, item_description, item_cost) VALUES (?, ?, ?)`;
    const description = item_description ? item_description : 'NULL';
    return new Promise((resolve, reject) => {
        createDatabase_1.default.run(query, [item_name, description, item_cost], (err) => {
            if (err) {
                console.error(`Error inserting item: ${err.message}`);
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.insertItem = insertItem;
const newPurchase = async (user_id, item_id) => {
    const query = `INSERT INTO Items_Users (user_id, item_id) VALUES (?, ?)`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.run(query, [user_id, item_id], (err) => {
            if (err) {
                console.error(`Error inserting new purchase: ${err.message}`);
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.newPurchase = newPurchase;
const findPlayer = async (player_name) => {
    const query = [`SELECT * FROM Players WHERE player_name = ?`, player_name];
    return new Promise((resolve, reject) => {
        createDatabase_1.default.get(query[0], query[1], (err, row) => {
            if (err) {
                console.error(`Error fetching player: ${err.message}`);
                reject(err);
            }
            else {
                resolve(row);
            }
        });
    });
};
exports.findPlayer = findPlayer;
const findUser = async (user_id) => {
    const query = `SELECT * FROM Users WHERE user_id = ?`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.get(query, user_id, (err, row) => {
            if (err) {
                console.error(`Error fetching user: ${err.message}`);
                reject(err);
            }
            else {
                resolve(row);
            }
        });
    });
};
exports.findUser = findUser;
const findItem = async (item_id) => {
    const query = `SELECT * FROM Items WHERE item_id = ?`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.get(query, item_id, (err, row) => {
            if (err) {
                console.error(`Error fetching item: ${err.message}`);
                reject(err);
            }
            else {
                resolve(row);
            }
        });
    });
};
exports.findItem = findItem;
const itemsList = async () => {
    const query = `SELECT * FROM Items`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.all(query, [], (err, rows) => {
            if (err) {
                console.error(`Error fetching items: ${err.message}`);
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
};
exports.itemsList = itemsList;
const updateUserCoins = async (user_id, new_coins) => {
    const query = `UPDATE Users SET user_coins = ? WHERE user_id = ?`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.run(query, [new_coins, user_id], (err) => {
            if (err) {
                console.error(`Error updating user: ${err.message}`);
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.updateUserCoins = updateUserCoins;
const deleteUser = async (user_id) => {
    const query = [
        `UPDATE Players SET user_id = NULL WHERE user_id = ?`,
        `DELETE FROM Users WHERE user_id = ?`
    ];
    return new Promise((resolve, reject) => {
        createDatabase_1.default.run(query[0], [user_id], (err) => {
            if (err) {
                console.error(`Error updating player: ${err.message}`);
                reject(err);
            }
            else {
                resolve();
            }
        });
        createDatabase_1.default.run(query[1], [user_id], (err) => {
            if (err) {
                console.error(`Error deleting user: ${err.message}`);
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.deleteUser = deleteUser;
const deleteItem = async (item_id) => {
    const query = `DELETE FROM Items WHERE item_id = ?`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.run(query, [item_id], (err) => {
            if (err) {
                console.error(`Error on delete item: ${err.message}`);
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.deleteItem = deleteItem;
const deletePlayer = async (player_name) => {
    const query = `DELETE FROM Players WHERE player_name = ?`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.run(query, [player_name], (err) => {
            if (err) {
                console.error(`Error on delete player: ${err.message}`);
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.deletePlayer = deletePlayer;
