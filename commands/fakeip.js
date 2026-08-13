"use strict";
//if u want to add more locations do so via locations.js file 
//lwk got most already so it should be find unless u want smh specific
const embeds = require('../Embeds.js');
const locations = require('../functions/locations.js');
const spamTimers = require('../functions/spamTimers.js');
const { Cooldown, Logger } = require('../functions/core/Manager.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: { 
        name: 'fakeip', 
        description: 'Generate a fake IP lookup',
        integration_types: [0, 1],
        contexts: [0, 1, 2],
        options: [
            {
                name: 'user',
                description: 'The user to lookup',
                type: 6,
                required: true
            },
            {
                name: 'location',
                description: 'Choose a location',
                type: 3,
                required: true,
                choices: Object.keys(locations).map(loc => ({ name: loc, value: loc }))
            }
        ]
    },
    async execute(interaction) {
        //2 min cooldown for /fakeip
        const remaining = Cooldown.check(interaction.user.id, 'fakeip', 120);
        if (remaining > 0) {
            return Cooldown.reply(interaction, remaining);
        }

        //log command usage
        await Logger.slashCommand(interaction);

        const targetUser = interaction.options.getUser('user');
        const location = interaction.options.getString('location');
        const data = locations[location];

        if (!data) {
            return interaction.reply({ content: 'Invalid location.', flags: 64 });
        }

        const ip = data.ip();
        const isp = data.isp;

        const button = new ButtonBuilder()
            .setCustomId(`fakeip_${interaction.user.id}`)
            .setLabel('Lookup IP')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        const expiresAt = Math.floor((Date.now() + 300000) / 1000);

        spamTimers.set(`fakeip_${interaction.user.id}`, {
            targetUser,
            location,
            ip,
            isp,
            range: data.range,
            expiresAt: Date.now() + 300000
        });

        await interaction.reply({
            content: `IP lookup ready for **${targetUser.username}**.`,
            components: [row],
            flags: 64
        });

        setTimeout(async () => {
            try {
                spamTimers.delete(`fakeip_${interaction.user.id}`);
                await interaction.editReply({ content: 'Session expired.', components: [] });
            } catch {}
        }, 300000);
    }
};
