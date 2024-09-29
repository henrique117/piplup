import * as Functions from './functions.export'

export default async function getPlayerId(discord_id: number): Promise<number | null> {
    const config = await Functions.readConfigFile()
    
    if (config) {
        const player = config.players.find(player => player.discord_id === discord_id)
        
        return player ? player.player_id : null
    }

    return null
}
