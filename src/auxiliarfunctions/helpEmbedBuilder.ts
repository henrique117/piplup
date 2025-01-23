import { EmbedBuilder } from 'discord.js'

export default async function helpEmbedBuilder(): Promise<EmbedBuilder> {
    const embed = new EmbedBuilder()
        .setColor('Aqua')
        .setTitle('Piplup commands:')
        .setThumbnail('https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/393.png')
        .setDescription(`**&help** - Bruh\n\n**&register | &reg** - Register you in the database\n\n**COINS:**\n\n**&balance [Mention] | &bal** - Show your balance (Mention someone to see their balance)\n\n**&transfer {Coins} {Mention} | &pix** - To send coins to someone\n\n**&shop | &s** - Show all items in the shop\n\n**&info {Item ID} | &i** - Show infos about an item in the shop\n\n**&buy {Item ID} [Number]** - To buy any item in the shop (Add a number if you wanna buy more than one item)\n\n**PACKS:**\n\n **&mypacks | &mp** - Show how many packs do you have\n\n**&open {Pack type} [Number] | &o** - Open a pack if you have one (Add a number to open more than once)\n\n**PLAYERS:**\n\n**&player {Player ID | "Player name"} | &p** - Show infos about any player\n\n**&myplayers [Mention] | &mpl** - Show your players (Mention someone to see their players)\n\n**&trade {Mention}** - Start a trade with someone\n\n**&sell {Player ID | "Player name"} | &sl** - Sell a player\n\n**&sellall [Player ID | "Player name"] | &sa** - Sell all of your players (Type the player ID or the player name to not sell them)\n\n**SERVER CONFIGS: (ADMIN ONLY)**\n\n**&setchannel** - Enable messages on this channel\n\n**&unsetchannel** - Disable messages on this channel\n\n## OTHERS:\n\n**&github | &git** - Send informations about my Github repository`)

    return embed
}