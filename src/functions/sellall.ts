import { CommandInteraction, Message, MessageFlags, TextChannel } from 'discord.js'
import { findUser, myPlayersList, updateUserCoins, updatePlayerStatus } from '../database/dbQuerys'

export default async function sellall(interaction: CommandInteraction | Message): Promise<void> {

    if(interaction instanceof CommandInteraction) {

        const user = interaction.user.id

        try {

            const user_db = await findUser(user)

            if(!user_db) {
                if(interaction instanceof CommandInteraction) interaction.reply({ content: "You have to register yourself to get and sell players", flags: MessageFlags.Ephemeral})
                return
            }

            const channel: TextChannel | null = interaction.channel instanceof TextChannel ? interaction.channel : null
            const filter = (msg: Message) => msg.author.id === user
            
            if(!channel) {
                if(interaction instanceof CommandInteraction) interaction.reply({ content: "Channel not found! Use a valid channel!!", flags: MessageFlags.Ephemeral})
                return
            }

            const player_list = await myPlayersList(user)

            if(player_list.length < 1) {
                if(interaction instanceof CommandInteraction) interaction.reply({ content: "You don't have any players to sell!", flags: MessageFlags.Ephemeral})
                return
            }

            interaction.reply('Are you sure you wanna sell everything? (y/n)')

            const collector = channel.createMessageCollector({ filter, time: 30000 })

            collector.on('collect', async (m: Message) => {
                if(m.content.toLocaleLowerCase() === 'y') {

                    let sellValue: number = 0

                    for(const player of player_list) {
                        try {

                            if(player.player_id) await updatePlayerStatus(player.player_id, 'NULL')
                            if(player.player_cost) sellValue += player.player_cost

                        } catch (err) {
                            channel.send('Error on sellall')
                            console.error('Error on sellall', err)
                            return
                        }
                    }

                    await updateUserCoins(user, user_db.user_coins + sellValue)

                    channel.send(`All players of <@${user}> were sold and are now available to get! Sold for a total of **${sellValue}** :coin:`)
                    collector.stop('confirmed')

                } else if(m.content.toLocaleLowerCase() === 'n') {
                    collector.stop('canceled')
                } else {
                    return
                }
            })

            collector.on('end', async (_, reason: string) => {
                if(reason === 'canceled') {
                    await channel.send(`Operation canceled... nothing was sold <@${user}>`)
                    return
                } else if(reason === 'confirmed') {
                    return
                } else {
                    await channel.send(`Timer expired, if you wanna sell everything try again <@${user}>`)
                    return
                }
            })

        } catch (err) {
            interaction.reply(`Error on sellall function: ${user}`)
            console.error(`Error on sellall function: ${user}`, err)
            return
        }
    }

    if(interaction instanceof Message) {

        const user = interaction.author.id

        try {

            const user_db = await findUser(user)

            if(!user_db) {
                interaction.reply("You have to register yourself to get and sell players")
                return
            }

            const channel: TextChannel | null = interaction.channel instanceof TextChannel ? interaction.channel : null
            const filter = (msg: Message) => msg.author.id === user
            
            if(!channel) {
                interaction.reply("Channel not found! Use a valid channel!!")
                return
            }

            const player_list = await myPlayersList(user)

            if(player_list.length < 1) {
                interaction.reply("You don't have any players to sell!")
                return
            }

            interaction.reply('Are you sure you wanna sell everything? (y/n)')

            const collector = channel.createMessageCollector({ filter, time: 30000 })

            collector.on('collect', async (m: Message) => {
                if(m.content.toLocaleLowerCase() === 'y') {

                    let sellValue: number = 0

                    for(const player of player_list) {
                        try {

                            if(player.player_id) await updatePlayerStatus(player.player_id, 'NULL')
                            if(player.player_cost) sellValue += player.player_cost

                        } catch (err) {
                            channel.send('Error on sellall')
                            console.error('Error on sellall', err)
                            return
                        }
                    }

                    await updateUserCoins(user, user_db.user_coins + sellValue)

                    channel.send(`All players of <@${user}> were sold and are now available to get! Sold for a total of **${sellValue}** :coin:`)
                    collector.stop('confirmed')

                } else if(m.content.toLocaleLowerCase() === 'n') {
                    collector.stop('canceled')
                } else {
                    return
                }
            })

            collector.on('end', async (_, reason: string) => {
                if(reason === 'canceled') {
                    await channel.send(`Operation canceled... nothing was sold <@${user}>`)
                    return
                } else if(reason === 'confirmed') {
                    return
                } else {
                    await channel.send(`Timer expired, if you wanna sell everything try again <@${user}>`)
                    return
                }
            })

        } catch (err) {
            interaction.reply(`Error on sellall function: ${user}`)
            console.error(`Error on sellall function: ${user}`, err)
            return
        }
    }
}