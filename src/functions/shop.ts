import { CommandInteraction, Message, MessageFlags } from 'discord.js'
import { itemsList } from '../database/dbQuerys'
import { shopEmbedBuilder } from '../auxiliarfunctions/auxiliarfunctions.export'

export default async function shop(interaction: CommandInteraction | Message): Promise<void> {

    try {

        const items = await itemsList()
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