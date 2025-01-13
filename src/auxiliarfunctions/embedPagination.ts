import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from 'discord.js'

export default async function embedPagination(interaction: any, pages: EmbedBuilder[], time = 50000) {
    try {
        if (!interaction || !pages || pages.length === 0) throw new Error('Nenhuma página encontrada.')

        if (pages.length === 1) {
            return await interaction.editReply({ embeds: [pages[0].data], components: [], fetchReply: true })
        }

        let index = 0

        const first = new ButtonBuilder()
            .setCustomId('pagefirst')
            .setEmoji('⏮️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)

        const prev = new ButtonBuilder()
            .setCustomId('pageprev')
            .setEmoji('⬅️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)

        const pageCount = new ButtonBuilder()
            .setCustomId('pagecount')
            .setLabel(`${index + 1}/${pages.length}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)

        const next = new ButtonBuilder()
            .setCustomId('pagenext')
            .setEmoji('➡️')
            .setStyle(ButtonStyle.Primary)

        const last = new ButtonBuilder()
            .setCustomId('pagelast')
            .setEmoji('⏩')
            .setStyle(ButtonStyle.Primary)

        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(first, prev, pageCount, next, last)

        const msg = await interaction.reply({ embeds: [pages[index].data], components: [buttons], fetchReply: true })

        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time
        })

        collector.on('collect', async (i: any) => {
            if (i.user.id !== interaction.author.id) {
                return await i.reply({ content: `Você não pode usar este botão.`, ephemeral: true })
            }

            await i.deferUpdate()

            if (i.customId === 'pagefirst') index = 0
            else if (i.customId === 'pageprev' && index > 0) index--
            else if (i.customId === 'pagenext' && index < pages.length - 1) index++
            else if (i.customId === 'pagelast') index = pages.length - 1

            pageCount.setLabel(`${index + 1}/${pages.length}`)

            first.setDisabled(index === 0)
            prev.setDisabled(index === 0)
            next.setDisabled(index === pages.length - 1)
            last.setDisabled(index === pages.length - 1)

            await msg.edit({ embeds: [pages[index].data], components: [buttons] }).catch(console.log)
            collector.resetTimer()
        })

        collector.on("end", async () => {
            await msg.edit({ embeds: [pages[index].data], components: [] })
        })

        return msg
    } catch (e) {
        console.error(e)
    }
}