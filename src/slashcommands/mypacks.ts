import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { mypacks } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mypacks')
        .setDescription('See your packs in your bag'),
    async execute(interaction: CommandInteraction) {
        await mypacks(interaction)
    }
}