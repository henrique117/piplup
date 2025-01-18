import { CommandInteraction, Message, MessageFlags } from 'discord.js'
import { escapeFormatting, playerEmbedBuilder } from '../auxiliarfunctions/auxiliarfunctions.export'
import { findPlayerById, findPlayer, findPlayerSimilar } from '../database/dbQuerys'
import { PlayerInterface } from '../interfaces/interfaces.export'

export default async function info(interaction: CommandInteraction | Message): Promise<void> {

    if(interaction instanceof CommandInteraction) {
        const query = interaction.options.get('query', true).value?.toString()

        if(!query) {
            await interaction.reply({ content: 'Bruh', flags: MessageFlags.Ephemeral})
            console.error('Bruh')
            return
        }

        const id_regex = /^\d+/
        const name_regex = /^"(.+)"$/

        if(!id_regex.exec(query) && !name_regex.exec(query)) {
            await interaction.reply({ content: 'Type a valid ID or use " " to search by name', flags: MessageFlags.Ephemeral})
            return
        }

        let player_db: PlayerInterface | null

        if(id_regex.exec(query) && !name_regex.exec(query)) {
            player_db = await findPlayerById(parseInt(query))
        } else if(!id_regex.exec(query) && name_regex.exec(query)) {
            player_db = await findPlayer(query.split('"')[1].toLowerCase())
        } else {
            player_db = null
        }

        let string: string = `Player **${query}** not found...`

        if(!player_db) {
            if(name_regex.exec(query)) {
                const playersSimilar = await findPlayerSimilar(query.split('"')[1].toLowerCase())

                if(playersSimilar.length > 0) {

                for(const player of playersSimilar) {
                    player.player_name = await escapeFormatting(player.player_name)
                }

                const playersSimilarString = await playersSimilar.map((player: PlayerInterface) => `**${player.player_name} (#${player.player_rank})**`).join('\n')
                    string += `\n\nAre you searching for one of those:\n\n${playersSimilarString}`
                }
            }
            await interaction.reply({ content: string })
            return
        }

        const playerEmbed = await playerEmbedBuilder(player_db)

        await interaction.reply({ embeds: [playerEmbed] })
        return
    }

    if(interaction instanceof Message) {
        const query = interaction.content

        if(!query) {
            interaction.reply('Bruh')
            console.error('Bruh')
            return
        }

        const id_regex = /^.+\s\d+$/
        const name_regex = /^.+\s"(.+)"$/

        if(!id_regex.exec(query) && !name_regex.exec(query)) {
            interaction.reply('Type a valid ID or use " " to search by name')
            return
        }

        let player_db: PlayerInterface | null

        if(id_regex.exec(query) && !name_regex.exec(query)) {
            player_db = await findPlayerById(parseInt(query.split(' ')[1]))
        } else if(!id_regex.exec(query) && name_regex.exec(query)) {
            player_db = await findPlayer(query.split('"')[1].toLowerCase())
        } else {
            player_db = null
        }

        let string: string = `Player **${query}** not found...`

        if(!player_db) {
            if(name_regex.exec(query)) {
                const playersSimilar = await findPlayerSimilar(query.split('"')[1].toLowerCase())

                if(playersSimilar.length > 0) {

                for(const player of playersSimilar) {
                    player.player_name = await escapeFormatting(player.player_name)
                }

                const playersSimilarString = await playersSimilar.map((player: PlayerInterface) => `**${player.player_name} (#${player.player_rank})**`).join('\n')
                    string += `\n\nAre you searching for one of those:\n\n${playersSimilarString}`
                }
            }
            await interaction.reply(string)
            return
        }

        const playerEmbed = await playerEmbedBuilder(player_db)

        interaction.reply({ embeds: [playerEmbed] })
    }
}