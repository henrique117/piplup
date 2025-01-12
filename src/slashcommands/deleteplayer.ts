import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { deleteplayer } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteplayer')
        .setDescription('Delete a player (Admin command)')
        .addStringOption(option => 
            option.setName('playername')
            .setDescription('Name of the player you wanna delete')
            .setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        await deleteplayer(interaction)
    }
}