import Axios from 'axios'
import * as Interfaces from '../interfaces/interfaces.export'

export default async function getRecentScores(player: number | null): Promise<Interfaces.ScoreInterface | null> {
    let recentScore: Interfaces.ScoreInterface | null = null
    try {
        let response = await Axios.get(`https://api.takuji.nkrw.dev/v1/get_player_scores?id=${player}&mode=0&scope=recent&limit=1`)
        recentScore = response.data
    } catch {
        console.error('Player not found')
    }

    return recentScore
}