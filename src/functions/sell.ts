import { CommandInteraction, Message, MessageFlags } from 'discord.js'
import { findPlayer, findPlayerById, findUser, updatePlayerFav, updatePlayerStatus, updateUserCoins } from '../database/dbQuerys'
import { PlayerInterface } from '../interfaces/interfaces.export'
import { escapeFormatting } from '../auxiliarfunctions/auxiliarfunctions.export'

export default async function sell(interaction: CommandInteraction | Message): Promise<void> {

    if(interaction instanceof CommandInteraction) {

        const query = interaction.options.get('query', true).value?.toString()
        const user = interaction.user.id
        
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
                interaction.reply({ content: "You have to register yourself to get and sell players", flags: MessageFlags.Ephemeral })
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
                    player_db = await findPlayer(player.split('"')[1].toLowerCase())
                } else {
                    player_db = null
                }

                players_db.push(player_db)
            }

            let sellValue: number = 0

            for(const player_db of players_db) {
                if(!player_db) {
                    interaction.reply({ content: "Player not found! Type a valid parameter", flags: MessageFlags.Ephemeral })
                    return
                }
    
                if(player_db.user_id != user_db.user_id) {
                    interaction.reply({ content: "You can't sell this player!", flags: MessageFlags.Ephemeral })
                    return
                }
    
                await updatePlayerStatus(player_db.player_id, null)
                await updatePlayerFav(player_db.player_id, false)
                sellValue += player_db.player_cost

                player_db.player_name = await escapeFormatting(player_db.player_name)
            }

            await updateUserCoins(user_db.user_id, user_db.user_coins + sellValue)

            const names_string = players_db.map(player => player?.player_name ? player.player_name : 'Error').join(', ')

            interaction.reply(`Player **${names_string}** are now available to get again! Sold for **${sellValue}** :coin:`)

        } catch (err) {
            interaction.reply(`Error fetching user: ${user}`)
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
                    player_db = await findPlayer(player.split('"')[1].toLowerCase())
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
    
                await updatePlayerStatus(player_db.player_id, null)
                await updatePlayerFav(player_db.player_id, false)
                sellValue += player_db.player_cost

                player_db.player_name = await escapeFormatting(player_db.player_name)
            }

            await updateUserCoins(user_db.user_id, user_db.user_coins + sellValue)

            const names_string = players_db.map(player => player?.player_name ? player.player_name : 'Error').join(', ')

            interaction.reply(`Player **${names_string}** are now available to get again! Sold for **${sellValue}** :coin:`)

        } catch (err) {
            interaction.reply(`Error fetching user: ${user}`)
            console.error(`Error fetching user: ${user}`)
            return
        }
    }
}