export default interface PlayerInterface {
    player_name: string
    player_rank: number
    player_pfp: string
    player_flag: string
    player_cost?: number
    user_id?: string | null
    player_id?: number
}