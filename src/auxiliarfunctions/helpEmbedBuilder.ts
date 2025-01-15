import { EmbedBuilder } from 'discord.js'

export default async function helpEmbedBuilder(): Promise<EmbedBuilder> {
    const embed = new EmbedBuilder()
        .setColor('Aqua')
        .setTitle('Piplup commands:')
        .setThumbnail('https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/393.png')
        .setDescription(`&help - Bruh\n
                         **&register | &reg** - Register you in the database\n\n**COINS:**\n
                         **&balance [Mention] | &bal** - Show your balance (Mention someone to see their balance)\n
                         **&transfer {Coins} {Mention} | &pix** - To send coins to someone\n
                         **&shop | &s** - Show all items in the shop\n
                         **&info {Item ID} | &i** - Show infos about an item in the shop\n
                         **&buy {Item ID}** - To buy any item in the shop\n\n**PACKS:**\n 
                         **&mypacks | &mp** - Show how many packs do you have\n
                         **&open {Pack type} [Number] | &o** - Open a pack if you have one (Add a number to open more than once)\n\n**PLAYERS:**\n
                         **&player {Player ID | "Player name"} | &p** - Show infos about any player\n
                         **&myplayers [Mention] | &mpl** - Show your players (Mention someone to see their players)\n
                         **&sell {Player ID | "Player name"} | &sl** - Sell a player\n
                         **&sellall | &sa** - Sell all of your players\n\n**SERVER CONFIGS: (ADMIN ONLY)**\n
                         **&setchannel** - Enable messages on this channel\n
                         **&unsetchannel** - Disable messages on this channel\n\n**OTHERS:**
                         **&github | &git** - Send informations about my Github repository\n
                        `)

    return embed
}