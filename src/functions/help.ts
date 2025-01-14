import { CommandInteraction, Message } from 'discord.js'
import { helpEmbedBuilder } from '../auxiliarfunctions/auxiliarfunctions.export'

export default async function help(interaction: CommandInteraction | Message): Promise<void> {
    try {
        const helpEmbed = await helpEmbedBuilder()

        const dmChannel = interaction instanceof CommandInteraction ? await interaction.user.createDM() : await interaction.author.createDM()
        await dmChannel.send({ embeds: [helpEmbed] })

        if(interaction instanceof Message) interaction.react('👍')

        return

    } catch (err) {
        interaction.reply('Open your DM!!')
        return
    }
}