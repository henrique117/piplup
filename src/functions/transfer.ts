import { CommandInteraction, MessageFlags } from 'discord.js'
import { updateUserCoins, findUser } from '../database/dbQuerys'

export default async function transfer(interaction: CommandInteraction) {

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