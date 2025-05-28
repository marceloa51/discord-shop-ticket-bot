
const { SlashCommandBuilder } = require('discord.js');
const { productDB } = require('../data/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remover-produto')
        .setDescription('Remover um produto da loja')
        .addIntegerOption(option =>
            option.setName('id')
                .setDescription('ID do produto para remover')
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
            
            await productDB.delete(productId);
            
            await interaction.reply({ 
                content: `✅ Produto "${product.name}" (ID: ${productId}) removido com sucesso!`, 
                ephemeral: true 
            });
            
        } catch (error) {
            console.error('Erro ao remover produto:', error);
            await interaction.reply({ 
                content: '❌ Erro ao remover produto!', 
                ephemeral: true 
            });
        }
    }
};
