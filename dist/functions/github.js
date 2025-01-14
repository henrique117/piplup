"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auxiliarfunctions_export_1 = require("../auxiliarfunctions/auxiliarfunctions.export");
async function github(interaction) {
    const githubEmbed = await (0, auxiliarfunctions_export_1.githubEmbedBuilder)();
    interaction.reply({ embeds: [githubEmbed] });
}
exports.default = github;
