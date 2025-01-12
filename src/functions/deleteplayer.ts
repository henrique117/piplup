import { CommandInteraction, MessageFlags } from 'discord.js'
import { deletePlayer, findPlayer } from '../database/dbQuerys'

export default async function deleteplayer(interaction: CommandInteraction): Promise<void> {

    if(interaction.user.id !== '520994132458471438') {
        interaction.reply({ content: "You don't have permissions to use this command", flags: MessageFlags.Ephemeral })
        return
    }

    const player_name = interaction.options.get('playername')?.value?.toString()

    if(!player_name) {
        interaction.reply({ content: 'Error fetching player', flags: MessageFlags.Ephemeral })
        return
    }

    const player_db = await findPlayer(player_name)

    if(!player_db) {
        interaction.reply({ content: 'Player not found on database', flags: MessageFlags.Ephemeral })
        return
    }

    try {
        await deletePlayer(player_db.player_name)
        interaction.reply(`Player **${player_db.player_name}** deleted successfully`)
    } catch (err) {
        console.error(`Error when deleting player: ${player_db.player_name}`)
        interaction.reply({ content: 'Error when deleting player', flags: MessageFlags.Ephemeral })
        return
    }
}