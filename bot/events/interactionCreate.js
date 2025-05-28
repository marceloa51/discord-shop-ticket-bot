
const { PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { cartDB, productDB } = require('../data/database');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // Lidar com comandos slash
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            
            if (!command) {
                console.error(`Comando ${interaction.commandName} não encontrado.`);
                return;
            }
            
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error('Erro ao executar comando:', error);
                await interaction.reply({ 
                    content: 'Houve um erro ao executar este comando!', 
                    ephemeral: true 
                });
            }
        }
        
        // Lidar com botões
        if (interaction.isButton()) {
            const [action, ...params] = interaction.customId.split('_');
            
            switch (action) {
                case 'addcart':
                    await handleAddToCart(interaction, params[0]);
                    break;
                case 'checkout':
                    await handleCheckout(interaction);
                    break;
                case 'cancelcart':
                    await handleCancelCart(interaction);
                    break;
                case 'genpay':
                    await handleGeneratePayment(interaction);
                    break;
                case 'validatepay':
                    await handleValidatePayment(interaction);
                    break;
                case 'openticket':
                    await handleOpenTicket(interaction);
                    break;
                case 'closeticket':
                    await handleCloseTicket(interaction);
                    break;
            }
        }
        
        // Lidar com modais
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'product_modal') {
                await handleProductModal(interaction);
            }
        }
    }
};

// Função para adicionar ao carrinho
async function handleAddToCart(interaction, productId) {
    try {
        const product = await productDB.getById(productId);
        if (!product) {
            return await interaction.reply({ content: '❌ Produto não encontrado!', ephemeral: true });
        }
        
        if (product.stock <= 0) {
            return await interaction.reply({ content: '❌ Produto fora de estoque!', ephemeral: true });
        }
        
        const userId = interaction.user.id;
        const guild = interaction.guild;
        
        // Verificar se já existe carrinho
        let existingCart = await cartDB.getByUserId(userId);
        
        if (existingCart) {
            const channel = guild.channels.cache.get(existingCart.channel_id);
            if (channel) {
                return await interaction.reply({ 
                    content: `🛒 Você já tem um carrinho ativo! Vá para ${channel}`, 
                    ephemeral: true 
                });
            }
        }
        
        // Criar canal do carrinho
        const cartChannel = await guild.channels.create({
            name: `carrinho-do-${interaction.user.username}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: userId,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                },
            ],
        });
        
        // Salvar carrinho no banco
        await cartDB.create(userId, cartChannel.id, [{ id: productId, quantity: 1 }]);
        
        // Enviar mensagem no carrinho
        const cartEmbed = {
            title: '🛒 Seu Carrinho',
            description: `**${product.name}**\nPreço: R$ ${product.price}\nQuantidade: 1`,
            color: 0x00ff00,
            footer: { text: 'Use os botões abaixo para gerenciar seu carrinho' }
        };
        
        const cartButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('checkout')
                    .setLabel('💳 Ir para Pagamento')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('cancelcart')
                    .setLabel('❌ Cancelar Carrinho')
                    .setStyle(ButtonStyle.Danger)
            );
        
        await cartChannel.send({ embeds: [cartEmbed], components: [cartButtons] });
        
        await interaction.reply({ 
            content: `✅ Produto adicionado ao carrinho! Vá para ${cartChannel}`, 
            ephemeral: true 
        });
        
    } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        await interaction.reply({ content: '❌ Erro interno!', ephemeral: true });
    }
}

// Função para checkout
async function handleCheckout(interaction) {
    const checkoutButtons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('genpay')
                .setLabel('💰 Gerar Pagamento')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('cancelcart')
                .setLabel('❌ Cancelar')
                .setStyle(ButtonStyle.Secondary)
        );
    
    await interaction.reply({ 
        content: '💳 Confirme seu pedido e gere o pagamento:', 
        components: [checkoutButtons] 
    });
}

// Função para gerar pagamento
async function handleGeneratePayment(interaction) {
    const qrcode = require('qrcode');
    
    // Gerar código PIX fictício
    const pixCode = `00020126330014BR.GOV.BCB.PIX0111${Math.random().toString(36).substring(7)}5204000053039865406${(Math.random() * 100).toFixed(2)}5802BR6009SAO PAULO62070503***6304`;
    
    try {
        // Gerar QR Code
        const qrCodeBuffer = await qrcode.toBuffer(pixCode);
        
        const paymentEmbed = {
            title: '💰 Pagamento Gerado',
            description: `**Código PIX Copia e Cola:**\n\`\`\`${pixCode}\`\`\`\n\nApós realizar o pagamento, clique em "Validar Pagamento"`,
            color: 0x0099ff,
            image: { url: 'attachment://qrcode.png' }
        };
        
        const paymentButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('validatepay')
                    .setLabel('✅ Validar Pagamento')
                    .setStyle(ButtonStyle.Success)
            );
        
        await interaction.reply({ 
            embeds: [paymentEmbed], 
            components: [paymentButtons],
            files: [{ attachment: qrCodeBuffer, name: 'qrcode.png' }]
        });
        
    } catch (error) {
        console.error('Erro ao gerar pagamento:', error);
        await interaction.reply({ content: '❌ Erro ao gerar pagamento!', ephemeral: true });
    }
}

// Função para validar pagamento
async function handleValidatePayment(interaction) {
    // Simulação de validação (em produção, integrar com API real)
    const isValid = Math.random() > 0.3; // 70% de chance de sucesso
    
    if (isValid) {
        try {
            const userId = interaction.user.id;
            const cart = await cartDB.getByUserId(userId);
            
            if (cart) {
                const products = JSON.parse(cart.products);
                
                // Enviar produtos por DM
                const dmEmbed = {
                    title: '✅ Compra Aprovada!',
                    description: 'Seus produtos foram liberados:\n' + products.map(p => `• Produto ID: ${p.id}`).join('\n'),
                    color: 0x00ff00
                };
                
                await interaction.user.send({ embeds: [dmEmbed] });
                
                // Dar cargos (se configurado)
                // Limpar carrinho
                await cartDB.delete(userId);
                
                // Fechar canal
                await interaction.channel.delete();
            }
            
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            await interaction.reply({ content: '❌ Erro ao processar pagamento!', ephemeral: true });
        }
    } else {
        await interaction.reply({ content: '❌ Pagamento não encontrado. Tente novamente.', ephemeral: true });
    }
}

// Função para cancelar carrinho
async function handleCancelCart(interaction) {
    try {
        const userId = interaction.user.id;
        await cartDB.delete(userId);
        await interaction.channel.delete();
    } catch (error) {
        console.error('Erro ao cancelar carrinho:', error);
    }
}

// Função para abrir ticket
async function handleOpenTicket(interaction) {
    try {
        const guild = interaction.guild;
        const userId = interaction.user.id;
        
        // Criar canal de ticket
        const ticketChannel = await guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: userId,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                },
                {
                    id: process.env.SUPPORT_ROLE_ID,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                },
            ],
        });
        
        const ticketEmbed = {
            title: '🎫 Ticket Aberto',
            description: `Olá ${interaction.user}!\n\nDescreva seu problema que nossa equipe irá te ajudar.`,
            color: 0x0099ff
        };
        
        const ticketButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('closeticket')
                    .setLabel('🔒 Fechar Ticket')
                    .setStyle(ButtonStyle.Danger)
            );
        
        await ticketChannel.send({ embeds: [ticketEmbed], components: [ticketButtons] });
        
        await interaction.reply({ 
            content: `✅ Ticket criado! Vá para ${ticketChannel}`, 
            ephemeral: true 
        });
        
    } catch (error) {
        console.error('Erro ao abrir ticket:', error);
        await interaction.reply({ content: '❌ Erro ao abrir ticket!', ephemeral: true });
    }
}

// Função para fechar ticket
async function handleCloseTicket(interaction) {
    await interaction.reply('🔒 Ticket será fechado em 5 segundos...');
    
    setTimeout(async () => {
        try {
            await interaction.channel.delete();
        } catch (error) {
            console.error('Erro ao fechar ticket:', error);
        }
    }, 5000);
}

// Função para lidar com modal de produto
async function handleProductModal(interaction) {
    const name = interaction.fields.getTextInputValue('product_name');
    const price = parseFloat(interaction.fields.getTextInputValue('product_price'));
    const description = interaction.fields.getTextInputValue('product_description');
    const stock = parseInt(interaction.fields.getTextInputValue('product_stock'));
    const roleId = interaction.fields.getTextInputValue('product_role') || null;
    
    try {
        const productId = await productDB.create({
            name,
            price,
            description,
            stock,
            role_id: roleId,
            thumbnail: null
        });
        
        await interaction.reply({ 
            content: `✅ Produto "${name}" criado com ID: ${productId}`, 
            ephemeral: true 
        });
        
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        await interaction.reply({ content: '❌ Erro ao criar produto!', ephemeral: true });
    }
}
