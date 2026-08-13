const embeds = require('../Embeds.js');
module.exports = {
    data: { name: 'ping', description: 'Check bot latency' },
    async execute(interaction) {
        await interaction.reply({ embeds: [embeds.primary('Ping', `Latency: ${interaction.client.ws.ping}ms`)], flags: 64 });
    }
};
//lwk was too lazy to delete this aswell also from my discord bot template