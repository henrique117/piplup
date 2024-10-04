import { EmbedBuilder } from 'discord.js'
import * as Interfaces from '../interfaces/interfaces.export'
import * as Functions from './functions.export'

export default async function scoreEmbedCreator(score: Interfaces.ScoreInterface): Promise<EmbedBuilder> {
    const { scores, player } = score

    const modsCombination = await Functions.getModCombination(scores[0].mods)

    const embed = new EmbedBuilder()
        .setColor('Aqua')
        .setTitle(`${scores[0].beatmap.artist} - ${scores[0].beatmap.title} [${scores[0].beatmap.version}] [${scores[0].beatmap.diff.toFixed(2)}*]`)
        .setURL(`https://osu.ppy.sh/beatmapsets/${scores[0].beatmap.set_id}#osu/${scores[0].beatmap.id}`)
        .setAuthor({ name: `${player.name}`, url: `https://takuji.nkrw.dev/u/${player.id}` })
        .addFields(
            { name:'Grade:', value: `${scores[0].grade} +${modsCombination}`, inline: true },
            { name: 'Score:', value: `${scores[0].score}`, inline: true },
            { name: 'Acc:', value: `${Math.round(scores[0].acc)}%`, inline: true },
            { name: 'PP:', value: `${scores[0].pp}pp - ${scores[0].max_combo}/${scores[0].beatmap.max_combo} - [${scores[0].n300}/${scores[0].n100}/${scores[0].n50}/${scores[0].nmiss}]` },
            { name: 'Beatmap Info:', value: `Length: ${Math.floor(scores[0].beatmap.total_length / 60)}:${scores[0].beatmap.total_length % 60} - BPM: ${scores[0].beatmap.bpm}  CS: ${scores[0].beatmap.cs}  AR: ${scores[0].beatmap.ar}  OD: ${scores[0].beatmap.od}  HP: ${scores[0].beatmap.hp}` }
        )
    return embed
}