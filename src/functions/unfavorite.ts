import { CommandInteraction, Message, MessageFlags } from 'discord.js'
import { findPlayer, findPlayerById, findUser, updatePlayerFav } from '../database/dbQuerys'
import { PlayerInterface } from '../interfaces/interfaces.export'
import { escapeFormatting } from '../auxiliarfunctions/auxiliarfunctions.export'

export default async function unfavorite(interaction: CommandInteraction | Message) {
    let user: string

    if(interaction instanceof CommandInteraction) {
        user = interaction.user.id
    } else {
        user = interaction.author.id
    }

    let players_to_unfv: number = 0

    try {
        const user_db = await findUser(user)

        if(!user_db) {
            if(interaction instanceof CommandInteraction) {
                interaction.reply({ content: 'You have to register yourself to unfavorite players!', flags: MessageFlags.Ephemeral })
            } else {
                interaction.reply('You have to register yourself to unfavorite players!')
            }

            return
        }

        const query = interaction instanceof CommandInteraction ? interaction.options.get('query', true).value?.toString().split(' ') : interaction.content.split(' ')
        if(interaction instanceof Message) query?.shift()
        
        if(!query || query.length < 1) {
            if(interaction instanceof CommandInteraction) {
                interaction.reply({ content: 'Use the command right: &unfavorite | &unfv [id1] ["name1"]...', flags: MessageFlags.Ephemeral })
            } else {
                interaction.reply('Use the command right: &unfavorite | &unfv [id1] ["name1"]...')
            }

            return
        }

        const players_favorite: PlayerInterface[] = []

        for(const player of query) {
            const id_regex = /^\d+$/
            const name_regex = /^".+"$/

            if(id_regex.test(player)) {
                const player_db = await findPlayerById(parseInt(player))

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

                if(player_db.player_fav) {
                    player_db.player_name = await escapeFormatting(player_db.player_name)
                    players_to_unfv++
                    players_favorite.push(player_db)
                }

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
                        await interaction.reply({ content: `You can't unfavorite the player: **${await escapeFormatting(player_db.player_name)}**!`, flags: MessageFlags.Ephemeral })
                    } else {
                        await interaction.reply(`You can't unfavorite the player: **${await escapeFormatting(player_db.player_name)}**!`)
                    }
            
                    return
                }

                if(player_db.player_fav) {
                    player_db.player_name = await escapeFormatting(player_db.player_name)
                    players_to_unfv++
                    players_favorite.push(player_db)
                }

            } else {

                if(interaction instanceof CommandInteraction) {
                    await interaction.reply({ content: `Incorrect query! Try use those parameters: [id1] ["name1"]...`, flags: MessageFlags.Ephemeral })
                } else {
                    await interaction.reply(`Incorrect query! Try use those parameters: [id1] ["name1"]...`)
                }
        
                return
            }
        }

        if(players_to_unfv < 1) {
            interaction.reply('You unfavorited nothing!!')
            return
        }

        for(const player of players_favorite) {
            await updatePlayerFav(player.player_id, false)
        }

        const string = players_favorite.map(p => p.player_name).join(', ')
        interaction.reply(`Players **${string}** unfavorited!`)

    } catch (err) {
        if(interaction instanceof CommandInteraction) {
            interaction.reply({ content: `Error on favorite function`, flags: MessageFlags.Ephemeral })
        } else {
            interaction.reply(`Error on unfavorite function`)
        }

        console.error('Error on unfavorite function', err)
        return
    }
}