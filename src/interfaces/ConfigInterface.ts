export default interface ConfigInterface {
    players: { discord_id: number; player_id: number}[]
    modCombination: { mods: string; modNumber: number}[]
}