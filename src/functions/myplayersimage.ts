import { CommandInteraction, Message, MessageFlags } from 'discord.js'
import { findUser, myPlayersList } from '../database/dbQuerys'
import { embedPagination, myplayersEmbedBuilder, playerEmbedBuilder } from '../auxiliarfunctions/auxiliarfunctions.export'

export default async function myplayersimage(interaction: CommandInteraction | Message): Promise<void> {

    if(interaction instanceof CommandInteraction) {

        const option = interaction.options.get('user')
        let user: string | undefined

        const thumbnail = option?.user ? option.user.displayAvatarURL({ extension: 'png' }) : interaction.user.displayAvatarURL({ extension: 'png' })

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

            if(user_players.length === 0) {
                const playersEmbed = await myplayersEmbedBuilder(user_players, user_db, thumbnail)
                await interaction.reply({ embeds: [playersEmbed] })
                return
            }

            if(user_players.length === 1) {
                const playersEmbed = await playerEmbedBuilder(user_players[0])
                await interaction.reply({ embeds: [playersEmbed] })
                return
            }

            const playerEmbedPagination = []

            for(const player of user_players) {
                playerEmbedPagination.push(await playerEmbedBuilder(player))
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

        const thumbnail = option.displayAvatarURL({ extension: 'png' })

        user = option.id
        
        try {

            const string = interaction.author.id != user ? 'User mentioned not found in database! Ask them to register first!!' : "You have to register yourself to see your players"

            const user_db = await findUser(user)

            if(!user_db) {
                interaction.reply(string)
                return
            }

            const user_players = await myPlayersList(user_db.user_id)

            if(user_players.length === 0) {
                const playersEmbed = await myplayersEmbedBuilder(user_players, user_db, thumbnail)
                await interaction.reply({ embeds: [playersEmbed] })
                return
            }

            if(user_players.length === 1) {
                const playersEmbed = await playerEmbedBuilder(user_players[0])
                await interaction.reply({ embeds: [playersEmbed] })
                return
            }

            const playerEmbedPagination = []

            for(const player of user_players) {
                playerEmbedPagination.push(await playerEmbedBuilder(player))
            }

            await embedPagination(interaction, playerEmbedPagination)

        } catch (err) {
            interaction.reply(`Error fetching user or players: ${user}`)
            console.error(`Error fetching user or players: ${user}`, err)
            return
        }
    }
}