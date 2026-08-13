"use strict";
//change ad messages at messages.js
const embeds = require('../Embeds.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Cooldown, Logger } = require('../functions/core/Manager.js');
const spamTimers = require('../functions/spamTimers.js');

module.exports = {
    data: { 
        name: 'ad', 
        description: 'Get a spam button that works anywhere',
        integration_types: [0, 1],
        contexts: [0, 1, 2]
    },
    async execute(interaction) {
        //2 min cooldown for /ad
        const remaining = Cooldown.check(interaction.user.id, 'ad', 120);
        if (remaining > 0) {
            return Cooldown.reply(interaction, remaining);
        }

        //log command usage
        await Logger.slashCommand(interaction);

        const button = new ButtonBuilder()
            .setCustomId('spam_me')
            .setLabel('Spam Me')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(button);

        const expiresAt = Math.floor((Date.now() + 300000) / 1000);

        spamTimers.set(interaction.user.id, {
            expiresAt: Date.now() + 300000
        });

        await interaction.reply({
            embeds: [embeds.primary('Ad', `Click the button to spam messages!\n-# Expires <t:${expiresAt}:R>`)],
            components: [row],
            flags: 64
        });

        setTimeout(async () => {
            try {
                spamTimers.delete(interaction.user.id);
                const disabledButton = new ButtonBuilder()
                    .setCustomId('spam_me_expired')
                    .setLabel('Spam Me')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true);

                const disabledRow = new ActionRowBuilder().addComponents(disabledButton);

                await interaction.editReply({
                    embeds: [embeds.warning('Stopped', '**Ad** timed out')],
                    components: [disabledRow]
                });
            } catch {}
        }, 300000);
    }
};
