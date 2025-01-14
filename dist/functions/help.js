"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const auxiliarfunctions_export_1 = require("../auxiliarfunctions/auxiliarfunctions.export");
async function help(interaction) {
    try {
        const helpEmbed = await (0, auxiliarfunctions_export_1.helpEmbedBuilder)();
        const dmChannel = interaction instanceof discord_js_1.CommandInteraction ? await interaction.user.createDM() : await interaction.author.createDM();
        await dmChannel.send({ embeds: [helpEmbed] });
        if (interaction instanceof discord_js_1.Message)
            interaction.react('👍');
        return;
    }
    catch (err) {
        interaction.reply('Open your DM!!');
        return;
    }
}
exports.default = help;
