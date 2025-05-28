
const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-produto')
        .setDescription('Adicionar um novo produto à loja'),
    
    async execute(interaction) {
        // Verificar permissões (apenas administradores)
        if (!interaction.member.permissions.has('Administrator')) {
            return await interaction.reply({ 
                content: '❌ Você não tem permissão para usar este comando!', 
                ephemeral: true 
            });
        }
        
        // Criar modal para cadastro do produto
        const modal = new ModalBuilder()
            .setCustomId('product_modal')
            .setTitle('Cadastrar Novo Produto');
        
        // Campos do formulário
        const nameInput = new TextInputBuilder()
            .setCustomId('product_name')
            .setLabel('Nome do Produto')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(100);
        
        const priceInput = new TextInputBuilder()
            .setCustomId('product_price')
            .setLabel('Preço (apenas números, ex: 29.90)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(10);
        
        const descriptionInput = new TextInputBuilder()
            .setCustomId('product_description')
            .setLabel('Descrição do Produto')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setMaxLength(500);
        
        const stockInput = new TextInputBuilder()
            .setCustomId('product_stock')
            .setLabel('Quantidade em Estoque')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(5);
        
        const roleInput = new TextInputBuilder()
            .setCustomId('product_role')
            .setLabel('ID do Cargo (opcional)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setMaxLength(20);
        
        // Adicionar campos ao modal
        const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
        const secondActionRow = new ActionRowBuilder().addComponents(priceInput);
        const thirdActionRow = new ActionRowBuilder().addComponents(descriptionInput);
        const fourthActionRow = new ActionRowBuilder().addComponents(stockInput);
        const fifthActionRow = new ActionRowBuilder().addComponents(roleInput);
        
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);
        
        // Mostrar modal
        await interaction.showModal(modal);
    }
};
