import { CommandInteraction, Message, PermissionsBitField } from 'discord.js'
import { deleteChannel, findChannel } from '../database/dbQuerys'

export default async function unsetchannel(interaction: CommandInteraction | Message): Promise<void> {
    const user = interaction.member

    if (user && 'permissions' in user && user.permissions instanceof PermissionsBitField) {
        if (user.permissions.has('Administrator')) {

            if(interaction.channel?.id && interaction.guild?.id) {

                const channel = await findChannel(interaction.channel.id, interaction.guild.id)

                if(!channel) {
                    interaction.reply('This channel is not seted!')
                    return
                }
                
                await deleteChannel(interaction.channel.id, interaction.guild.id)
                interaction.reply('Channel unset successfully!')
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