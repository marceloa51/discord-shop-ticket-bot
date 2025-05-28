
module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`🤖 Bot ${client.user.tag} está online!`);
        console.log(`📊 Conectado em ${client.guilds.cache.size} servidor(es)`);
        
        // Definir atividade do bot
        client.user.setActivity('🛒 Gerenciando a loja', { type: 'WATCHING' });
    }
};
