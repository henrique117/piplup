import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { myplayers } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('myplayers')
        .setDescription('Show yours or others players')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('If you wanna see someone else players')
            .setRequired(false)
        ),

    async execute(interaction: CommandInteraction) {
        await myplayers(interaction)
    }
}