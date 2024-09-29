import * as Functions from './functions.export'

export default async function setUser(player_id: number, discord_id: number): Promise<string> {
    const config = await Functions.readConfigFile()

    if(config) {
        const playerExists = config.players.some(player => player.discord_id === discord_id)

        if(!playerExists) {
            config.players.push({ discord_id, player_id })
            await Functions.writeConfigFile(config)
            return 'Registrado com sucesso!'
        }

        return 'Você já se registrou!'
    }

    return 'Houve um erro ao registrar'
}