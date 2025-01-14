import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { open } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('open')
        .setDescription('Show yours or others coins')
        .addStringOption(option => 
            option.setName('packtype')
            .setDescription('Type of the pack you wanna open')
            .setRequired(true)
            .addChoices(
                { name: 'Common pack', value: 'common'},
                { name: 'Rare pack', value: 'rare'},
                { name: 'Epic pack', value: 'epic'},
                { name: 'Legendary pack', value: 'legendary'},
                { name: 'Ultimate pack', value: 'ultimate'},
            )
        ),

    async execute(interaction: CommandInteraction) {
        await open(interaction)
    }
}