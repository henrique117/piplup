import { CommandInteraction, Message, MessageFlags } from 'discord.js'
import { updateUserCoins, findUser } from '../database/dbQuerys'

export default async function transfer(interaction: CommandInteraction | Message): Promise<void> {

    if(interaction instanceof CommandInteraction) {
        try {

            const user = interaction.user.id
            const userMentioned = interaction.options.get('user', true)
            const ammount_option = interaction.options.get('ammount', true)
            const ammount_string = ammount_option.value?.toString()
    
            if(!ammount_string || parseInt(ammount_string) < 1) {
                interaction.reply({ content: 'Use a valid number', flags: MessageFlags.Ephemeral })
                return
            }
    
            const ammount = parseInt(ammount_string)
            
            if(!userMentioned.user) {
                interaction.reply({ content: 'User not found', flags: MessageFlags.Ephemeral })
                return
            }
    
            if(userMentioned.user.id === user) {
                interaction.reply({ content: "You can't send money to yourself!!", flags: MessageFlags.Ephemeral })
                return
            }
                
            const userToAdd_db = await findUser(userMentioned.user.id)
            const userToRemove_db = await findUser(user)
    
            if(!userToAdd_db) {
                interaction.reply({ content: 'The person that you trying to transfer is not registered yet!', flags: MessageFlags.Ephemeral })
                return
            }
    
            if(!userToRemove_db) {
                interaction.reply({ content: "You're not registered to the bot! Use the register command first!", flags: MessageFlags.Ephemeral })
                return
            }
    
            if(userToRemove_db.user_coins - ammount < 0) {
                interaction.reply({ content: "You don't have enough money to send!", flags: MessageFlags.Ephemeral })
                return
            }
    
            await updateUserCoins(userToRemove_db.user_id, userToRemove_db.user_coins - ammount)
            await updateUserCoins(userToAdd_db.user_id, userToAdd_db.user_coins + ammount)
    
            interaction.reply(`**${ammount} coins** were transfered to **${userMentioned.user.globalName}**`)
    
        } catch (err) {
            interaction.reply({ content: 'An error occurred on updating user!', flags: MessageFlags.Ephemeral })
            console.error('An error occurred on updating user!')
        }
    }

    if(interaction instanceof Message) {
        try {

            const user = interaction.author.id
            const userMentioned = interaction.mentions.users.first()

            const regex = /^.+\s\d+\s.*$/

            if(!regex.exec(interaction.content)) {
                interaction.reply({ content: 'Use the command in the right way: &transfer {Number} {Mention}' })
                return
            }

            const message = interaction.content.split(' ')

            const ammount_string = message[1]
    
            if(!ammount_string || parseInt(ammount_string) < 1) {
                interaction.reply({ content: 'Use a valid number!!' })
                return
            }
    
            const ammount = parseInt(ammount_string)
            
            if(interaction.mentions.users.size < 1) {
                interaction.reply({ content: 'You have to mention someone to send money!' })
                return
            }

            if(!userMentioned) {
                interaction.reply({ content: 'User not found!' })
                return
            }
    
            if(userMentioned.id === user) {
                interaction.reply({ content: "You can't send money to yourself!!" })
                return
            }
                
            const userToAdd_db = await findUser(userMentioned.id)
            const userToRemove_db = await findUser(user)
    
            if(!userToAdd_db) {
                interaction.reply({ content: 'The person that you trying to transfer is not registered yet!' })
                return
            }
    
            if(!userToRemove_db) {
                interaction.reply({ content: "You're not registered to the bot! Use the register command first!" })
                return
            }
    
            if(userToRemove_db.user_coins - ammount < 0) {
                interaction.reply({ content: "You don't have enough money to send!" })
                return
            }
    
            await updateUserCoins(userToRemove_db.user_id, userToRemove_db.user_coins - ammount)
            await updateUserCoins(userToAdd_db.user_id, userToAdd_db.user_coins + ammount)
    
            interaction.reply(`**${ammount} coins** were transfered to **${userMentioned.globalName}**`)
    
        } catch (err) {
            interaction.reply({ content: 'An error occurred on updating user!' })
            console.error('An error occurred on updating user!')
        }
    }
}