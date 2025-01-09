"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const commands = [];
const commandsPath = path.join(__dirname, 'slashcommands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./slashcommands/${file}`);
    commands.push(command.data.toJSON());
}
const rest = new discord_js_1.REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const clientId = process.env.DISCORD_CLIENT_ID;
(async () => {
    try {
        console.log('🔄 Starting the commands deploy...');
        await rest.put(discord_js_1.Routes.applicationCommands(clientId), { body: commands });
        console.log('✅ Commands deployed successfully!');
    }
    catch (error) {
        console.error('Error on deploying commands: ', error);
    }
})();
