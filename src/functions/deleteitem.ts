import { CommandInteraction, MessageFlags } from 'discord.js'
import { deleteItem, findItem } from '../database/dbQuerys'

export default async function deleteitem(interaction: CommandInteraction): Promise<void> {

    if(interaction.user.id !== '520994132458471438') {
        interaction.reply({ content: "You don't have permissions to use this command", flags: MessageFlags.Ephemeral })
        return
    }

    const item = interaction.options.get('itemid')?.value?.toString()

    if(!item) {
        interaction.reply({ content: 'Error fetching item', flags: MessageFlags.Ephemeral })
        return
    }

    const item_db = await findItem(parseInt(item))

    if(!item_db) {
        interaction.reply({ content: 'Item not found on database', flags: MessageFlags.Ephemeral })
        return
    }

    try {
        await deleteItem(item_db.item_id)
        interaction.reply(`Item **${item_db.item_name}** deleted successfully`)
    } catch (err) {
        console.error(`Error when deleting item: ${item_db.item_name}`)
        interaction.reply({ content: 'Error when deleting item', flags: MessageFlags.Ephemeral })
        return
    }
}