
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { productDB } = require('../data/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listar-produtos')
        .setDescription('Listar todos os produtos da loja'),
    
    async execute(interaction) {
        try {
            const products = await productDB.getAll();
            
            if (products.length === 0) {
                return await interaction.reply({ 
                    content: '❌ Nenhum produto encontrado!', 
                    ephemeral: true 
                });
            }
            
            // Criar embed para cada produto
            for (const product of products) {
                const productEmbed = new EmbedBuilder()
                    .setTitle(`🛍️ ${product.name}`)
                    .setDescription(product.description || 'Sem descrição')
                    .addFields(
                        { name: '💰 Preço', value: `R$ ${product.price}`, inline: true },
                        { name: '📦 Estoque', value: `${product.stock} unidades`, inline: true },
                        { name: '🆔 ID', value: `${product.id}`, inline: true }
                    )
                    .setColor(product.stock > 0 ? 0x00ff00 : 0xff0000)
                    .setFooter({ text: `Produto ${product.id}` })
                    .setTimestamp(new Date(product.created_at));
                
                if (product.thumbnail) {
                    productEmbed.setThumbnail(product.thumbnail);
                }
                
                // Botão para adicionar ao carrinho
                const productButton = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`addcart_${product.id}`)
                            .setLabel('🛒 Adicionar ao Carrinho')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(product.stock <= 0)
                    );
                
                await interaction.followUp({ 
                    embeds: [productEmbed], 
                    components: [productButton] 
                });
            }
            
            await interaction.reply({ content: `📋 Listando ${products.length} produto(s):` });
            
        } catch (error) {
            console.error('Erro ao listar produtos:', error);
            await interaction.reply({ 
                content: '❌ Erro ao buscar produtos!', 
                ephemeral: true 
            });
        }
    }
};
