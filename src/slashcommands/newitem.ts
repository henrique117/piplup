import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { newitem } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('newitem')
        .setDescription('Insert a new item into the DB (Admin command)')
        .addStringOption(option => 
            option.setName('itemname')
            .setDescription('Item name')
            .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('itemcost')
            .setDescription('Item cost (Coins)')
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('itemdesc')
            .setDescription('Item description')
            .setRequired(false)
        ),

    async execute(interaction: CommandInteraction) {
        await newitem(interaction)
    }
}