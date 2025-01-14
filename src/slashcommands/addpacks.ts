import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { addpacks } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addpacks')
        .setDescription('Add a pack to a user (Admin command)')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('User to add packs')
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('packtype')
            .setDescription('Pack type')
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
        await addpacks(interaction)
    }
}