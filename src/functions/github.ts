import { CommandInteraction, Message } from 'discord.js'
import { githubEmbedBuilder } from '../auxiliarfunctions/auxiliarfunctions.export'

export default async function github(interaction: CommandInteraction | Message): Promise<void> {
    const githubEmbed = await githubEmbedBuilder()
    interaction.reply({ embeds: [githubEmbed] })
}