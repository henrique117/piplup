import { CommandInteraction, Message, MessageFlags } from 'discord.js'
import { findPlayer, findPlayerById, findUser, updatePlayerFav } from '../database/dbQuerys'
import { PlayerInterface } from '../interfaces/interfaces.export'
import { escapeFormatting } from '../auxiliarfunctions/auxiliarfunctions.export'

export default async function favorite(interaction: CommandInteraction | Message) {
    let user: string

    if(interaction instanceof CommandInteraction) {
        user = interaction.user.id
    } else {
        user = interaction.author.id
    }

    try {
        const user_db = await findUser(user)

        if(!user_db) {
            if(interaction instanceof CommandInteraction) {
                interaction.reply({ content: 'You have to register yourself to favorite players!', flags: MessageFlags.Ephemeral })
            } else {
                interaction.reply('You have to register yourself to favorite players!')
            }

            return
        }

        const query = interaction instanceof CommandInteraction ? interaction.options.get('query', true).value?.toString().split(' ') : interaction.content.split(' ')
        if(interaction instanceof Message) query?.shift()
        
        if(!query || query.length < 1) {
            if(interaction instanceof CommandInteraction) {
                interaction.reply({ content: 'Use the command right: &favorite | &fv [id1] ["name1"]...', flags: MessageFlags.Ephemeral })
            } else {
                interaction.reply('Use the command right: &favorite | &fv [id1] ["name1"]...')
            }

            return
        }

        const players_favorite: PlayerInterface[] = []

        console.log(query)

        for(const player of query) {
            const id_regex = /^\d+$/
            const name_regex = /^".+"$/

            if(id_regex.test(player)) {
                const player_db = await findPlayerById(parseInt(player))

                console.log(player_db)

                if(!player_db) {
                    if(interaction instanceof CommandInteraction) {
                        interaction.reply({ content: 'Player not found! Try use those parameters: [id1] ["name1"]...', flags: MessageFlags.Ephemeral })
                    } else {
                        interaction.reply('Player not found! Try use those parameters: [id1] ["name1"]...')
                    }
            
                    return
                }

                if(player_db.user_id != user_db.user_id) {
                    if(interaction instanceof CommandInteraction) {
                        interaction.reply({ content: `You can't favorite the player: **${player_db.player_name}**!`, flags: MessageFlags.Ephemeral })
                    } else {
                        interaction.reply(`You can't favorite the player: **${player_db.player_name}**!`)
                    }
            
                    return
                }

                player_db.player_name = await escapeFormatting(player_db.player_name)

                players_favorite.push(player_db)

            } else if(name_regex.test(player)) {
                const player_db = await findPlayer(player.split('"')[1].toLowerCase())

                if(!player_db) {
                    if(interaction instanceof CommandInteraction) {
                        interaction.reply({ content: 'Player not found! Try use those parameters: [id1] ["name1"]...', flags: MessageFlags.Ephemeral })
                    } else {
                        interaction.reply('Player not found! Try use those parameters: [id1] ["name1"]...')
                    }
            
                    return
                }

                if(player_db.user_id != user_db.user_id) {
                    if(interaction instanceof CommandInteraction) {
                        await interaction.reply({ content: `You can't favorite the player: **${await escapeFormatting(player_db.player_name)}**!`, flags: MessageFlags.Ephemeral })
                    } else {
                        await interaction.reply(`You can't favorite the player: **${await escapeFormatting(player_db.player_name)}**!`)
                    }
            
                    return
                }

                players_favorite.push(player_db)
            } else {
                
                if(interaction instanceof CommandInteraction) {
                    await interaction.reply({ content: `Incorrect query! Try use those parameters: [id1] ["name1"]...`, flags: MessageFlags.Ephemeral })
                } else {
                    await interaction.reply(`Incorrect query! Try use those parameters: [id1] ["name1"]...`)
                }
        
                return
            }
        }

        for(const player of players_favorite) {
            await updatePlayerFav(player.player_id, true)
        }

        const string = players_favorite.map(p => p.player_name).join(', ')
        interaction.reply(`Players **${string}** favorited!`)

    } catch (err) {
        if(interaction instanceof CommandInteraction) {
            interaction.reply({ content: `Error on favorite function`, flags: MessageFlags.Ephemeral })
        } else {
            interaction.reply(`Error on favorite function`)
        }

        console.error('Error on favorite function', err)
        return
    }
}