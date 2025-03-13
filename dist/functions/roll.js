"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function roll(interaction) {
    const regex = /^.+(\s\d+)?(\s.+)?/;
    if (!regex.test(interaction.content)) {
        interaction.reply('Use the command &roll [number]');
        return;
    }
    var limit = !isNaN(Number(interaction.content.split(' ')[1])) ? parseInt(interaction.content.split(' ')[1]) : 100;
    if (limit > 10000) {
        limit = 10000;
    }
    interaction.reply(`${Math.floor(Math.random() * limit) + 1}`);
}
exports.default = roll;
