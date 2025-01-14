import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { unsetchannel } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unsetchannel')
        .setDescription("Unset this channel so the bot can't send messages here!"),
    async execute(interaction: CommandInteraction) {
        await unsetchannel(interaction)
    }
}