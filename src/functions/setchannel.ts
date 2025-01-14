import { CommandInteraction, Message, PermissionsBitField } from 'discord.js'
import { findChannel, newChannel } from '../database/dbQuerys'

export default async function setchannel(interaction: CommandInteraction | Message): Promise<void> {
    const user = interaction.member

    if (user && 'permissions' in user && user.permissions instanceof PermissionsBitField) {
        if (user.permissions.has('Administrator')) {

            if(interaction.channel?.id && interaction.guild?.id) {

                const channel = await findChannel(interaction.channel.id, interaction.guild.id)

                if(channel) {
                    interaction.reply('This channel is already seted!')
                    return
                }

                await newChannel(interaction.channel.id, interaction.guild.id)
                interaction.reply('Channel set successfully!')
                return

            } else {
                interaction.reply("Oops, I couldn't find this channel")
                return
            }
        } else {
            interaction.reply("You have to be a server Administrator to run this command!")
            return
        }
    } else {
        return
    }
}