import Axios from 'axios'
import * as Interfaces from '../interfaces/interfaces.export'

export default class APICalls {
    private token?: string
    constructor() {
        this.token = undefined
    }

    public async getRecentScoreById(player_id: number): Promise<Interfaces.ScoreInterface | null> {
        try {
            let response = await Axios.get(`https://api.takuji.nkrw.dev/v1/get_player_scores?id=${player_id}&mode=0&scope=recent&limit=1`)
            return response.data
        } catch {
            return null
        }
    }

    public async getTopScoresById(player_id: number): Promise<Interfaces.ScoreInterface | null> {
        try {
            let response = await Axios.get(`https://api.takuji.nkrw.dev/v1/get_player_scores?id=${player_id}&mode=0&scope=best&limit=100`)
            return response.data
        } catch {
            return null
        }
    }
}