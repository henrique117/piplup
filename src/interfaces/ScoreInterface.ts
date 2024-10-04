import * as Interfaces from './interfaces.export'

export default interface ScoreInterface {
    status: string
    scores: Interfaces.SingleScoreInterface[]
    player: Player
}

interface Player {
    id: number
    name: string
    clan: string | null
}