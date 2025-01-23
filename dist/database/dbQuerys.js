"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayersForPack = exports.deleteChannel = exports.deletePlayer = exports.deleteItem = exports.deleteUser = exports.updatePlayerStatus = exports.updateUserPacks = exports.updateUserCoins = exports.channelList = exports.usersList = exports.myPlayersList = exports.itemsList = exports.findChannel = exports.findItem = exports.findUser = exports.findPlayerById = exports.findPlayerSimilar = exports.findPlayer = exports.newChannel = exports.newPurchase = exports.insertItem = exports.insertPlayersInArray = exports.insertUser = exports.insertPlayer = void 0;
const createDatabase_1 = require("./createDatabase");
const insertPlayer = async (player_name, player_rank, player_pfp, player_flag) => {
    const query = `INSERT INTO Players (player_name, player_rank, player_pfp, player_cost, player_weight, player_flag, user_id)
                   VALUES (?, ?, ?, ?, ?, ?, NULL)`;
    const player_cost = (1700 / Math.pow(player_rank, 0.1727) - 178) + (-0.0020500205002 * player_rank + 205);
    const player_weight = Math.exp(player_cost / 72.7);
    return new Promise((resolve, reject) => {
        createDatabase_1.default.run(query, [player_name, player_rank, player_pfp, Math.round(player_cost), player_weight, player_flag], (err) => {
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
                   VALUES (?, ?, ?, 50, 2, 0, 0, 0, 0)`;
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
        const player_weight = Math.exp(player_cost / 72.7);
        return `('${d.player_name}', ${d.player_rank}, '${d.player_pfp}', ${Math.round(player_cost)}, ${player_weight}, '${d.player_flag}', NULL)`;
    }).join(', ');
    const query = `INSERT INTO players (player_name, player_rank, player_pfp, player_cost, player_weight, player_flag, user_id) VALUES ${values}`;
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
const newChannel = async (channel_id, guild_id) => {
    const query = `INSERT INTO Channels (channel_id, guild_id) VALUES (?, ?)`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.run(query, [channel_id, guild_id], (err) => {
            if (err) {
                console.error(`Error inserting new guild: ${err.message}`);
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.newChannel = newChannel;
const findPlayer = async (player_name) => {
    const query = `SELECT * FROM Players WHERE LOWER(player_name) = ?`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.get(query, [player_name], (err, row) => {
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
const findPlayerSimilar = async (player_name) => {
    const query = `SELECT * FROM Players WHERE LOWER(player_name) LIKE ? OR LOWER(player_name) LIKE ? OR LOWER(player_name) LIKE ? ORDER BY player_rank LIMIT 10`;
    const nameLength = player_name.length;
    const chunkSize = Math.min(4, nameLength);
    const middleStart = Math.max(0, Math.floor(nameLength / 2) - Math.floor(chunkSize / 2));
    const search = [
        `${player_name.slice(0, chunkSize)}%`,
        `%${player_name.slice(middleStart, middleStart + chunkSize)}%`,
        `%${player_name.slice(-chunkSize)}`
    ];
    return new Promise((resolve, reject) => {
        createDatabase_1.default.all(query, [search[0], search[1], search[2]], (err, rows) => {
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
exports.findPlayerSimilar = findPlayerSimilar;
const findPlayerById = async (player_id) => {
    const query = `SELECT * FROM Players WHERE player_id = ?`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.get(query, player_id, (err, row) => {
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
exports.findPlayerById = findPlayerById;
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
const findChannel = async (channel_id, guild_id) => {
    const query = `SELECT * FROM Channels WHERE channel_id = ? AND guild_id = ?`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.get(query, [channel_id, guild_id], (err, row) => {
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
exports.findChannel = findChannel;
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
const myPlayersList = async (user_id) => {
    const query = `SELECT * FROM Players WHERE user_id = ? ORDER BY player_rank`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.all(query, [user_id], (err, rows) => {
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
exports.myPlayersList = myPlayersList;
const usersList = async () => {
    const query = `SELECT * FROM Users`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.all(query, [], (err, rows) => {
            if (err) {
                console.error(`Error fetching users: ${err.message}`);
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
};
exports.usersList = usersList;
const channelList = async (guild_id) => {
    const query = `SELECT * FROM Channels WHERE guild_id = ?`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.all(query, [guild_id], (err, rows) => {
            if (err) {
                console.error(`Error fetching users: ${err.message}`);
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
};
exports.channelList = channelList;
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
const updateUserPacks = async (user_id, pack_type, increase) => {
    const validPackTypes = [
        "user_commonPacks",
        "user_rarePacks",
        "user_epicPacks",
        "user_legendaryPacks",
        "user_ultimatePacks"
    ];
    if (!validPackTypes.includes(pack_type)) {
        throw new Error('Invalid pack type');
    }
    const query = `UPDATE Users SET ${pack_type} = ${pack_type} ${increase ? '+' : '-'} 1 WHERE user_id = ?`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.run(query, [user_id], (err) => {
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
exports.updateUserPacks = updateUserPacks;
const updatePlayerStatus = async (player_id, user_id) => {
    const query = `UPDATE Players SET user_id = ? WHERE player_id = ?`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.run(query, [user_id, player_id], (err) => {
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
exports.updatePlayerStatus = updatePlayerStatus;
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
const deleteChannel = async (channel_id, guild_id) => {
    const query = `DELETE FROM Channels WHERE channel_id = ? AND guild_id = ?`;
    return new Promise((resolve, reject) => {
        createDatabase_1.default.run(query, [channel_id, guild_id], (err) => {
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
exports.deleteChannel = deleteChannel;
const getPlayersForPack = async (pack_type) => {
    let query = `
        SELECT player_id, player_name, player_rank, player_pfp, player_cost, player_flag, user_id
        FROM Players
        ORDER BY player_weight * ABS(RANDOM())
        LIMIT 2;
    `;
    const players = await new Promise((resolve, reject) => {
        createDatabase_1.default.all(query, [], (err, rows) => {
            if (err) {
                console.error(`Error fetching players: ${err.message}`);
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
    switch (pack_type) {
        case 'ultimate':
            query = `
                SELECT player_id, player_name, player_rank, player_pfp, player_cost, player_flag, user_id
                FROM Players
                WHERE player_rank < 101
                ORDER BY player_weight * ABS(RANDOM())
                LIMIT 1;
            `;
            const ultimate_player = await new Promise((resolve, reject) => {
                createDatabase_1.default.get(query, [], (err, row) => {
                    if (err) {
                        console.error(`Error fetching players: ${err.message}`);
                        reject(err);
                    }
                    else {
                        resolve(row);
                    }
                });
            });
            players.push(ultimate_player);
            break;
        case 'legendary':
            query = `
                SELECT player_id, player_name, player_rank, player_pfp, player_cost, player_flag, user_id
                FROM Players
                WHERE player_rank < 1001
                ORDER BY player_weight * ABS(RANDOM())
                LIMIT 1;
            `;
            const legendary_player = await new Promise((resolve, reject) => {
                createDatabase_1.default.get(query, [], (err, row) => {
                    if (err) {
                        console.error(`Error fetching players: ${err.message}`);
                        reject(err);
                    }
                    else {
                        resolve(row);
                    }
                });
            });
            players.push(legendary_player);
            break;
        case 'epic':
            query = `
                SELECT player_id, player_name, player_rank, player_pfp, player_cost, player_flag, user_id
                FROM Players
                WHERE player_rank < 10001
                ORDER BY player_weight * ABS(RANDOM())
                LIMIT 1;
            `;
            const epic_player = await new Promise((resolve, reject) => {
                createDatabase_1.default.get(query, [], (err, row) => {
                    if (err) {
                        console.error(`Error fetching players: ${err.message}`);
                        reject(err);
                    }
                    else {
                        resolve(row);
                    }
                });
            });
            players.push(epic_player);
            break;
        case 'rare':
            query = `
                SELECT player_id, player_name, player_rank, player_pfp, player_cost, player_flag, user_id
                FROM Players
                WHERE player_rank < 50001
                ORDER BY player_weight * ABS(RANDOM())
                LIMIT 1;
            `;
            const rare_player = await new Promise((resolve, reject) => {
                createDatabase_1.default.get(query, [], (err, row) => {
                    if (err) {
                        console.error(`Error fetching players: ${err.message}`);
                        reject(err);
                    }
                    else {
                        resolve(row);
                    }
                });
            });
            players.push(rare_player);
            break;
        case 'common':
            query = `
                SELECT player_id, player_name, player_rank, player_pfp, player_cost, player_flag, user_id
                FROM Players
                ORDER BY player_weight * ABS(RANDOM())
                LIMIT 1;
            `;
            const common_player = await new Promise((resolve, reject) => {
                createDatabase_1.default.get(query, [], (err, row) => {
                    if (err) {
                        console.error(`Error fetching players: ${err.message}`);
                        reject(err);
                    }
                    else {
                        resolve(row);
                    }
                });
            });
            players.push(common_player);
            break;
        default:
            throw new Error("Invalid pack type");
    }
    return players;
};
exports.getPlayersForPack = getPlayersForPack;
