import { EmbedBuilder } from 'discord.js'
import { PlayerInterface } from '../interfaces/interfaces.export'
import { findPlayer, findUser } from '../database/dbQuerys'
import { escapeFormatting } from './auxiliarfunctions.export'

export default async function playerEmbedBuilder(player: PlayerInterface): Promise<EmbedBuilder> {

    const player_db = await findPlayer(player.player_name.toLowerCase())

    let owner: string = 'No one'

    if(player_db && player_db.user_id) {
        const user_db = await findUser(player_db.user_id)

        if(user_db) {
            owner = user_db.user_globalName ? user_db.user_globalName : user_db.user_username
        }
    }

    const safeName = await escapeFormatting(player.player_name)

    return new EmbedBuilder()
        .setColor('Aqua')
        .setTitle(player.player_fav ? `:flag_${player.player_flag.toLowerCase()}: ${safeName} (#${player.player_rank}) :heart:` : `:flag_${player.player_flag.toLowerCase()}: ${safeName} (#${player.player_rank})`)
        .setDescription(`**Value: ${player.player_cost}** :coin:\n\nOwner: ${owner}\nPlayer ID: ${player.player_id}`)
        .setImage(`${player.player_pfp}`)
}