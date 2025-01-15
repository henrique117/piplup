import { EmbedBuilder } from 'discord.js'
import { PlayerInterface } from '../interfaces/interfaces.export'
import { findUser } from '../database/dbQuerys'
import Axios from 'axios'
import * as sharp from 'sharp'
import * as fs from 'fs'
import * as path from 'path'

export default async function playerEmbedBuilder(player: PlayerInterface): Promise<EmbedBuilder> {

    const imagePath = path.resolve(__dirname, `assets/pfp.${player.player_pfp.split('.').pop()}`)

    try {
        const response = await Axios.get<Buffer>(player.player_pfp, { responseType: 'arraybuffer' })
        
        await sharp(response.data).resize(256, 256).toFile(imagePath)

    } catch (err) {
        console.error('Error on resizing image')
        throw new Error('Error on resizing image')
    }

    const owner = player.user_id ? (await findUser(player.user_id)).user_username : 'No one'

    const playerEmbed = new EmbedBuilder()
        .setColor('Aqua')
        .setTitle(`:flag_${player.player_flag.toLowerCase()}: ${player.player_name} (#${player.player_rank})`)
        .setDescription(`**Value: ${player.player_cost}** :coin:\n\nOwner: ${owner}\nPlayer ID: ${player.player_id}`)
        .setImage(`${imagePath}`)

    if(fs.existsSync(imagePath)) fs.unlinkSync(imagePath)

    return playerEmbed
}