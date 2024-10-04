import { EmbedBuilder } from 'discord.js'
import * as Interfaces from '../interfaces/interfaces.export'
import * as Functions from './functions.export'

export default async function scoreEmbedCreator(score: Interfaces.ScoreInterface): Promise<EmbedBuilder> {
    const { scores, player } = score

    const embed = new EmbedBuilder()
        .setColor('Aqua')

    return embed
}