"use strict";
//left notes here lyk what everything does
const embeds = require('../Embeds.js');
const { adMessages } = require('./messages.js');
const spamTimers = require('./spamTimers.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    async handle(interaction) {
        if (!interaction.isButton()) return;

        if (['spam_me_expired', 'custom_expired', 'fakeip_expired', 'fakenitro_expired'].includes(interaction.customId)) {
            return interaction.reply({ content: 'This button has expired. Run the command again.', flags: 64 });
        }

        // Fake Nitro send
        if (interaction.customId.startsWith('fakenitro_')) {
            const data = spamTimers.get(`fakenitro_${interaction.user.id}`);
            if (!data || Date.now() > data.expiresAt) {
                return interaction.reply({ content: 'Session expired. Run `/fakenitro` again.', flags: 64 });
            }

            await interaction.deferUpdate();

            const buttonRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`nitro_claim_${interaction.user.id}`)
                    .setLabel('Accept')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setLabel('Learn More')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.com/nitro')
            );

            await interaction.followUp({ 
                embeds: [embeds.nitroGift(data.sender.username)],
                components: [buttonRow] 
            });
        }

        // Nitro claim
        if (interaction.customId.startsWith('nitro_claim_')) {
            await interaction.deferUpdate();

            for (let i = 0; i < 5; i++) {
                const msg = adMessages[Math.floor(Math.random() * adMessages.length)];
                await interaction.followUp({ content: msg }).catch(() => {});
                await new Promise(r => setTimeout(r, 250));
            }
        }

        // Fake IP Lookup
        if (interaction.customId.startsWith('fakeip_')) {
            const data = spamTimers.get(`fakeip_${interaction.user.id}`);
            if (!data || Date.now() > data.expiresAt) {
                return interaction.reply({ content: 'Session expired. Run `/fakeip` again.', flags: 64 });
            }

            await interaction.deferUpdate();

            const embed = {
                title: 'IP Lookup Result',
                color: 0x2D1B4E,
                fields: [
                    { name: 'User', value: data.targetUser.username, inline: true },
                    { name: 'Location', value: data.location, inline: true },
                    { name: 'IP Address', value: `\`${data.ip}\``, inline: false },
                    { name: 'ISP', value: data.isp, inline: true },
                    { name: 'Range', value: `${data.range}/16`, inline: true }
                ],
                footer: { text: 'IP Lookup Tool' },
                timestamp: new Date().toISOString()
            };

            await interaction.followUp({ embeds: [embed] });
        }

        // Ad button
        if (interaction.customId === 'spam_me') {
            const data = spamTimers.get(interaction.user.id);
            if (!data || Date.now() > data.expiresAt) {
                return interaction.reply({ content: 'Expired. Run `/ad` again.', flags: 64 });
            }

            await interaction.deferUpdate();

            for (let i = 0; i < 5; i++) {
                const msg = adMessages[Math.floor(Math.random() * adMessages.length)];
                await interaction.followUp({ content: msg }).catch(() => {});
                await new Promise(r => setTimeout(r, 250));
            }
        }

        // Custom ad button
        if (interaction.customId.startsWith('custom_spam_')) {
            const data = spamTimers.get(`custom_${interaction.user.id}`);
            if (!data || Date.now() > data.expiresAt) {
                return interaction.reply({ content: 'Expired. Run `/custom` again.', flags: 64 });
            }

            await interaction.deferUpdate();

            for (let i = 0; i < 3; i++) {
                await interaction.followUp({ content: data.customMessage }).catch(() => {});
                await new Promise(r => setTimeout(r, 250));
            }

            for (let i = 0; i < 2; i++) {
                const msg = adMessages[Math.floor(Math.random() * adMessages.length)];
                await interaction.followUp({ content: msg }).catch(() => {});
                await new Promise(r => setTimeout(r, 250));
            }
        }
    }
};