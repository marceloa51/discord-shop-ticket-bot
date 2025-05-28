
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const { initDatabase } = require('./data/database');
require('dotenv').config();

// Criar cliente do bot com as permissões necessárias
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});

// Coleção para armazenar comandos
client.commands = new Collection();

// Inicializar bot
async function init() {
    try {
        // Inicializar banco de dados
        await initDatabase();
        console.log('✅ Banco de dados inicializado');
        
        // Carregar comandos e eventos
        await loadCommands(client);
        await loadEvents(client);
        
        // Login do bot
        await client.login(process.env.TOKEN);
        
    } catch (error) {
        console.error('❌ Erro ao inicializar bot:', error);
    }
}

init();
