import * as fs from 'fs/promises'
import * as Interfaces from '../interfaces/interfaces.export'
import * as path from 'path'

export default async function writeConfigFileAsync(data: Interfaces.ConfigInterface): Promise<void> {
    const filePath = path.resolve(__dirname, '../../config.json')
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    } catch (error) {
        console.error(error)
    }
}