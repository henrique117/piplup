import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { insert } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('insert')
        .setDescription('Insert a player into the DB (Admin command)')
        .addStringOption(option => 
            option.setName('playerid')
            .setDescription('Player ID')
            .setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        await insert(interaction)
    }
}