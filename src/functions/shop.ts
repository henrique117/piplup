import { CommandInteraction, Message, MessageFlags } from 'discord.js'
import { findUser, itemsList } from '../database/dbQuerys'
import { shopEmbedBuilder } from '../auxiliarfunctions/auxiliarfunctions.export'

export default async function shop(interaction: CommandInteraction | Message): Promise<void> {

    try {

        const user_db = await findUser(interaction instanceof CommandInteraction ? interaction.user.id : interaction.author.id)
        const items = await itemsList()
        
        if(user_db) {
            const shopEmbed = await shopEmbedBuilder(items, user_db)

            interaction.reply({ embeds: [shopEmbed] })

            return
        }

        const shopEmbed = await shopEmbedBuilder(items)

        interaction.reply({ embeds: [shopEmbed] })

    } catch (err) {

        if(interaction instanceof CommandInteraction) {
            interaction.reply({ content: 'Error on fetching items', flags: MessageFlags.Ephemeral })
            console.error('Error fetching items list')
            return
        }

        if(interaction instanceof Message) {
            interaction.reply('Error on fetching items')
            console.error('Error fetching items list')
        }
    }
}