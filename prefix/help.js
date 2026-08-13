"use strict";

const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'View all prefix commands',
    async execute(message, args, client) {
        const prefixList = [];
        for (const cmd of client.prefixCommands.values()) {
            prefixList.push(`⬡ \`$${cmd.name}\` - ${cmd.description || 'No description'}`);
        }

        const embed = new EmbedBuilder()
            .setTitle('Help · Prefix Commands')
            .setDescription(prefixList.join('\n') || 'No prefix commands loaded.')
            .setColor(0x2D1B4E)
            .setFooter({ text: `Prefix: $` });

        await message.reply({ embeds: [embed] });
    }
};