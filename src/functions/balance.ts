import { CommandInteraction, Message, MessageFlags, User } from 'discord.js'
import { findUser } from '../database/dbQuerys'

export default async function balance(interaction: CommandInteraction | Message) {
    
    if(interaction instanceof CommandInteraction) {

        const option = interaction.options.get('user')
        let user: User | undefined

        if(option?.user) {
            user = option.user
        } else {
            user = interaction.user
        }

        const user_db = await findUser(user.id)

        if(!user_db) {
            interaction.reply({ content: `You have to register yourself to check your coins!`, flags: MessageFlags.Ephemeral })
            return
        }

        const name = user_db.user_globalName ? user_db.user_globalName : user_db.user_globalName

        interaction.reply({ content: `User **${name}** has **${user_db.user_coins}** :coin:`, flags: MessageFlags.Ephemeral})

        return
    }

    if(interaction instanceof Message) {
        
        const option = interaction.mentions.users.first() ? interaction.mentions.users.first() : interaction.author

        let user: User | undefined

        if(!option) {
            interaction.reply('Something went wrong... Sorry')
            return
        }

        user = option

        const user_db = await findUser(user.id)

        if(!user_db) {
            interaction.reply(`User ${user.username} not found on database`)
            return
        }

        const name = user_db.user_globalName ? user_db.user_globalName : user_db.user_globalName

        interaction.reply(`User **${name}** has **${user_db.user_coins}** :coin:`)
    }
}