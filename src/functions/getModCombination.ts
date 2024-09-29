import * as Functions from './functions.export'

export default async function getModCombination(mod: number): Promise<string> {
    const config = await Functions.readConfigFile()
    
    if(config) {
        const modPlayed = config.modCombination.find(mods => mods.modNumber === mod)

        return modPlayed ? modPlayed.mods : 'No mods combination found'
    }

    return 'No mods combination found'
}