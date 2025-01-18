import { EmbedBuilder } from 'discord.js'
import { ItemInterface, UserInterface } from '../interfaces/interfaces.export';

export default async function shopEmbedBuilder(items: ItemInterface[], user?: UserInterface): Promise<EmbedBuilder> {

    let embedString = items.map(item => `${item.item_id} - ${item.item_name} | ${item.item_cost} coins`).join('\n') || 'No items in the shop this moment'

    if(user) embedString += `\n\nYou have **${user.user_coins}** :coin:`

    return new EmbedBuilder()
        .setColor('Aqua')
        .setTitle('Item Shop')
        .setDescription(embedString)
}