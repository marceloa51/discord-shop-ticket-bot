
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Configurar sistema de tickets'),
    
    async execute(interaction) {
        // Verificar permissões
        if (!interaction.member.permissions.has('Administrator')) {
            return await interaction.reply({ 
                content: '❌ Você não tem permissão para usar este comando!', 
                ephemeral: true 
            });
        }
        
        // Criar embed e botão do ticket
        const ticketEmbed = new EmbedBuilder()
            .setTitle('🎫 Sistema de Tickets')
            .setDescription('Precisa de ajuda? Abra um ticket clicando no botão abaixo!\n\n**O que você pode fazer:**\n• Tirar dúvidas sobre produtos\n• Reportar problemas\n• Solicitar suporte\n• Sugestões')
            .setColor(0x0099ff)
            .setFooter({ text: 'Clique no botão para abrir um ticket' });
        
        const ticketButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('openticket')
                    .setLabel('🎫 Abrir Ticket')
                    .setStyle(ButtonStyle.Primary)
            );
        
        await interaction.reply({ 
            embeds: [ticketEmbed], 
            components: [ticketButton] 
        });
    }
};
