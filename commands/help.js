const embeds = require('../Embeds.js');
module.exports = {
    data: { name: 'help', description: 'View all commands' },
    async execute(interaction) {
        const cmdList = [];
        for (const cmd of interaction.client.commands.values()) {
            cmdList.push(`✦ \`/${cmd.data.name}\` - ${cmd.data.description}`);
        }
        await interaction.reply({ 
            embeds: [embeds.primary('Help', cmdList.join('\n') || 'No commands loaded')], 
            flags: 64 
        });
    }
};
//uhhhh well not much to say about this its the help command from my discord bot template
//yes this is made with my bot template on github mayaswell keep the help command 
//btw you dont need to add commands or anything itll js get them from commands folder