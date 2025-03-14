import { EmbedBuilder } from 'discord.js'
import { PlayerInterface, UserInterface } from '../interfaces/interfaces.export'
import { escapeFormatting } from './auxiliarfunctions.export'

export default async function openmultiplepacksEmbedBuilder(players: PlayerInterface[], user: UserInterface, index: number, user_pfp?: string | null): Promise<EmbedBuilder> {

    const playerSafeName: PlayerInterface[] = []
    
    for(const player of players) {
        player.player_name = await escapeFormatting(player.player_name)

        playerSafeName.push(player)
    }

    const embedString = players.map(player => `${player.player_id} - **${player.player_name} (#${player.player_rank})** | ${player.player_cost} :coin:`).join('\n') || "You don't have any players! Go open some packs!!"

    return new EmbedBuilder()
        .setColor('Aqua')
        .setTitle(`${user.user_globalName ? user.user_globalName : user.user_username}'s pack - ${index}`)
        .setDescription(embedString)
        .setThumbnail(user_pfp ? user_pfp : 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/393.png')
}