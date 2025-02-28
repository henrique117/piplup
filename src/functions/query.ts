import { CommandInteraction, MessageFlags } from 'discord.js'
import { runQuery } from '../database/dbQuerys'

export default async function add(interaction: CommandInteraction): Promise<void> {

    if(interaction.user.id !== '520994132458471438') {
        interaction.reply({ content: "You don't have permissions to use this command", flags: MessageFlags.Ephemeral })
        return
    }

    try {

        const query = interaction.options.get('query', true).value

        if (!query) {
            throw new Error('No query was found')
        }

        const response = await runQuery(query.toString())

        interaction.reply({ content: response })

    } catch (err) {
        interaction.reply({ content: 'An error occurred on running query!', flags: MessageFlags.Ephemeral })
        console.error('An error occurred on running query!')
    }
}