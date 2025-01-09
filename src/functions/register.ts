import { CommandInteraction, Message, MessageFlags } from 'discord.js'
import { insertUser } from '../database/dbQuerys'

export default async function register(interaction: CommandInteraction | Message) {
    if(interaction instanceof CommandInteraction) {
        try {
            await insertUser(interaction.user.id, interaction.user.username, interaction.user.globalName)
            interaction.reply('User registered!')
        } catch (err) {
            interaction.reply({ content: "If you already registered yourself you can use the bot by running other commands! Otherwise, I'm sorry...", flags: MessageFlags.Ephemeral })
            console.error(`Error on register the user: ${interaction.user.username} | ${interaction.user.id}`)
        }
    }

    if(interaction instanceof Message) {
        try {
            await insertUser(interaction.author.id, interaction.author.username, interaction.author.globalName)
            interaction.reply('User registered!')
        } catch (err) {
            interaction.reply("If you already registered yourself you can use the bot by running other commands! Otherwise, I'm sorry...")
            console.error(`Error on register the user: ${interaction.author.username} | ${interaction.author.id}`)
        }
    }
}