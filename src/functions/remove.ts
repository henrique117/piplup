import { CommandInteraction, MessageFlags } from 'discord.js'
import { updateUserCoins, findUser } from '../database/dbQuerys'

export default async function remove(interaction: CommandInteraction) {

    if(interaction.user.id !== '520994132458471438') {
        interaction.reply({ content: "You don't have permissions to use this command", flags: MessageFlags.Ephemeral })
        return
    }

    try {

        const user = interaction.options.get('user', true)
        const ammount_option = interaction.options.get('ammount', true)
        const ammount = ammount_option.value?.toString()
        
        if(!user.user) {
            interaction.reply({ content: 'User not found', flags: MessageFlags.Ephemeral })
            return
        }
            
        const user_db = await findUser(user.user.id)

        if(!user_db) {
            interaction.reply({ content: 'User not found on database', flags: MessageFlags.Ephemeral })
            return
        }

        if(!ammount) {
            interaction.reply({ content: 'Use a valid number', flags: MessageFlags.Ephemeral })
            return
        }

        await updateUserCoins(user_db.user_id, user_db.user_coins - parseInt(ammount))

        interaction.reply(`**${ammount} coins** were removed from **${user.user.globalName}**`)

    } catch (err) {
        interaction.reply({ content: 'An error occurred on updating user!', flags: MessageFlags.Ephemeral })
        console.error('An error occurred on updating user!')
    }
}