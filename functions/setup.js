"use strict";

const fs = require('fs');
const path = require('path');
//make sure you change admessages to wtv u got in messages.js
const functionsDir = path.join(__dirname);
const files = {
    'messages.js': `"use strict";

module.exports = {
    adMessages: [
        "Join our Discord server! https://discord.gg/the-end",
        "Check out our community! https://discord.gg/the-end",
        "Best R41d server around, https://discord.gg/the-end ",
        "Looking for active members then join https://discord.gg/the-end",
        "R41d Events Weekly here at https://discord.gg/the-end"
    ]
};`,
    'spamTimers.js': `"use strict";

const timers = new Map();

module.exports = {
    get(userId) { return timers.get(userId); },
    set(userId, data) { timers.set(userId, data); },
    delete(userId) { timers.delete(userId); }
};`,
    'buttonHandler.js': `"use strict";

const embeds = require('../Embeds.js');
const { adMessages } = require('./messages.js');
const spamTimers = require('./spamTimers.js');

module.exports = {
    async handle(interaction) {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'spam_me_expired') {
            return interaction.reply({ 
                embeds: [embeds.error('Expired', 'Run \`/ad\` again.')], 
                flags: 64 
            });
        }

        if (interaction.customId === 'spam_me') {
            const data = spamTimers.get(interaction.user.id);
            
            if (!data || Date.now() > data.expiresAt) {
                return interaction.reply({ 
                    embeds: [embeds.error('Expired', 'Run \`/ad\` again.')], 
                    flags: 64 
                });
            }

            await interaction.deferReply({ flags: 64 });

            for (let i = 0; i < 5; i++) {
                const msg = adMessages[Math.floor(Math.random() * adMessages.length)];
                await interaction.followUp({ content: msg }).catch(() => {});
                await new Promise(r => setTimeout(r, 250));
            }

            await interaction.editReply({ embeds: [embeds.success('Sent', 'Sent 5 messages!')] });
        }
    }
};`
};

module.exports = {
    createAll() {
        if (!fs.existsSync(functionsDir)) {
            fs.mkdirSync(functionsDir);
        }
        for (const [fileName, content] of Object.entries(files)) {
            const filePath = path.join(functionsDir, fileName);
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, content);
                console.log(`Created: functions/${fileName}`);
            }
        }
    }
};