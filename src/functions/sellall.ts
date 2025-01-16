import { CommandInteraction, Message, MessageFlags, TextChannel } from 'discord.js'
import { findUser, myPlayersList, updateUserCoins, updatePlayerStatus, findPlayer, findPlayerById } from '../database/dbQuerys'

export default async function sellall(interaction: CommandInteraction | Message): Promise<void> {

    if(interaction instanceof CommandInteraction) {

        const user = interaction.user.id
        const id_regex = /^\d*$/
        const name_regex = /^("(.+)")*$/

        let query: string[] = []

        const option = interaction.options.get('query')?.value?.toString()
        if(option) query = option.toLowerCase().split(' ')

        if(query.length > 0) {
            query.forEach((parameter: string) => {
                if(!id_regex.test(parameter) && !name_regex.test(parameter)) {
                    interaction.reply({ content: 'Use a valid parameter! Try use &sellall {id1} {"name1"}...', flags: MessageFlags.Ephemeral })
                    return
                }
            })
        }

        try {

            const user_db = await findUser(user)

            if(!user_db) {
                interaction.reply({ content: "You have to register yourself to get and sell players", flags: MessageFlags.Ephemeral })
                return
            }

            const channel: TextChannel | null = interaction.channel instanceof TextChannel ? interaction.channel : null
            const filter = (msg: Message) => msg.author.id === user
            
            if(!channel) {
                interaction.reply({ content: "Channel not found! Use a valid channel!!", flags: MessageFlags.Ephemeral })
                return
            }

            const player_list = await myPlayersList(user)

            if(player_list.length < 1) {
                interaction.reply({ content: "You don't have any players to sell!", flags: MessageFlags.Ephemeral })
                return
            }

            if(query.length > 0) {
                const player_names = []
                for(const param of query) {
                    const player_db = param.startsWith('"') ? await findPlayer(param.split('"')[1].toLowerCase()) : await findPlayerById(parseInt(param))
                    player_names.push(player_db.player_name)
                }
                const string = player_names.join(', ')
                interaction.reply({ content: `Are you sure you wanna sell everything except for **${string}**? (y/n)`, flags: MessageFlags.Ephemeral })
            } else {
                interaction.reply({ content: 'Are you sure you wanna sell everything? (y/n)', flags: MessageFlags.Ephemeral })
            }

            const collector = channel.createMessageCollector({ filter, time: 30000 })

            collector.on('collect', async (m: Message) => {
                if(m.content.toLocaleLowerCase() === 'y') {

                    let sellValue: number = 0

                    for(const player of player_list) {
                        try {

                            if(!player.player_id || !player.player_cost) {
                                interaction.reply('Bruh')
                                return
                            }

                            if(!query.includes(player.player_id.toString()) && !query.includes(`"${player.player_name.toLowerCase()}"`)) {
                                if(player.player_id) await updatePlayerStatus(player.player_id, 'NULL')
                                if(player.player_cost) sellValue += player.player_cost
                            }

                        } catch (err) {
                            channel.send('Error on sellall')
                            console.error('Error on sellall', err)
                            return
                        }
                    }

                    if(sellValue < 1) {
                        channel.send(`Nice <@${user}>, you sold nothing dumb bitch!!!!!!!!!!!`)
                        collector.stop('confirmed')
                        return
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
            interaction.reply({ content: `Error on sellall function: ${user}`, flags: MessageFlags.Ephemeral })
            console.error(`Error on sellall function: ${user}`, err)
            return
        }
    }

    if(interaction instanceof Message) {

        const user = interaction.author.id
        const id_regex = /^\d*$/
        const name_regex = /^("(.+)")*$/

        const query = interaction.content.toLowerCase().split(' ')
        query.shift()

        if(query.length > 0) {
            query.forEach((parameter: string) => {
                if(!id_regex.test(parameter) && !name_regex.test(parameter)) {
                    interaction.reply('Use a valid parameter! Try use &sellall {id1} {"name1"}...')
                    return
                }
            })
        }

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

            if(query.length > 0) {
                const player_names = []
                for(const param of query) {
                    const player_db = param.startsWith('"') ? await findPlayer(param.split('"')[1].toLowerCase()) : await findPlayerById(parseInt(param))
                    player_names.push(player_db.player_name)
                }
                const string = player_names.join(', ')
                interaction.reply(`Are you sure you wanna sell everything except for **${string}**? (y/n)`)
            } else {
                interaction.reply('Are you sure you wanna sell everything? (y/n)')
            }

            const collector = channel.createMessageCollector({ filter, time: 30000 })

            collector.on('collect', async (m: Message) => {
                if(m.content.toLocaleLowerCase() === 'y') {

                    let sellValue: number = 0

                    for(const player of player_list) {
                        try {

                            if(!player.player_id || !player.player_cost) {
                                interaction.reply('Bruh')
                                return
                            }

                            if(!query.includes(player.player_id.toString()) && !query.includes(`"${player.player_name.toLowerCase()}"`)) {
                                if(player.player_id) await updatePlayerStatus(player.player_id, 'NULL')
                                if(player.player_cost) sellValue += player.player_cost
                            }

                        } catch (err) {
                            channel.send('Error on sellall')
                            console.error('Error on sellall', err)
                            return
                        }
                    }

                    if(sellValue < 1) {
                        channel.send(`Nice <@${user}>, you sold nothing dumb bitch!!!!!!!!!!!`)
                        collector.stop('confirmed')
                        return
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