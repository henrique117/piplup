import { EmbedBuilder } from 'discord.js'
import { ItemInterface } from '../interfaces/interfaces.export';

export default async function shopEmbedBuilder(items: ItemInterface[]): Promise<EmbedBuilder> {

    const embedString = items.map(item => `${item.item_id} - ${item.item_name} | ${item.item_cost} coins`).join('\n') || 'No items in the shop this moment'

    return new EmbedBuilder()
        .setColor('Aqua')
        .setTitle('Item Shop')
        .setDescription(embedString)
}