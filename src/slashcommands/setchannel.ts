import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { setchannel } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('Set this channel so the bot can send messages here!'),
    async execute(interaction: CommandInteraction) {
        await setchannel(interaction)
    }
}