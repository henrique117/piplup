import * as Interfaces from '../interfaces/interfaces.export'
import APICalls from '../api/apiCalls'

const api = new APICalls()

export default async function getRecentScores(player: number): Promise<Interfaces.ScoreInterface | null> {
    let recentScore: Interfaces.ScoreInterface | null = null
    let response = await api.getRecentScoreById(player)

    if(response) recentScore = response

    return recentScore
}