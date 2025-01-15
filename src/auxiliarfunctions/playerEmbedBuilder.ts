import { EmbedBuilder } from 'discord.js'
import { PlayerInterface } from '../interfaces/interfaces.export'
import { findUser } from '../database/dbQuerys'

export default async function shopEmbedBuilder(player: PlayerInterface): Promise<EmbedBuilder> {

    const owner = player.user_id ? (await findUser(player.user_id)).user_username : 'No one'

    return new EmbedBuilder()
        .setColor('Aqua')
        .setTitle(`:flag_${player.player_flag.toLowerCase()}: ${player.player_name} (#${player.player_rank})`)
        .setDescription(`**Value: ${player.player_cost}** :coin:\n\nOwner: ${owner}\nPlayer ID: ${player.player_id}`)
        .setImage(`${player.player_pfp}`)
}