import { CommandInteraction, Message, MessageFlags } from 'discord.js'
import { playerEmbedBuilder } from '../auxiliarfunctions/auxiliarfunctions.export'
import { findPlayerById, findPlayer } from '../database/dbQuerys'
import { PlayerInterface } from '../interfaces/interfaces.export'

export default async function info(interaction: CommandInteraction | Message): Promise<void> {

    if(interaction instanceof CommandInteraction) {
        const query = interaction.options.get('query', true).value?.toString()

        if(!query) {
            interaction.reply({ content: 'Bruh', flags: MessageFlags.Ephemeral})
            console.error('Bruh')
            return
        }

        const id_regex = /^\d+/
        const name_regex = /^"(.+)"$/

        if(!id_regex.exec(query) && !name_regex.exec(query)) {
            interaction.reply({ content: 'Type a valid ID or use " " to search by name', flags: MessageFlags.Ephemeral})
            return
        }

        let player_db: PlayerInterface | null

        if(id_regex.exec(query) && !name_regex.exec(query)) {
            player_db = await findPlayerById(parseInt(query))
        } else if(!id_regex.exec(query) && name_regex.exec(query)) {
            player_db = await findPlayer(query.split('"')[1])
        } else {
            player_db = null
        }

        if(!player_db) {
            interaction.reply({ content: 'Player not found...', flags: MessageFlags.Ephemeral})
            return
        }

        const playerEmbed = await playerEmbedBuilder(player_db)

        interaction.reply({ embeds: [playerEmbed] })
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
            player_db = await findPlayer(query.split('"')[1])
        } else {
            player_db = null
        }

        if(!player_db) {
            interaction.reply('Player not found...')
            return
        }

        const playerEmbed = await playerEmbedBuilder(player_db)

        interaction.reply({ embeds: [playerEmbed] })
    }
}