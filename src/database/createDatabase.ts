import * as sqlite3 from 'sqlite3'
import * as path from 'path'

sqlite3.verbose()

const dbPath = path.join(__dirname, './database.db')

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(`Error connecting to database: ${err.message}`)
        return
    }
    console.log(`Connected at ${dbPath}`)
})

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
);`

const createPlayersTable = `
CREATE TABLE IF NOT EXISTS Players (
    player_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    player_rank INT NOT NULL,
    player_pfp TEXT NOT NULL,
    player_cost INT NOT NULL,
    player_weight DOUBLE NOT NULL,
    player_flag TEXT NOT NULL,
    user_id TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);`

const createItemsTable = `
CREATE TABLE IF NOT EXISTS Items (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT NOT NULL,
    item_description TEXT,
    item_cost INT NOT NULL
);`

const createItemsUsersTable = `
CREATE TABLE IF NOT EXISTS Items_Users (
    purchase_id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT NOT NULL,
    item_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
    FOREIGN KEY (item_id) REFERENCES Items(item_id)
);`

const runQuery = (query: string) => {
    return new Promise<void>((resolve, reject) => {
        db.run(query, (err) => {
            if (err) {
                console.error(`Error executing query: ${err.message}`)
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

const initializeDatabase = async () => {
    try {
        await runQuery(createUsersTable)
        await runQuery(createPlayersTable)
        await runQuery(createItemsTable)
        await runQuery(createItemsUsersTable)
        console.log('Tables created or already exist')
    } catch (error) {
        console.error('Failed to create tables', error)
    }
}

initializeDatabase()

export default db