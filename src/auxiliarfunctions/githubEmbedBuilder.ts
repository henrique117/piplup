import { EmbedBuilder } from 'discord.js'

export default async function githubEmbedBuilder(): Promise<EmbedBuilder> {
    const embed = new EmbedBuilder()
        .setColor('Aqua')
        .setTitle('Piplup')
        .setURL('https://github.com/henrique117/piplup')
        .setDescription('Hi! Check out my full open source code on Github! Feel free to drop a star!\n\nAlso, if u have any sugestions, you can DM me on my Discord (iccy11706)!')

    return embed
}