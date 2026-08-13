"use strict";
//this command file sends custom messages of users choice + sends 2 set messages from messages.js
const embeds = require('../Embeds.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Cooldown, Logger } = require('../functions/core/Manager.js');
const spamTimers = require('../functions/spamTimers.js');

module.exports = {
    data: { 
        name: 'custom', 
        description: 'Get a spam button with your own message',
        integration_types: [0, 1],
        contexts: [0, 1, 2],
        options: [{
            name: 'message',
            description: 'Your custom message to spam',
            type: 3,
            required: true,
            max_length: 256
        }]
    },
    async execute(interaction) {
        //2 min cooldown for /custom
        const remaining = Cooldown.check(interaction.user.id, 'custom', 120);
        if (remaining > 0) {
            return Cooldown.reply(interaction, remaining);
        }

        //log command usage with custom message
        await Logger.slashCommand(interaction);

        const customMsg = interaction.options.getString('message');

        const button = new ButtonBuilder()
            .setCustomId(`custom_spam_${interaction.user.id}`)
            .setLabel('Spam Me')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(button);

        const expiresAt = Math.floor((Date.now() + 300000) / 1000);

        spamTimers.set(`custom_${interaction.user.id}`, {
            expiresAt: Date.now() + 300000,
            customMessage: customMsg
        });

        await interaction.reply({
            embeds: [embeds.primary('Custom Ad', `Message: **${customMsg}**\n-# Expires <t:${expiresAt}:R>`)],
            components: [row],
            flags: 64
        });

        setTimeout(async () => {
            try {
                spamTimers.delete(`custom_${interaction.user.id}`);
                const disabledButton = new ButtonBuilder()
                    .setCustomId('custom_expired')
                    .setLabel('Spam Me')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true);

                const disabledRow = new ActionRowBuilder().addComponents(disabledButton);

                await interaction.editReply({
                    embeds: [embeds.warning('Stopped', '**Custom Ad** timed out')],
                    components: [disabledRow]
                });
            } catch {}
        }, 300000);
    }
};
