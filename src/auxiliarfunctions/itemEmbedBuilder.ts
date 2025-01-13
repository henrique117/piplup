import { EmbedBuilder } from 'discord.js'
import { ItemInterface } from '../interfaces/interfaces.export'

export default async function shopEmbedBuilder(item: ItemInterface): Promise<EmbedBuilder> {

    return new EmbedBuilder()
        .setColor('Aqua')
        .setTitle(`${item.item_name} | ${item.item_cost} coins`)
        .setDescription(item.item_description)
}