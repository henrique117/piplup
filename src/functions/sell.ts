import { CommandInteraction, Message, MessageFlags } from 'discord.js'
import { findPlayer, findPlayerById, findUser, updatePlayerStatus, updateUserCoins } from '../database/dbQuerys'
import { PlayerInterface } from '../interfaces/interfaces.export'

export default async function sell(interaction: CommandInteraction | Message): Promise<void> {

    if(interaction instanceof CommandInteraction) {

        const query = interaction.options.get('query', true).value?.toString()
        const user = interaction.user.id
        
        if(!query) {
            interaction.reply({ content: 'Bruh', flags: MessageFlags.Ephemeral})
            console.error('Bruh')
            return
        }

        try {

            const id_regex = /^\d+/
            const name_regex = /^"(.+)"$/

            if(!id_regex.exec(query) && !name_regex.exec(query)) {
                interaction.reply({ content: 'Type a valid ID or use " " to sell player using the name', flags: MessageFlags.Ephemeral})
                return
            }

            let player_db: PlayerInterface | null

            if(id_regex.exec(query) && !name_regex.exec(query)) {
                player_db = await findPlayerById(parseInt(query))
            } else if(!id_regex.exec(query) && name_regex.exec(query)) {
                player_db = await findPlayer(query.split('"')[1])
            } else {
                player_db = null
            }

            const user_db = await findUser(user)

            if(!user_db) {
                interaction.reply({ content: "You have to register yourself to get and sell players", flags: MessageFlags.Ephemeral})
                return
            }

            if(!player_db) {
                interaction.reply({ content: "Player not found! Type a valid ID", flags: MessageFlags.Ephemeral})
                return
            }

            if(player_db.user_id != user_db.user_id) {
                interaction.reply({ content: "You can't sell this player!", flags: MessageFlags.Ephemeral})
                return
            }

            if(player_db.player_id && player_db.player_cost) {
                await updatePlayerStatus(player_db.player_id, 'NULL')
                await updateUserCoins(user_db.user_id, user_db.user_coins + player_db.player_cost)

                interaction.reply({ content: `Player **${player_db.player_name}** sold and is now available to get again! Sold for **${player_db.player_cost}** :coin:` })
            }

            return

        } catch (err) {
            interaction.reply({ content: `Error fetching user: ${user}`, flags: MessageFlags.Ephemeral })
            console.error(`Error fetching user: ${user}`)
            return
        }
    }

    if (interaction instanceof Message) {

        const query = interaction.content
        const user = interaction.author.id
        
        if(!query) {
            interaction.reply('Bruh')
            console.error('Bruh')
            return
        }

        try {

            const id_regex = /^.+\s\d+$/
            const name_regex = /^.+\s"(.+)"$/

            const user_db = await findUser(user)

            if(!user_db) {
                interaction.reply("You have to register yourself to get and sell players")
                return
            }

            if(!id_regex.exec(query) && !name_regex.exec(query)) {
                interaction.reply('Type a valid ID or use " " to sell player using the name')
                return
            }

            const playersToSell = query.split(' ')
            playersToSell.shift()

            const players_db = []

            for(const player of playersToSell) {
                let player_db: PlayerInterface | null
    
                if(id_regex.exec('&sell ' + player) && !name_regex.exec('&sell ' + player)) {
                    player_db = await findPlayerById(parseInt(player))
                } else if(!id_regex.exec('&sell ' + player) && name_regex.exec('&sell ' + player)) {
                    player_db = await findPlayer(player.split('"')[1])
                } else {
                    player_db = null
                }

                players_db.push(player_db)
            }

            let sellValue: number = 0

            for(const player_db of players_db) {
                if(!player_db) {
                    interaction.reply("Player not found! Type a valid parameter")
                    return
                }
    
                if(player_db.user_id != user_db.user_id) {
                    interaction.reply("You can't sell this player!")
                    return
                }
    
                if(player_db.player_id && player_db.player_cost) {
                    await updatePlayerStatus(player_db.player_id, 'NULL')
                    await updateUserCoins(user_db.user_id, user_db.user_coins + player_db.player_cost)
                    sellValue += player_db.player_cost
                }
            }

            const names_string = players_db.map(player => player?.player_name ? player.player_name : 'Error').join(', ')

            interaction.reply(`Player **${names_string}** are now available to get again! Sold for **${sellValue}** :coin:`)

        } catch (err) {
            interaction.reply(`Error fetching user: ${user}`)
            console.error(`Error fetching user: ${user}`)
            return
        }
    }
}