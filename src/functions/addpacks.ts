import { CommandInteraction, MessageFlags } from 'discord.js'
import { findUser, updateUserPacks } from '../database/dbQuerys'

export default async function addpacks(interaction: CommandInteraction): Promise<void> {

    if(interaction.user.id !== '520994132458471438') {
        interaction.reply({ content: "You don't have permissions to use this command", flags: MessageFlags.Ephemeral })
        return
    }

    const user = interaction.options.get('user', true).user?.id
    const pack_type = interaction.options.get('packtype', true).value?.toString()

    if(!user || !pack_type) {
        interaction.reply({ content: 'Bruh', flags: MessageFlags.Ephemeral})
        console.error('Bruh')
        return
    }

    try {

        const user_db = await findUser(user)

        if(!user_db) {
            interaction.reply({ content: "This person isn't registered", flags: MessageFlags.Ephemeral})
            return
        }

        if(pack_type.includes('common')) {
            await updateUserPacks(user_db.user_id, 'user_commonPacks', true)
        } else if (pack_type.includes('rare')) {
            await updateUserPacks(user_db.user_id, 'user_rarePacks', true)
        } else if (pack_type.includes('epic')) {
            await updateUserPacks(user_db.user_id, 'user_epicPacks', true)
        } else if (pack_type.includes('legendary')) {
            await updateUserPacks(user_db.user_id, 'user_legendaryPacks', true)
        } else if (pack_type.includes('ultimate')) {
            await updateUserPacks(user_db.user_id, 'user_ultimatePacks', true)
        } else {
            throw new Error('Invalid pack type')
        }

        interaction.reply({ content: `**1 ${pack_type} pack** added to **${user_db.user_globalName ? user_db.user_globalName : user_db.user_username}**` })

        return

    } catch (err) {
        interaction.reply({ content: 'Error on addpacks function', flags: MessageFlags.Ephemeral })
        console.error('Error on addpacks function:', interaction.user.id)
        return
    }
}