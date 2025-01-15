import { EmbedBuilder } from 'discord.js'
import { PlayerInterface } from '../interfaces/interfaces.export'
import { findPlayer, findUser } from '../database/dbQuerys'

export default async function playerEmbedBuilder(player: PlayerInterface): Promise<EmbedBuilder> {

    const player_db = await findPlayer(player.player_name)
    let owner: string = 'No one'

    if(player_db && player_db.user_id) {
        const user_db = await findUser(player_db.user_id)
        owner = user_db.user_globalName ? user_db.user_globalName : user_db.user_username
    }

    return new EmbedBuilder()
        .setColor('Aqua')
        .setTitle(`:flag_${player.player_flag.toLowerCase()}: ${player.player_name} (#${player.player_rank})`)
        .setDescription(`**Value: ${player.player_cost}** :coin:\n\nOwner: ${owner}\nPlayer ID: ${player.player_id}`)
        .setImage(`${player.player_pfp}`)
}