import { Client, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'
import * as Functions from './functions/functions.export'

dotenv.config()

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
})

client.once('ready', () => {
    console.log(`Bot conectado como ${client.user?.tag}`);
})

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('&rs') || message.content.startsWith('&recentscore')) {
        if (message.channel.id === '1175411697922605136' || message.channel.id === '1147991522407633086') {
            let playerId: number | null

            const mentionedUser = message.mentions?.users.first()

            if(mentionedUser !== undefined) {
                playerId = await Functions.getPlayerId(parseInt(mentionedUser.id))
            } else {
                playerId = await Functions.getPlayerId(parseInt(message.author.id))
            }
            
            if(!playerId) {
                message.reply('User não encontrado! Se registre usando o comando &su <seu ID do Takuji> ou &setuser <seu ID do Takuji>')
            } else {
                const response = await Functions.getRecentScore(playerId)

                if(response) {
                    response
                    const embed = await Functions.scoreEmbedCreator(response)
                    message.channel.send({ embeds: [embed] })
                }
            }
        } else nerd(message)     
    }

    if(message.content.startsWith('&top34563456365634')) {
        if (message.channel.id === '1175411697922605136' || message.channel.id === '1147991522407633086') {
            let playerId: number | null

            const mentionedUser = message.mentions?.users.first()

            if(mentionedUser !== undefined) {
                playerId = await Functions.getPlayerId(parseInt(mentionedUser.id))
            } else {
                playerId = await Functions.getPlayerId(parseInt(message.author.id))
            }

            if(!playerId) {
                message.reply('User não encontrado! Se registre usando o comando &su <seu ID do Takuji> ou &setuser <seu ID do Takuji>')
            } else {
                let isLoading = false

                try {
                    isLoading = true
                    console.log('Carregando...')

                    let response = await Functions.getTopScores(playerId)
                    console.log(response)
                } catch (error) {
                    console.error(error)
                } finally {
                    isLoading = false
                    console.log('Dados carregados')
                }
            }
        } else nerd(message)
    }

    if(message.content.startsWith('&su') || message.content.startsWith('&setuser')) {
        if (message.channel.id === '1175411697922605136' || message.channel.id === '1147991522407633086') {
            const response = await Functions.setUser(parseInt(message.content.split(' ')[1]), parseInt(message.author.id))
            message.reply(response)
        } else nerd(message)
    }
})

function nerd(event: any) {
    event.react('☝️')
    event.react('🤓')
}

client.login(process.env.TOKEN)