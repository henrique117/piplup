import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { myplayersimage } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('myplayersimage')
        .setDescription('Show yours or others players with images')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('If you wanna see someone else players')
            .setRequired(false)
        ),

    async execute(interaction: CommandInteraction) {
        await myplayersimage(interaction)
    }
}