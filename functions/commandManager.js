"use strict";
//change this to your guild id that the bot is in 
//also make sure that its the same as the server id in index.js
const MAIN_GUILD = '1510270610486595675';
const INVITE_LINK = 'https://discord.gg/the-end';
//lwk got annoyed at the fact commands was usable in main server 
//as the bot is in the server so added a blocked check :D

async function isInMainGuild(client, userId) {
    try {
        const guild = await client.guilds.fetch(MAIN_GUILD).catch(() => null);
        if (!guild) return false;
        const member = await guild.members.fetch(userId).catch(() => null);
        return !!member;
    } catch {
        return false;
    }
}

module.exports = {
    MAIN_GUILD,

    isInMainGuild,
    //basically what ts does is check if users are in our server 
    //if they arnt they cant use the bots functions untill they join
    async handleCommand(interaction) {
        if (!interaction.isCommand()) return;

        const inGuild = await isInMainGuild(interaction.client, interaction.user.id);
        if (!inGuild) {
            return interaction.reply({ 
                content: `You must be in our Discord server to use this bot.\n${INVITE_LINK}`, 
                flags: 64 
            });
        }

        const cmd = interaction.client.commands.get(interaction.commandName);
        if (!cmd) return;

        try { 
            await cmd.execute(interaction); 
        } catch (e) { 
            console.error(e); 
        }
    },
    //button handler for /ad ect basically just makes the embed show a button that u can spam
    async handleButton(interaction) {
        if (!interaction.isButton()) return;

        const inGuild = await isInMainGuild(interaction.client, interaction.user.id);
        if (!inGuild) {
            return interaction.reply({ 
                content: `You must be in our Discord server to use this bot.\n${INVITE_LINK}`, 
                flags: 64 
            });
        }

        const buttonHandler = require('./buttonHandler.js');
        await buttonHandler.handle(interaction);
    }
};