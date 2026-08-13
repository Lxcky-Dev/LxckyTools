"use strict";

const cooldowns = new Map();

module.exports = {
    check(userId, command, seconds = 5) {
        const key = `${userId}-${command}`;
        const now = Date.now();
        if (cooldowns.has(key) && now < cooldowns.get(key)) {
            return Math.ceil((cooldowns.get(key) - now) / 1000);
        }
        cooldowns.set(key, now + seconds * 1000);
        return 0;
    },

    clear(userId, command) {
        cooldowns.delete(`${userId}-${command}`);
    },

    reply(interaction, remaining) {
        if (remaining > 60) {
            return interaction.reply({ content: `Command on cooldown. Try again in ${Math.ceil(remaining / 60)} minutes.`, flags: 64 });
        }
        return interaction.reply({ content: `Command on cooldown. Try again in ${remaining} seconds.`, flags: 64 });
    }
};