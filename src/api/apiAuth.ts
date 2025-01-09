import Axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

export default async function getAuthToken(): Promise<string> {
    const body = {
        client_id: process.env.OSU_CLIENT_ID,
        client_secret: process.env.OSU_CLIENT_SECRET,
        grant_type: 'client_credentials',
        scope: 'public'
    }

    try {
        const response = await Axios.post('https://osu.ppy.sh/oauth/token', body, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        const { access_token } = response.data

        return access_token
    } catch (error) {
        console.error('Error fetching access token', error)
        throw new Error('Failed to obtain access token')
    }
}