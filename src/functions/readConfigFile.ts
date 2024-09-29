import * as fs from 'fs/promises'
import * as Interfaces from '../interfaces/interfaces.export'
import * as path from 'path'

export default async function readConfigFileAsync(): Promise<Interfaces.ConfigInterface | null> {
    const filePath = path.resolve(__dirname, '../../config.json')
    try {
        const jsonData = await fs.readFile(filePath, 'utf-8')
        const data: Interfaces.ConfigInterface = JSON.parse(jsonData)
        return data
    } catch {
        return null
    }
}