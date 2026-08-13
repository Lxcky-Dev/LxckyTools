"use strict";
//idk why i spent 30 minuets making a animation for console but oh well ;-;
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ] 
});
client.commands = new Map();
client.prefixCommands = new Map();

const PREFIX = '$';
const INVITE_LINK = 'https://discord.gg/the-end';
const { MAIN_GUILD } = require('./functions/commandManager.js');

async function start() {
    console.clear();
    console.log('╔══════════════════════════════════════╗');
    console.log('║       LxckyTools Starting...         ║');
    console.log('╚══════════════════════════════════════╝');
    console.log('');

    process.stdout.write('[1/6] Loading Discord Token...        ');
    await sleep(600);
    console.log('✓ Connected');

    process.stdout.write('[2/6] Connecting to Discord...        ');
    await sleep(400);
    console.log('✓ Online');

    const cmdDir = path.join(__dirname, 'commands');
    const funcDir = path.join(__dirname, 'functions');
    const prefixDir = path.join(__dirname, 'prefix');

    if (!fs.existsSync(cmdDir)) fs.mkdirSync(cmdDir);
    if (!fs.existsSync(funcDir)) fs.mkdirSync(funcDir);
    if (!fs.existsSync(prefixDir)) fs.mkdirSync(prefixDir);

    const setup = require('./functions/setup.js');
    setup.createAll();

    // Load slash commands
    process.stdout.write('[3/6] Loading Commands...             ');
    await sleep(300);
    
    const cmdList = [];
    for (const file of fs.readdirSync(cmdDir).filter(f => f.endsWith('.js'))) {
        const cmd = require(path.join(cmdDir, file));
        if (cmd.data) {
            client.commands.set(cmd.data.name, cmd);
            cmdList.push(cmd.data.name);
        }
    }
    console.log(`✓ ${cmdList.length} Loaded`);
    
    for (const name of cmdList) {
        console.log(`     ⬡ /${name}`);
    }

    // Load prefix commands
    process.stdout.write('[4/6] Loading Prefix Commands...      ');
    await sleep(200);
    
    const prefixList = [];
    if (fs.existsSync(prefixDir)) {
        for (const file of fs.readdirSync(prefixDir).filter(f => f.endsWith('.js'))) {
            const cmd = require(path.join(prefixDir, file));
            if (cmd.name) {
                client.prefixCommands.set(cmd.name, cmd);
                prefixList.push(cmd.name);
            }
        }
    }
    console.log(`✓ ${prefixList.length} Loaded`);
    
    for (const name of prefixList) {
        console.log(`     ⬡ ${PREFIX}${name}`);
    }

    // Load functions
    process.stdout.write('[5/6] Loading Functions Folder...     ');
    await sleep(200);
    const commandManager = require('./functions/commandManager.js');
    console.log('✓ Ready');

    // Slash commands & buttons
    client.on('interactionCreate', async (interaction) => {
        if (interaction.isCommand()) {
            await commandManager.handleCommand(interaction);
        } else if (interaction.isButton()) {
            await commandManager.handleButton(interaction);
        }
    });

    // Prefix commands
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith(PREFIX)) return;

        // Check if user is in main guild
        const inGuild = await commandManager.isInMainGuild(client, message.author.id);
        if (!inGuild) {
            try {
                await message.author.send(`You must be in our Discord server to use this bot.\n${INVITE_LINK}`);
            } catch {}
            return;
        }

        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        const cmd = client.prefixCommands.get(commandName);
        if (!cmd) return;

        // Block .n from running in the main guild
        if (commandName === 'n' && message.guild?.id === MAIN_GUILD) {
            return message.reply('This command cannot be used in this server.');
        }

        try {
            await cmd.execute(message, args, client);
        } catch (e) {
            console.error(`Prefix command error (${commandName}):`, e);
            await message.reply('There was an error running this command.').catch(() => {});
        }
    });

    process.stdout.write('[6/6] Starting bot...                 ');
    await sleep(500);

    client.login(process.env.TOKEN).then(async () => {
        console.log('✓ LxckyTools Ready');
        console.log('');

        const commands = [];
        for (const cmd of client.commands.values()) {
            commands.push(cmd.data);
        }
        
        process.stdout.write('     Globally Registering Commands...  ');
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log(`✓ ${commands.length} Registered`);

        console.log('');
        console.log('╔══════════════════════════════════════╗');
        console.log(`║  Logged in as ${client.user.tag.padEnd(22)}║`);
        console.log(`║  Prefix: ${(PREFIX + ' '.repeat(31)).substring(0,32)}║`);
        console.log('║                                      ║');
        console.log('║  Protected Server:                   ║');
        
        try {
            const guild = await client.guilds.fetch(MAIN_GUILD).catch(() => null);
            const name = guild ? guild.name : 'Unknown';
            console.log(`║  ${(name + ' (' + MAIN_GUILD + ')').padEnd(36)}║`);
        } catch {
            console.log(`║  Unknown (${MAIN_GUILD})`.padEnd(39) + '║');
        }
        
        console.log('╚══════════════════════════════════════╝');
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

start();