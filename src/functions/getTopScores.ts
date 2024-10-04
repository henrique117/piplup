import * as Interfaces from '../interfaces/interfaces.export'
import APICalls from '../api/apiCalls'
import * as Functions from './functions.export'

const api = new APICalls()

export default async function getTopScores(player: number): Promise<any> {
    let response = await api.getTopScoresById(player)

    if(response) {
        const { player, scores } = response
        const user = { name: player.name, id: player.id }

        
    }   
}