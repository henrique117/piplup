import { CommandInteraction, Message, MessageFlags } from 'discord.js'
import { findUser, myPlayersList } from '../database/dbQuerys'
import { embedPagination, myplayersEmbedBuilder } from '../auxiliarfunctions/auxiliarfunctions.export'
import { PlayerInterface } from '../interfaces/interfaces.export'

export default async function myplayers(interaction: CommandInteraction | Message): Promise<void> {

    if(interaction instanceof CommandInteraction) {

        const option = interaction.options.get('user')
        let user: string | undefined

        if(option?.user) {
            user = option.user.id
        } else {
            user = interaction.user.id
        }
        
        try {

            const user_db = await findUser(user)

            const string = option?.user ? 'User mentioned not found in database! Ask them to register first!!' : "You have to register yourself to see your players"

            if(!user_db) {
                interaction.reply({ content: string, flags: MessageFlags.Ephemeral})
                return
            }

            const user_players = await myPlayersList(user_db.user_id)

            if(user_players.length / 10 <= 1) {
                const playersEmbed = await myplayersEmbedBuilder(user_players, user_db, interaction.user.displayAvatarURL({ extension: 'png' }))
                await interaction.reply({ embeds: [playersEmbed] })
                return
            }

            const chunks = []
            for(let i = 0; i < user_players.length; i += 10) {
                const chunk: PlayerInterface[] = user_players.slice(i, i + 10)
                chunks.push(chunk)
            }

            const playerEmbedPagination = []

            for(const playerChunk of chunks) {
                playerEmbedPagination.push(await myplayersEmbedBuilder(playerChunk, user_db, interaction.user.displayAvatarURL({ extension: 'png' })))
            }

            await embedPagination(interaction, playerEmbedPagination)

        } catch (err) {
            interaction.reply({ content: `Error fetching user or players: ${user}`, flags: MessageFlags.Ephemeral })
            console.error(`Error fetching user or players: ${user}`)
            return
        }

        return
    }

    if(interaction instanceof Message) {

        const option = interaction.mentions.users.first() ? interaction.mentions.users.first() : interaction.author
        
        let user: string | undefined

        if(!option) {
            interaction.reply('Something went wrong... Sorry')
            return
        }

        user = option.id
        
        try {

            const string = interaction.author.id != user ? 'User mentioned not found in database! Ask them to register first!!' : "You have to register yourself to see your players"

            const user_db = await findUser(user)

            if(!user_db) {
                interaction.reply(string)
                return
            }

            const user_players = await myPlayersList(user_db.user_id)

            if(user_players.length / 10 <= 1) {
                const playersEmbed = await myplayersEmbedBuilder(user_players, user_db, interaction.author.displayAvatarURL({ extension: 'png' }))
                await interaction.reply({ embeds: [playersEmbed] })
                return
            }

            const chunks = []
            for(let i = 0; i < user_players.length; i += 10) {
                const chunk: PlayerInterface[] = user_players.slice(i, i + 10)
                chunks.push(chunk)
            }

            const playerEmbedPagination = []

            for(const playerChunk of chunks) {
                playerEmbedPagination.push(await myplayersEmbedBuilder(playerChunk, user_db, interaction.author.displayAvatarURL({ extension: 'png' })))
            }

            await embedPagination(interaction, playerEmbedPagination)

        } catch (err) {
            interaction.reply(`Error fetching user or players: ${user}`)
            console.error(`Error fetching user or players: ${user}`, err)
            return
        }
    }
}