import db from './createDatabase'
import { UserInterface } from '../interfaces/interfaces.export'

export const insertPlayer = async (player_name: string, player_rank: number, player_pfp: string): Promise<void> => {
    const query = `INSERT INTO Players (player_name, player_rank, player_cost, user_id)
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

export const insertPlayersInArray = async (data: {player_name: string, player_rank: number, player_pfp: string}[]) => {
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

export const findPlayer = async (player_name: string) => {
    const query = [`SELECT * FROM Players WHERE player_name = ?`, player_name]

    return new Promise((resolve, reject) => {
        db.get(query[0], query[1], (err, row) => {
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

export const updateUserCoins = async (user_id: string, new_coins: number) => {
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