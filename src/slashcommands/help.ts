import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { help } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Send a DM to you with the commands'),
    async execute(interaction: CommandInteraction) {
        await help(interaction)
    }
}