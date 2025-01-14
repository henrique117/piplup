import { CommandInteraction, EmbedBuilder, Message, MessageFlags } from 'discord.js'
import { findUser, getPlayersForPack, updatePlayerStatus, updateUserCoins, updateUserPacks } from '../database/dbQuerys'
import { embedPagination, playerEmbedBuilder } from '../auxiliarfunctions/auxiliarfunctions.export'

export default async function open(interaction: CommandInteraction | Message) {

    if(interaction instanceof CommandInteraction) {

        const pack_type = interaction.options.get('packtype', true).value?.toString()
        const user_db = await findUser(interaction.user.id)

        if(!pack_type) {
            interaction.reply({ content: 'Bruh', flags: MessageFlags.Ephemeral})
            console.error('Bruh')
            return
        }

        if(!user_db) {
            interaction.reply({ content: 'You have to register yourself to open packs!', flags: MessageFlags.Ephemeral})
            return
        }

        switch(pack_type) {
            case 'common':
                if(user_db.user_commonPacks < 1) {
                    interaction.reply({ content: `You don't have any ${pack_type} packs!`, flags: MessageFlags.Ephemeral})
                    return
                } else {
                    await updateUserPacks(user_db.user_id, `user_${pack_type}Packs`, false)
                }
                break
            case 'rare':
                if(user_db.user_commonPacks < 1) {
                    interaction.reply({ content: `You don't have any ${pack_type} packs!`, flags: MessageFlags.Ephemeral})
                    return
                } else {
                    await updateUserPacks(user_db.user_id, `user_${pack_type}Packs`, false)
                }
                break
            case 'epic':
                if(user_db.user_commonPacks < 1) {
                    interaction.reply({ content: `You don't have any ${pack_type} packs!`, flags: MessageFlags.Ephemeral})
                    return
                } else {
                    await updateUserPacks(user_db.user_id, `user_${pack_type}Packs`, false)
                }
                break
            case 'legendary':
                if(user_db.user_commonPacks < 1) {
                    interaction.reply({ content: `You don't have any ${pack_type} packs!`, flags: MessageFlags.Ephemeral})
                    return
                } else {
                    await updateUserPacks(user_db.user_id, `user_${pack_type}Packs`, false)
                }
                break
            case 'ultimate':
                if(user_db.user_commonPacks < 1) {
                    interaction.reply({ content: `You don't have any ${pack_type} packs!`, flags: MessageFlags.Ephemeral})
                    return
                } else {
                    await updateUserPacks(user_db.user_id, `user_${pack_type}Packs`, false)
                }
                break
            default:
                throw new Error('Invalid pack type')
        }

        try {

            const players = await getPlayersForPack(pack_type)
            players.sort((a, b) => b.player_rank - a.player_rank)
            const packEmbeds: EmbedBuilder[] = []

            let repeatedCardsValue: number = 0

            for(const player of players) {
                const playerEmbed = await playerEmbedBuilder(player)
                packEmbeds.push(playerEmbed)

                if(!player.player_id || !player.player_cost) {
                    interaction.reply({ content: 'Bruh that condition is impossible', flags: MessageFlags.Ephemeral })
                    return
                }

                if(!player.user_id) {
                    await updatePlayerStatus(player.player_id, user_db.user_id)
                } else {
                    await updateUserCoins(user_db.user_id, user_db.user_coins + player.player_cost)
                    repeatedCardsValue += player.player_cost
                }
            }

            await embedPagination(interaction, packEmbeds, `Your ${pack_type} pack was opened! Check what is inside:`, true)
            if(repeatedCardsValue > 0) await interaction.followUp(`Some cards of your pack already has an owner... so you get their value: **+${repeatedCardsValue}** :coin:`)
            return

        } catch (err) {
            interaction.reply({ content: 'Error on open function', flags: MessageFlags.Ephemeral })
            console.error('Error on open function:', interaction.user.id)
            return
        }
    }

    if(interaction instanceof Message) {

        const regex = /^.+\s[a-zA-z]+$/

        if(!regex.exec(interaction.content)) {
            interaction.reply('Invalid command input')
            return
        }

        const pack_type = interaction.content.split(' ')[1].toLowerCase()
        const user_db = await findUser(interaction.author.id)

        if(!pack_type) {
            interaction.reply('Bruh')
            console.error('Bruh')
            return
        }

        if(!user_db) {
            interaction.reply('You have to register yourself to open packs!')
            return
        }

        switch(pack_type) {
            case 'common':
                if(user_db.user_commonPacks < 1) {
                    interaction.reply(`You don't have any ${pack_type} packs!`)
                    return
                } else {
                    await updateUserPacks(user_db.user_id, `user_${pack_type}Packs`, false)
                }
                break
            case 'rare':
                if(user_db.user_commonPacks < 1) {
                    interaction.reply(`You don't have any ${pack_type} packs!`)
                    return
                } else {
                    await updateUserPacks(user_db.user_id, `user_${pack_type}Packs`, false)
                }
                break
            case 'epic':
                if(user_db.user_commonPacks < 1) {
                    interaction.reply(`You don't have any ${pack_type} packs!`)
                    return
                } else {
                    await updateUserPacks(user_db.user_id, `user_${pack_type}Packs`, false)
                }
                break
            case 'legendary':
                if(user_db.user_commonPacks < 1) {
                    interaction.reply(`You don't have any ${pack_type} packs!`)
                    return
                } else {
                    await updateUserPacks(user_db.user_id, `user_${pack_type}Packs`, false)
                }
                break
            case 'ultimate':
                if(user_db.user_commonPacks < 1) {
                    interaction.reply(`You don't have any ${pack_type} packs!`)
                    return
                } else {
                    await updateUserPacks(user_db.user_id, `user_${pack_type}Packs`, false)
                }
                break
            default:
                interaction.reply('Write a valid pack type!!')
                return
        }

        try {

            const players = await getPlayersForPack(pack_type)
            players.sort((a, b) => b.player_rank - a.player_rank)
            const packEmbeds: EmbedBuilder[] = []

            let repeatedCardsValue: number = 0

            for(const player of players) {
                const playerEmbed = await playerEmbedBuilder(player)
                packEmbeds.push(playerEmbed)

                if(!player.player_id || !player.player_cost) {
                    interaction.reply('Bruh that condition is impossible')
                    return
                }

                if(!player.user_id) {
                    await updatePlayerStatus(player.player_id, user_db.user_id)
                } else {
                    await updateUserCoins(user_db.user_id, user_db.user_coins + player.player_cost)
                    repeatedCardsValue += player.player_cost
                }
            }

            await embedPagination(interaction, packEmbeds, `Your ${pack_type} pack was opened! Check what is inside:`, true)
            if(repeatedCardsValue > 0) {
                if(interaction.channel.isSendable()) await interaction.channel.send(`Some cards of your pack already has an owner... so you get their value: **+${repeatedCardsValue}** :coin:`)
            }
            return

        } catch (err) {
            interaction.reply('Error on open function')
            console.error('Error on open function:', interaction.author.id)
            return
        }
    }
}