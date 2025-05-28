
const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { productDB } = require('../data/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('editar-produto')
        .setDescription('Editar um produto existente')
        .addIntegerOption(option =>
            option.setName('id')
                .setDescription('ID do produto para editar')
                .setRequired(true)),
    
    async execute(interaction) {
        // Verificar permissões
        if (!interaction.member.permissions.has('Administrator')) {
            return await interaction.reply({ 
                content: '❌ Você não tem permissão para usar este comando!', 
                ephemeral: true 
            });
        }
        
        const productId = interaction.options.getInteger('id');
        
        try {
            const product = await productDB.getById(productId);
            
            if (!product) {
                return await interaction.reply({ 
                    content: '❌ Produto não encontrado!', 
                    ephemeral: true 
                });
            }
            
            // Criar modal com dados atuais
            const modal = new ModalBuilder()
                .setCustomId(`edit_product_${productId}`)
                .setTitle(`Editar Produto: ${product.name}`);
            
            const nameInput = new TextInputBuilder()
                .setCustomId('product_name')
                .setLabel('Nome do Produto')
                .setStyle(TextInputStyle.Short)
                .setValue(product.name)
                .setRequired(true);
            
            const priceInput = new TextInputBuilder()
                .setCustomId('product_price')
                .setLabel('Preço')
                .setStyle(TextInputStyle.Short)
                .setValue(product.price.toString())
                .setRequired(true);
            
            const descriptionInput = new TextInputBuilder()
                .setCustomId('product_description')
                .setLabel('Descrição')
                .setStyle(TextInputStyle.Paragraph)
                .setValue(product.description || '')
                .setRequired(false);
            
            const stockInput = new TextInputBuilder()
                .setCustomId('product_stock')
                .setLabel('Estoque')
                .setStyle(TextInputStyle.Short)
                .setValue(product.stock.toString())
                .setRequired(true);
            
            const firstRow = new ActionRowBuilder().addComponents(nameInput);
            const secondRow = new ActionRowBuilder().addComponents(priceInput);
            const thirdRow = new ActionRowBuilder().addComponents(descriptionInput);
            const fourthRow = new ActionRowBuilder().addComponents(stockInput);
            
            modal.addComponents(firstRow, secondRow, thirdRow, fourthRow);
            
            await interaction.showModal(modal);
            
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            await interaction.reply({ 
                content: '❌ Erro ao buscar produto!', 
                ephemeral: true 
            });
        }
    }
};
