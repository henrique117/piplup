import { CommandInteraction, DMChannel, Message, MessageFlags, messageLink, MessageReaction, TextChannel, User } from 'discord.js'
import { PlayerInterface, UserInterface } from '../interfaces/interfaces.export'
import { findPlayer, findPlayerById, findUser, updatePlayerStatus } from '../database/dbQuerys'

export default async function trade(interaction: CommandInteraction | Message) {
    
    let user_id: string = 'bruh'
    let target_id: string = 'bruh'

    if(interaction instanceof CommandInteraction) {
        user_id = interaction.user.id
        const option = interaction.options.get('user')
        
        if(!option?.user) {
            interaction.reply({ content: 'User not found', flags: MessageFlags.Ephemeral })
            return
        }

        target_id = option.user.id
    }

    if(interaction instanceof Message) {
        user_id = interaction.author.id

        const option = interaction.mentions.users.first()?.id

        if(!option) {
            interaction.reply('You have to mention an user to trade')
            return
        }

        target_id = option
    }

    try {

        const user_db: UserInterface = await findUser(user_id)
        const target_db: UserInterface = await findUser(target_id)

        if(!user_db) {
            if(interaction instanceof CommandInteraction) interaction.reply({ content: 'User not registered! Use &reg to register yourself!', flags: MessageFlags.Ephemeral })
            if(interaction instanceof Message) interaction.reply('User not registered! Use &reg to register yourself!')
            return
        }

        if(!target_db) {
            if(interaction instanceof CommandInteraction) interaction.reply({ content: "User not registered! You're trying to trade with someone not registered!", flags: MessageFlags.Ephemeral })
            if(interaction instanceof Message) interaction.reply("User not registered! You're trying to trade with someone not registered!")
            return
        }

        const channel: TextChannel | null = interaction.channel instanceof TextChannel ? interaction.channel : null

        if(!channel) {
            interaction.reply("Channel not found! Use a valid channel!!")
            return
        }

        const msg = (await interaction.reply(`<@${user_db.user_id}> want to trade with you <@${target_db.user_id}!\n\n✅ To accept\n❌ To refuse`)) as Message

        await msg.react('✅')
        await msg.react('❌')

        const filter = (reaction: MessageReaction, user: User) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === target_db.user_id
        }

        const collector = msg.createReactionCollector({ filter: filter, time: 20000 })

        collector.on('collect', (reaction: MessageReaction) => {
            if(reaction.emoji.name === '❌') {
                collector.stop('canceled')
            } else {
                collector.stop('confirmed')
            }
        })

        collector.on('end', async (_, reason: string) => {
            if(reason === 'canceled') {
                await msg.delete()
                await channel.send(`Trade declined by <@${target_db.user_id}>`)
                return
            } else if(reason === 'confirmed') {
                await msg.delete()
                const temp = await channel.send(`Trade accepted by <@${target_db.user_id}>! I'm gonna try to send you both DMs to continue the trade!`)
                setTimeout(() => {
                    temp.delete()
                }, 10000)
            } else {
                await msg.delete()
                await channel.send(`Time expired, try to trade again later <@${user_db.user_id}> and <@${target_db.user_id}>!!`)
                return
            }
        })

        const dmChannel_user = interaction instanceof CommandInteraction ? await interaction.user.createDM() : await interaction.author.createDM()
        const target = (interaction instanceof CommandInteraction ? await interaction.options.get('user') : await interaction.mentions.users.first()) as User
        const dmChannel_target = await target.createDM()


        if(!dmChannel_user || !dmChannel_target) {
            channel.send(`Error on open DM channels, please open your DMs before use the trade! <@${user_db.user_id}> <@${target_db.user_id}>`)
            return
        }

        const userTrade = await dmChannel_user.send('Type the player ID or the "player name" to add them to the trade! Type done the confirm the trade!**Trade:**')
        const targetTrade = await dmChannel_target.send('Type the player ID or the "player name" to add them to the trade! Type done the confirm the trade!\n\n**Trade:**')

        const dm_filter = (msg: Message) => {
            return !msg.author.bot
        }

        const createDmCollector = async (channel: DMChannel, user: UserInterface, offer: PlayerInterface[], msgToEdit: Message): Promise<void> => {

            const dmCollector = channel.createMessageCollector({ filter: dm_filter, time: 90000 })

            const id_regex = /^\d+$/
            const name_regex = /^"(.+)"$/

            dmCollector.on('collect', async (dm_message: Message) => {
                if(dm_message.content === 'done') {
                    dm_message.react('👍')
                    dmCollector.stop('done')
                }
    
                const players: string[] = dm_message.content.split(' ')
                
                for(const player of players) {
                    if(id_regex.test(player)) {
    
                        dmCollector.resetTimer()
        
                        const player_db = await findPlayerById(parseInt(player))
        
                        if(!player_db) {
                            await dm_message.reply(`Player ${player} not found! Type a valid ID or a valid "name"`)
                            return
                        }
                        
                        if(player_db.user_id !== user.user_id) {
                            await dm_message.reply(`You can't trade the player: ${player_db.player_name}`)
                            return
                        }
    
                        offer.push(player_db)
                        await dm_message.react('✅')
        
                    } else if(name_regex.test(player)) {
    
                        dmCollector.resetTimer()
        
                        const player_db = await findPlayer(player.split('"')[1].toLowerCase())
        
                        if(!player_db) {
                            await dm_message.reply(`Player ${player} not found! Type a valid ID or a valid "name"`)
                            return
                        }
                        
                        if(player_db.user_id !== user.user_id) {
                            await dm_message.reply(`You can't trade the player: ${player_db.player_name}`)
                            return
                        }
    
                        offer.push(player_db)
                        await dm_message.react('✅')
    
                    } else {
                        return
                    }
                }
    
                const string = offer.map((p: PlayerInterface) => p.player_name).join('\n')
    
                await msgToEdit.edit(`Type the player ID or the "player name" to add them to the trade! Type done the confirm the trade!\n\n**Trade:**\n\n${string}`)
            })

            dmCollector.on('end', (_, reason: string) => {
                if(reason !== 'done') {
                    channel.send('Timer expired. Your trade was sent in the current state.')
                    return
                } else {
                    return
                }
            })

            return
        }

        const userOffer: PlayerInterface[] = []
        const targetOffer: PlayerInterface[] = []

        await createDmCollector(dmChannel_user, user_db, userOffer, userTrade)
        await createDmCollector(dmChannel_target, target_db, targetOffer, targetTrade)

        const userString = await userOffer.map((p: PlayerInterface) => `- **${p.player_name} (#${p.player_rank}): ${p.player_cost} :coin:**`).join('\n')
        const targetString = await targetOffer.map((p: PlayerInterface) => `- **${p.player_name} (#${p.player_rank}): ${p.player_cost} :coin:**`).join('\n')

        const finalTrade = await channel.send(`Trade ended! <@${user_db.user_id}> <@${target_db.user_id}>\n\n
                                            ## ${user_db.user_globalName ? user_db.user_globalName : user_db.user_username}'s offer:\n${userString}\n\n
                                            ## ${target_db.user_globalName ? target_db.user_globalName : target_db.user_username}'s offer:\n${targetString}\n\n
                                            React both to this message with ✅ to confirm the trade or react with ❌ to decline the trade`)

        await finalTrade.react('✅')
        await finalTrade.react('❌')

        const confirmFilter = (reaction: MessageReaction, user: User) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && (user.id === target_db.user_id || user.id === user_db.user_id)
        }

        const confirmCollector = finalTrade.createReactionCollector({ filter: confirmFilter, time: 30000 })

        confirmCollector.on('collect', async (reaction: MessageReaction, user: User) => {
            let reactionCounter = 0

            if(reaction.emoji.name === '❌') {
                confirmCollector.stop(`Trade declined by <@${user.id}>`)
            } else {
                reactionCounter++
            }

            if(reactionCounter == 2) {
                confirmCollector.stop(`Trade confirmed!! Check your players to see! <@${user_db.user_id}> <@${target_db.user_id}>`)
            }
        })

        const tradePlayers = async (players: PlayerInterface[], toUser: UserInterface) => {
            for(const player of players) {
                if(player.player_id) await updatePlayerStatus(player.player_id, toUser.user_id)
            }
        }

        confirmCollector.on('end', async (_, reason: string) => {
            if(reason.startsWith('Trade declined')) {
                await channel.send(reason)
                return
            } else if(reason.startsWith('Trade confirmed')) {

                await tradePlayers(userOffer, target_db)
                await tradePlayers(targetOffer, user_db)

                await finalTrade.delete()
                await channel.send(reason)
                return
            } else {
                await channel.send(`The time to accept the trade expired! If you both <@${user_db.user_id}> <@${target_db.user_id}> wanna trade start a new one!`)
                return
            }
        })

    } catch (err) {
        if(interaction instanceof CommandInteraction) interaction.reply({ content: 'Error on trade function', flags: MessageFlags.Ephemeral })
        if(interaction instanceof Message) interaction.reply('Error on trade function')
        console.error('Error on trade function', err)
        return
    }
}