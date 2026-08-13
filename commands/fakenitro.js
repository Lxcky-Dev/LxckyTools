"use strict";
//this is fakenitro smh i couldnt implement in LuckyTools as Atler was against it got ip logging
//but this one when claim button is clicked itll js send ad msgs 
//also because im cool i made it so u can choose who it says sent the gif 
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const spamTimers = require('../functions/spamTimers.js');
const embeds = require('../Embeds.js');

function generateNitroCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 24; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

module.exports = {
    data: { 
        name: 'fakenitro', 
        description: 'Generate a fake Nitro gift',
        integration_types: [0, 1],
        contexts: [0, 1, 2],
        options: [{
            name: 'user',
            description: 'Who to say sent the gift',
            type: 6,
            required: false
        }]
    },
    async execute(interaction) {
        const sender = interaction.options.getUser('user') || interaction.user;
        const code = generateNitroCode();

        const button = new ButtonBuilder()
            .setCustomId(`fakenitro_${interaction.user.id}`)
            .setLabel('Send Gift')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(button);

        const expiresAt = Math.floor((Date.now() + 300000) / 1000);

        spamTimers.set(`fakenitro_${interaction.user.id}`, {
            sender,
            code,
            expiresAt: Date.now() + 300000
        });

        await interaction.reply({
            embeds: [embeds.nitroGift(sender.username)],
            content: `-# Click below to send · Expires <t:${expiresAt}:R>`,
            components: [row],
            flags: 64
        });

        setTimeout(async () => {
            try {
                spamTimers.delete(`fakenitro_${interaction.user.id}`);
                const disabledButton = new ButtonBuilder()
                    .setCustomId('fakenitro_expired')
                    .setLabel('Send Gift')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true);

                const disabledRow = new ActionRowBuilder().addComponents(disabledButton);

                await interaction.editReply({
                    content: 'Session expired.',
                    components: [disabledRow]
                });
            } catch {}
        }, 300000);
    }
};