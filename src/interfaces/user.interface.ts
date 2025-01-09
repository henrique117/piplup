export default interface UserInterface {
    user_id: string
    user_username: string
    user_globalName: string | null
    user_coins: number
    user_commonPacks: number
    user_rarePacks: number
    user_epicPacks: number
    user_legendaryPacks: number
    user_ultimatePacks: number
}