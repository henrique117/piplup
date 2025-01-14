"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
async function githubEmbedBuilder() {
    const embed = new discord_js_1.EmbedBuilder()
        .setColor('Aqua')
        .setTitle('Piplup')
        .setURL('https://github.com/henrique117/piplup')
        .setDescription('Hi! Check out my full open source code on Github! Feel free to drop a star!\n\nAlso, if u have any sugestions, you can DM me on my Discord (iccy11706)!');
    return embed;
}
exports.default = githubEmbedBuilder;
