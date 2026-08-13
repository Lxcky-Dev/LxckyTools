"use strict";

const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'logs.txt');
let logChannel = null;

function writeFile(type, content) {
    const msg = `[${new Date().toISOString()}] [${type}] ${content}`;
    try { fs.appendFileSync(logFile, msg + '\n'); } catch {}
}

async function sendEmbed(client, embed) {
    if (!logChannel && process.env.LOG_CHANNEL) {
        logChannel = await client.channels.fetch(process.env.LOG_CHANNEL).catch(() => null);
    }
    if (logChannel) {
        await logChannel.send({ embeds: [embed] }).catch(() => {});
    }
}

module.exports = {
    async slashCommand(interaction) {
        const cmd = interaction.commandName;
        const user = interaction.user;
        const guild = interaction.guild?.name || 'DM';
        const options = interaction.options?.data || [];
        
        let optionsList = 'None';
        if (options.length > 0) {
            optionsList = options.map(o => `**${o.name}**: \`${o.value || 'none'}\``).join('\n');
        }

        const embed = new EmbedBuilder()
            .setTitle('Slash Command Used')
            .setColor(0x2D1B4E)
            .addFields(
                { name: 'User', value: `${user.tag} (\`${user.id}\`)`, inline: true },
                { name: 'Command', value: `/${cmd}`, inline: true },
                { name: 'Location', value: guild, inline: true },
                { name: 'Options', value: optionsList, inline: false }
            )
            .setTimestamp();

        await sendEmbed(interaction.client, embed);
        writeFile('COMMAND', `${user.tag} used /${cmd} in ${guild}`);
    },

    async prefixCommand(message, command, args) {
        const user = message.author;
        const guild = message.guild?.name || 'DM';
        const argsText = args?.length ? args.join(' ') : 'None';

        const embed = new EmbedBuilder()
            .setTitle('Prefix Command Used')
            .setColor(0x2D1B4E)
            .addFields(
                { name: 'User', value: `${user.tag} (\`${user.id}\`)`, inline: true },
                { name: 'Command', value: `$${command}`, inline: true },
                { name: 'Location', value: guild, inline: true },
                { name: 'Args', value: `\`${argsText}\``, inline: false }
            )
            .setTimestamp();

        await sendEmbed(message.client, embed);
        writeFile('PREFIX', `${user.tag} used $${command} in ${guild}`);
    },

    async nukeStart(message) {
        const user = message.author;
        const guild = message.guild;

        const embed = new EmbedBuilder()
            .setTitle('Nuke Started')
            .setColor(0xF87171)
            .addFields(
                { name: 'User', value: `${user.tag} (\`${user.id}\`)`, inline: true },
                { name: 'Server', value: `${guild.name} (\`${guild.id}\`)`, inline: true },
                { name: 'Members', value: `${guild.memberCount}`, inline: true }
            )
            .setTimestamp();

        await sendEmbed(message.client, embed);
        writeFile('NUKE', `${user.tag} started nuke in ${guild.name}`);
    },

    async nukeComplete(message, channels, messages) {
        const user = message.author;
        const guild = message.guild;

        const embed = new EmbedBuilder()
            .setTitle('Nuke Completed')
            .setColor(0x4ADE80)
            .addFields(
                { name: 'User', value: `${user.tag} (\`${user.id}\`)`, inline: true },
                { name: 'Server', value: `${guild.name} (\`${guild.id}\`)`, inline: true },
                { name: 'Channels', value: `${channels}`, inline: true },
                { name: 'Messages', value: `${messages}`, inline: true }
            )
            .setTimestamp();

        await sendEmbed(message.client, embed);
        writeFile('NUKE', `${user.tag} nuke completed in ${guild.name}: ${channels} channels, ${messages} messages`);
    },

    async buttonClick(interaction) {
        const user = interaction.user;
        const guild = interaction.guild?.name || 'DM';
        const buttonId = interaction.customId.replace(interaction.user.id, '***');

        const embed = new EmbedBuilder()
            .setTitle('Button Clicked')
            .setColor(0x2D1B4E)
            .addFields(
                { name: 'User', value: `${user.tag} (\`${user.id}\`)`, inline: true },
                { name: 'Button', value: `\`${buttonId}\``, inline: true },
                { name: 'Location', value: guild, inline: true }
            )
            .setTimestamp();

        await sendEmbed(interaction.client, embed);
        writeFile('BUTTON', `${user.tag} clicked ${buttonId} in ${guild}`);
    },

    async error(source, error, client) {
        const embed = new EmbedBuilder()
            .setTitle('Error')
            .setColor(0xF87171)
            .addFields(
                { name: 'Source', value: `\`${source}\``, inline: true },
                { name: 'Error', value: `\`\`\`${(error?.message || String(error)).slice(0, 500)}\`\`\``, inline: false }
            )
            .setTimestamp();

        await sendEmbed(client, embed);
        writeFile('ERROR', `${source}: ${error?.message || error}`);
    }
};