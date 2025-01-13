import { CommandInteraction, MessageFlags } from 'discord.js'
import { insertPlayer } from '../database/dbQuerys'
import ApiCalls from '../api/apiCalls'

export default async function insert(interaction: CommandInteraction): Promise<void> {
    if(interaction.user.id !== '520994132458471438') {
        interaction.reply({ content: "You don't have permissions to use this command", flags: MessageFlags.Ephemeral })
        return
    }

    const api = new ApiCalls()

    const id = interaction.options.get('playerid')?.value?.toString()
    const regex = /^\d+/

    if(!id) return

    if(!regex.exec(id)) {
        interaction.reply({ content: 'Are you dumb? You progammed it!', flags: MessageFlags.Ephemeral })
        return
    }

    const player = await api.getPlayerById(id)

    if(!player) {
        interaction.reply({ content: 'Player not found', flags: MessageFlags.Ephemeral })
        return
    }

    try {
        await insertPlayer(player.player_name, player.player_rank, player.player_pfp, player.player_flag)
        interaction.reply(`Player ${player.player_name} registered successfully!`)
    } catch (err) {
        console.error(`Error on inserting player: ${player.player_name}`, err)
        interaction.reply({ content: 'Error on inserting player', flags: MessageFlags.Ephemeral })
        return
    }
}