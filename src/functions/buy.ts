import { CommandInteraction, Message, MessageFlags } from 'discord.js'
import { findItem, findUser, newPurchase, updateUserCoins, updateUserPacks } from '../database/dbQuerys'

export default async function buy(interaction: CommandInteraction | Message): Promise<void> {

    if(interaction instanceof CommandInteraction) {

        const item_id = interaction.options.get('itemid')?.value?.toString()
        const user_id = interaction.user.id
        
        if(!item_id || !user_id) {
            interaction.reply({ content: 'Bruh', flags: MessageFlags.Ephemeral})
            console.error('Bruh')
            return
        }

        try {

            const item_db = await findItem(parseInt(item_id))
            const user_db = await findUser(user_id)

            if(!user_db) {
                interaction.reply({ content: "You have to register yourself to buy any items", flags: MessageFlags.Ephemeral})
                return
            }

            if(!item_db) {
                interaction.reply({ content: "There is no item with this ID!", flags: MessageFlags.Ephemeral})
                return
            }

            if(user_db.user_coins < item_db.item_cost) {
                interaction.reply({ content: "You don't have enough coins to buy this item!", flags: MessageFlags.Ephemeral})
                return
            }

            const newBalance = user_db.user_coins - item_db.item_cost
            await updateUserCoins(user_db.user_id, newBalance)

            await newPurchase(user_db.user_id, item_db.item_id)

            interaction.reply({ content: `You successfully bought the item: **${item_db.item_name}!**` })

            const itemName = item_db.item_name.toLowerCase()

            if(itemName.includes('pack')) {
                if(itemName.includes('common')) {
                    await updateUserPacks(user_db.user_id, 'user_commonPacks')
                } else if (itemName.includes("rare")) {
                    await updateUserPacks(user_id, "user_rarePacks")
                } else if (itemName.includes("epic")) {
                    await updateUserPacks(user_id, "user_epicPacks")
                } else if (itemName.includes("legendary")) {
                    await updateUserPacks(user_id, "user_legendaryPacks")
                } else if (itemName.includes("ultimate")) {
                    await updateUserPacks(user_id, "user_ultimatePacks")
                } else {
                    throw new Error('Invalid pack type')
                }
            }

        } catch (err) {
            interaction.reply({ content: 'Error on buying function', flags: MessageFlags.Ephemeral })
            console.error('Error on buying function')
            return
        }
    }

    if(interaction instanceof Message) {

        const regex = /^.+\s\d+$/

        if(!regex.exec(interaction.content)) {
            interaction.reply('Type a valid ID!')
            return
        }

        const item_id = interaction.content.split(' ')[1]
        const user_id = interaction.author.id
        
        if(!item_id || !user_id) {
            interaction.reply('Bruh')
            console.error('Bruh')
            return
        }

        try {

            const item_db = await findItem(parseInt(item_id))
            const user_db = await findUser(user_id)

            if(!user_db) {
                interaction.reply("You have to register yourself to buy any items",)
                return
            }

            if(!item_db) {
                interaction.reply("There is no item with this ID!")
                return
            }

            if(user_db.user_coins < item_db.item_cost) {
                interaction.reply("You don't have enough coins to buy this item!")
                return
            }

            const newBalance = user_db.user_coins - item_db.item_cost
            await updateUserCoins(user_db.user_id, newBalance)

            await newPurchase(user_db.user_id, item_db.item_id)

            interaction.reply(`You successfully bought the item: **${item_db.item_name}!**`)

            const itemName = item_db.item_name.toLowerCase()

            if(itemName.includes('pack')) {
                if(itemName.includes('common')) {
                    await updateUserPacks(user_db.user_id, 'user_commonPacks')
                } else if (itemName.includes("rare")) {
                    await updateUserPacks(user_id, "user_rarePacks")
                } else if (itemName.includes("epic")) {
                    await updateUserPacks(user_id, "user_epicPacks")
                } else if (itemName.includes("legendary")) {
                    await updateUserPacks(user_id, "user_legendaryPacks")
                } else if (itemName.includes("ultimate")) {
                    await updateUserPacks(user_id, "user_ultimatePacks")
                } else {
                    throw new Error('Invalid pack type')
                }
            }

        } catch (err) {
            interaction.reply('Error on the purchase function')
            console.error('Error on the purchase function')
            return
        }
    }
}