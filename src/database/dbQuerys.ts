import db from './createDatabase'
import { ItemInterface, PlayerInterface, UserInterface } from '../interfaces/interfaces.export'

export const insertPlayer = async (player_name: string, player_rank: number, player_pfp: string): Promise<void> => {
    const query = `INSERT INTO Players (player_name, player_rank, player_pfp, player_cost, user_id)
                   VALUES (?, ?, ?, ?, NULL)`

    const player_cost = (1700 / Math.pow(player_rank, 0.1727) - 178) + (-0.0020500205002 * player_rank + 205)

    return new Promise<void>((resolve, reject) => {
        db.run(query, [player_name, player_rank, player_pfp, Math.round(player_cost)], (err) => {
            if(err) {
                console.error(`Error inserting player: ${err.message}`)
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

export const insertUser = async (user_id: string, user_username: string, user_globalName: string | null): Promise<void> => {
    const query = `INSERT INTO Users (user_id, user_username, user_globalname, user_coins, user_commonPacks, user_rarePacks, user_epicPacks, user_legendaryPacks, user_ultimatePacks)
                   VALUES (?, ?, ?, 50, 0, 0, 0, 0, 0)`

    const globalName = user_globalName ? user_globalName : null

    return new Promise<void>((resolve, reject) => {
        db.run(query, [user_id, user_username, globalName], (err) => {
            if(err) {
                console.error(`Error inserting user: ${err.message}`)
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

export const insertPlayersInArray = async (data: {player_name: string, player_rank: number, player_pfp: string}[]): Promise<void> => {
    const values = data.map(d => {
        const player_cost = (1700 / Math.pow(d.player_rank, 0.1727) - 178) + (-0.0020500205002 * d.player_rank + 205)
        return `('${d.player_name}', ${d.player_rank}, '${d.player_pfp}', ${Math.round(player_cost)}, NULL)`
    }).join(', ')

    const query = `INSERT INTO players (player_name, player_rank, player_pfp, player_cost, user_id) VALUES ${values}`

    return new Promise<void>((resolve, reject) => {
        db.run(query, (err) => {
            if(err) {
                console.error(`Error inserting player: ${err.message}`)
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

export const insertItem = async (item_name: string, item_description: string | null, item_cost: number): Promise<void> => {
    const query = `INSERT INTO Items (item_name, item_description, item_cost) VALUES (?, ?, ?)`

    const description = item_description ? item_description : 'NULL'

    return new Promise<void>((resolve, reject) => {
        db.run(query, [item_name, description, item_cost], (err) => {
            if(err) {
                console.error(`Error inserting item: ${err.message}`)
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

export const newPurchase = async (user_id: string, item_id: number): Promise<void> => {
    const query = `INSERT INTO Items_Users (user_id, item_id) VALUES (?, ?)`

    return new Promise<void>((resolve, reject) => {
        db.run(query, [user_id, item_id], (err) => {
            if(err) {
                console.error(`Error inserting new purchase: ${err.message}`)
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

export const findPlayer = async (player_name: string): Promise<PlayerInterface> => {
    const query = [`SELECT * FROM Players WHERE player_name = ?`, player_name]

    return new Promise((resolve, reject) => {
        db.get(query[0], query[1], (err, row: PlayerInterface) => {
            if(err) {
                console.error(`Error fetching player: ${err.message}`)
                reject(err)
            } else {
                resolve(row)
            }
        })
    })
}

export const findUser = async (user_id: string): Promise<UserInterface> => {
    const query = `SELECT * FROM Users WHERE user_id = ?`

    return new Promise((resolve, reject) => {
        db.get(query, user_id, (err, row: UserInterface) => {
            if(err) {
                console.error(`Error fetching user: ${err.message}`)
                reject(err)
            } else {
                resolve(row)
            }
        })
    })
}

export const findItem = async (item_id: number): Promise<ItemInterface> => {
    const query = `SELECT * FROM Items WHERE item_id = ?`

    return new Promise((resolve, reject) => {
        db.get(query, item_id, (err, row: ItemInterface) => {
            if(err) {
                console.error(`Error fetching item: ${err.message}`)
                reject(err)
            } else {
                resolve(row)
            }
        })
    })
}

export const itemsList = async (): Promise<ItemInterface[]> => {
    const query = `SELECT * FROM Items`

    return new Promise((resolve, reject) => {
        db.all(query, [], (err, rows: ItemInterface[]) => {
            if(err) {
                console.error(`Error fetching items: ${err.message}`)
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}

export const updateUserCoins = async (user_id: string, new_coins: number): Promise<void> => {
    const query = `UPDATE Users SET user_coins = ? WHERE user_id = ?`

    return new Promise<void>((resolve, reject) => {
        db.run(query, [new_coins, user_id], (err) => {
            if(err) {
                console.error(`Error updating user: ${err.message}`)
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

export const updateUserPacks = async (user_id: string, pack_type: string): Promise<void> => {

    const validPackTypes = [
        "user_commonPacks",
        "user_rarePacks",
        "user_epicPacks",
        "user_legendaryPacks",
        "user_ultimatePacks"
    ]

    if (!validPackTypes.includes(pack_type)) {
        throw new Error('Invalid pack type')
    }

    const query = `UPDATE Users SET ${pack_type} = ${pack_type} + 1 WHERE user_id = ?`

    return new Promise<void>((resolve, reject) => {
        db.run(query, [user_id], (err) => {
            if(err) {
                console.error(`Error updating user: ${err.message}`)
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

export const deleteUser = async (user_id: string) => {
    const query = [
        `UPDATE Players SET user_id = NULL WHERE user_id = ?`,
        `DELETE FROM Users WHERE user_id = ?`
    ]

    return new Promise<void>((resolve, reject) => {
        db.run(query[0], [user_id], (err) => {
            if(err) {
                console.error(`Error updating player: ${err.message}`)
                reject(err)
            } else {
                resolve()
            }
        })

        db.run(query[1], [user_id], (err) => {
            if(err) {
                console.error(`Error deleting user: ${err.message}`)
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

export const deleteItem = async (item_id: number): Promise<void> => {
    const query = `DELETE FROM Items WHERE item_id = ?`

    return new Promise<void>((resolve, reject) => {
        db.run(query, [item_id], (err) => {
            if(err) {
                console.error(`Error on delete item: ${err.message}`)
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

export const deletePlayer = async (player_name: string): Promise<void> => {
    const query = `DELETE FROM Players WHERE player_name = ?`

    return new Promise<void>((resolve, reject) => {
        db.run(query, [player_name], (err) => {
            if(err) {
                console.error(`Error on delete player: ${err.message}`)
                reject(err)
            } else {
                resolve()
            }
        })
    })
}