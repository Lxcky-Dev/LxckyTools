"use strict";

const { Errors, Wrapper, Cooldown, Logger } = require('../functions/core/Manager.js');

module.exports = {
    name: 'spamroles',
    description: 'Create 250 roles in the server',
    async execute(message, args, client) {
        if (!message.guild) return message.reply('This command can only be used in a server.');

        const remaining = Cooldown.check(message.author.id, 'spamroles', 600);
        if (remaining > 0) {
            return message.reply(`Command on cooldown. Try again in ${Math.ceil(remaining / 60)} minutes.`);
        }

        await message.delete().catch(() => {});
        await Logger.prefixCommand(message, 'spamroles', args);

        const guild = message.guild;
        const botMember = guild.members.me;

        if (!botMember.permissions.has('ManageRoles')) {
            await Errors.handle('spamroles', { code: 50013 }, message);
            return;
        }

        let created = 0;
        const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF, 0x2D1B4E, 0xF87171];

        for (let i = 0; i < 250; i++) {
            const result = await Wrapper.handleWithRetry(
                () => guild.roles.create({
                    name: `LuckyTools-${i}`,
                    color: colors[Math.floor(Math.random() * colors.length)]
                }),
                'spamroles',
                message
            );

            if (result) created++;
            await new Promise(r => setTimeout(r, 200));
        }

        try { await message.author.send(`Created ${created} roles in ${guild.name}.`).catch(() => {}); } catch {}
    }
};
