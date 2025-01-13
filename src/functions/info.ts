import { CommandInteraction, Message, MessageFlags } from 'discord.js'
import { findItem } from '../database/dbQuerys'
import { itemEmbedBuilder } from '../auxiliarfunctions/auxiliarfunctions.export'

export default async function info(interaction: CommandInteraction | Message): Promise<void> {

    if(interaction instanceof CommandInteraction) {

        const item_id = interaction.options.get('itemid')?.value?.toString()
        
        if(!item_id) {
            interaction.reply({ content: 'Bruh', flags: MessageFlags.Ephemeral})
            console.error('Bruh')
            return
        }

        const item_db = await findItem(parseInt(item_id))

        if(!item_db) {
            interaction.reply({ content: "There is no item with this ID!", flags: MessageFlags.Ephemeral})
            return
        }

        const itemEmbed = await itemEmbedBuilder(item_db)

        interaction.reply({ embeds: [itemEmbed] })

    }

    if(interaction instanceof Message) {

        const regex = /^.+\s\d+$/

        if(!regex.exec(interaction.content)) {
            interaction.reply('Type a valid ID!')
            return
        }

        const item_id = interaction.content.split(' ')[1]
        
        if(!item_id) {
            interaction.reply('Bruh')
            console.error('Bruh')
            return
        }

        const item_db = await findItem(parseInt(item_id))

        if(!item_db) {
            interaction.reply("There is no item with this ID!")
            return
        }

        const itemEmbed = await itemEmbedBuilder(item_db)

        interaction.reply({ embeds: [itemEmbed] })

    }
}