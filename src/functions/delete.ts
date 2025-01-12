import { CommandInteraction, MessageFlags } from 'discord.js'
import { deleteUser, findUser } from '../database/dbQuerys'

export default async function deleteU(interaction: CommandInteraction): Promise<void> {
    if(interaction.user.id !== '520994132458471438') {
        interaction.reply({ content: "You don't have permissions to use this command", flags: MessageFlags.Ephemeral })
        return
    }

    const user = interaction.options.get('user', true)
    
    if(!user.user) {
        interaction.reply({ content: 'User not found', flags: MessageFlags.Ephemeral })
        return
    }
        
    const user_db = await findUser(user.user.id)

    if(!user_db) {
        interaction.reply({ content: 'User not found on database', flags: MessageFlags.Ephemeral })
        return
    }

    await deleteUser(user_db.user_id)
    const name = user_db.user_globalName ? user_db.user_globalName : user_db.user_username

    interaction.reply(`User **${name}** deleted from database, all players related to him are now available again!`)
}