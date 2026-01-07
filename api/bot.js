// Vercel Serverless Function for Telegram Bot (WEBHOOK MODE - 24/7)
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const GROUP_ID = -1003691437577; // Техническая группа для админов
// Публичная группа для клиентов (рассылки, новости, общение)
const CLIENT_GROUP_INVITE_LINK = process.env.CLIENT_GROUP_INVITE_LINK || 'https://t.me/+6sQdMez_ZYZmMDdi';

// Для Vercel используем вебхуки вместо polling
let bot;

if (BOT_TOKEN) {
    bot = new TelegramBot(BOT_TOKEN);
}

// Хранилище связей message_id -> userId (в памяти, для serverless функций)
// В production лучше использовать Redis/KV, но для начала этого достаточно
const messageMap = new Map();

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Обработка OPTIONS для CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Разрешаем только POST запросы
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!bot) {
        return res.status(500).json({ error: 'Bot token not configured' });
    }

    try {
        const update = req.body;
        
        // Логирование для отладки
        console.log('Received update:', JSON.stringify(update, null, 2));

        // Обработка команды /start
        if (update.message && update.message.text === '/start') {
            const chatId = update.message.chat.id;
            const userName = update.message.from.first_name;
            
            await bot.sendMessage(chatId, 
                `🌹 Добро пожаловать в Цветочную Мафию, ${userName}!\n\n` +
                `Я передам ваше сообщение менеджерам, и они ответят в течение минуты.\n\n` +
                `💬 Присоединяйтесь к нашему чату, где:\n` +
                `• Актуальные новости и акции\n` +
                `• Общение с другими клиентами\n` +
                `• Быстрые ответы от менеджеров\n\n` +
                `Просто напишите ваш вопрос или используйте команды:\n` +
                `/help - помощь\n` +
                `/delivery - информация о доставке\n` +
                `/prices - цены на букеты\n` +
                `/pickup - самовывоз (скидка 600₽)\n` +
                `/order - оформить заказ\n` +
                `/contact - связаться с менеджером\n\n` +
                `💬 Напишите ваш вопрос, и мы поможем!`,
                {
                    reply_markup: {
                        inline_keyboard: [[
                            { text: '💬 Присоединиться к чату', url: CLIENT_GROUP_INVITE_LINK }
                        ]]
                    }
                }
            );
        }

        // Обработка команды /help
        if (update.message && update.message.text === '/help') {
            const chatId = update.message.chat.id;
            await bot.sendMessage(chatId,
                `📋 Доступные команды:\n\n` +
                `/delivery - Узнать о доставке\n` +
                `/prices - Цены на букеты\n` +
                `/pickup - Самовывоз со скидкой\n` +
                `/order - Оформить заказ\n` +
                `/contact - Связаться с менеджером\n` +
                `/status - Статус заказа\n\n` +
                `Или просто напишите ваш вопрос!`
            );
        }

        // Обработка команды /delivery
        if (update.message && update.message.text === '/delivery') {
            const chatId = update.message.chat.id;
            await bot.sendMessage(chatId,
                `🚚 Информация о доставке:\n\n` +
                `По основным районам НН - БЕСПЛАТНО! (с 8:00 до 21:00)\n` +
                `Самовывоз - скидка 600₽\n\n` +
                `Для уточнения деталей напишите адрес доставки.`
            );
        }

        // Обработка команды /prices
        if (update.message && update.message.text === '/prices') {
            const chatId = update.message.chat.id;
            await bot.sendMessage(chatId,
                `💸 Цены на букеты:\n\n` +
                `У нас большой выбор букетов от 1000₽\n` +
                `Точные цены зависят от состава и размера.\n\n` +
                `Напишите, какой букет вас интересует, и мы подберем вариант!`
            );
        }

        // Обработка команды /pickup
        if (update.message && update.message.text === '/pickup') {
            const chatId = update.message.chat.id;
            await bot.sendMessage(chatId,
                `🏃 Самовывоз со скидкой 600₽!\n\n` +
                `📍 Адреса:\n` +
                `• Бульвар Мещерский 3к3 (круглосуточно)\n` +
                `• Пр-т Героев Донбасса, 6 (с 9 до 21)\n\n` +
                `При самовывозе экономите 600₽ на любом букете!`
            );
        }

        // Обработка команды /order
        if (update.message && update.message.text === '/order') {
            const chatId = update.message.chat.id;
            await bot.sendMessage(chatId,
                `📦 Оформление заказа:\n\n` +
                `Для оформления заказа напишите:\n` +
                `• Какой букет вас интересует\n` +
                `• Адрес доставки (или самовывоз)\n` +
                `• Желаемое время доставки\n\n` +
                `Менеджер свяжется с вами для подтверждения!`
            );
        }

        // Обработка команды /contact
        if (update.message && update.message.text === '/contact') {
            const chatId = update.message.chat.id;
            await bot.sendMessage(chatId,
                `📞 Связь с менеджером:\n\n` +
                `Телефон: 8 (953) 573-69-06\n\n` +
                `Или просто напишите ваш вопрос здесь, и менеджер ответит!`
            );
        }

        // Обработка команды /status
        if (update.message && update.message.text === '/status') {
            const chatId = update.message.chat.id;
            await bot.sendMessage(chatId,
                `📋 Статус заказа:\n\n` +
                `Для проверки статуса заказа напишите номер заказа или ваш телефон.\n\n` +
                `Менеджер проверит и сообщит актуальный статус.`
            );
        }

        // ПРИОРИТЕТ 1: Обработка ответов менеджеров через REPLY в группе
        if (update.message && update.message.chat.id === GROUP_ID && update.message.reply_to_message) {
            const repliedMessageId = update.message.reply_to_message.message_id;
            const text = update.message.text;
            
            // Пытаемся найти userId из messageMap
            let targetUserId = messageMap.get(repliedMessageId);
            
            // Если не нашли в map, пытаемся извлечь из текста сообщения (ID: 123456789)
            if (!targetUserId && update.message.reply_to_message.text) {
                const idMatch = update.message.reply_to_message.text.match(/🆔 ID: (\d+)/);
                if (idMatch) {
                    targetUserId = parseInt(idMatch[1]);
                }
            }
            
            if (targetUserId && text && !text.startsWith('/')) {
                const managerName = update.message.from.first_name + (update.message.from.last_name ? ' ' + update.message.from.last_name : '');
                
                try {
                    await bot.sendMessage(targetUserId, 
                        `💬 Ответ от менеджера:\n\n${text}\n\n` +
                        `━━━━━━━━━━━━━━━━\n` +
                        `Цветочная Мафия 🌹`
                    );
                    
                    await bot.sendMessage(GROUP_ID, 
                        `✅ Ответ отправлен клиенту\n` +
                        `Менеджер: ${managerName}`,
                        { reply_to_message_id: update.message.message_id }
                    );
                } catch (err) {
                    console.error('Ошибка отправки клиенту:', err);
                    await bot.sendMessage(GROUP_ID, 
                        `❌ Ошибка отправки клиенту ${targetUserId}.\n` +
                        `Ошибка: ${err.message || 'Неизвестная ошибка'}\n` +
                        `Возможно, клиент заблокировал бота.`,
                        { reply_to_message_id: update.message.message_id }
                    );
                }
                
                res.status(200).json({ ok: true });
                return;
            }
        }

        // Пропускаем сообщения из группы (кроме команд и reply)
        if (update.message && update.message.chat.id === GROUP_ID) {
            res.status(200).json({ ok: true });
            return;
        }

        // Обработка текстовых сообщений от клиентов (не команды)
        if (update.message && update.message.text && !update.message.text.startsWith('/')) {
            const chatId = update.message.chat.id;
            const userId = update.message.from.id;
            const userName = update.message.from.first_name + (update.message.from.last_name ? ' ' + update.message.from.last_name : '');
            const username = update.message.from.username ? '@' + update.message.from.username : 'без username';
            const text = update.message.text;

            // Пропускаем сообщения из группы
            if (chatId === GROUP_ID) {
                res.status(200).json({ ok: true });
                return;
            }

            const messageToGroup = 
                `📩 Новое сообщение от клиента:\n\n` +
                `👤 Имя: ${userName}\n` +
                `🆔 ID: ${userId}\n` +
                `📱 Username: ${username}\n\n` +
                `💬 Сообщение:\n${text}\n\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `💬 Ответьте на это сообщение, чтобы ответить клиенту`;

            try {
                console.log(`Отправка сообщения в группу ${GROUP_ID} от пользователя ${userId}`);
                const sentMessage = await bot.sendMessage(GROUP_ID, messageToGroup);
                console.log(`Сообщение успешно отправлено в группу, message_id: ${sentMessage.message_id}`);
                
                // Сохраняем связь message_id -> userId
                messageMap.set(sentMessage.message_id, userId);
                
                // Очищаем старые записи (оставляем только последние 1000)
                if (messageMap.size > 1000) {
                    const entries = Array.from(messageMap.entries());
                    messageMap.clear();
                    entries.slice(-500).forEach(([k, v]) => messageMap.set(k, v));
                }
                
                // Отправляем подтверждение клиенту + приглашение в группу
                const confirmationMessage = 
                    '✅ Ваше сообщение отправлено менеджерам!\n\n' +
                    'Мы ответим в течение минуты. ⏱️\n\n' +
                    '💬 Присоединяйтесь к нашему чату, чтобы:\n' +
                    '• Получать актуальные новости и акции\n' +
                    '• Общаться с другими клиентами\n' +
                    '• Быстрее получать ответы от менеджеров';
                
                await bot.sendMessage(chatId, confirmationMessage, {
                    reply_markup: {
                        inline_keyboard: [[
                            { text: '💬 Присоединиться к чату', url: CLIENT_GROUP_INVITE_LINK }
                        ]]
                    }
                });
            } catch (error) {
                console.error('Ошибка отправки в группу:', error);
                console.error('Детали ошибки:', error.response?.body || error.message);
                // Отправляем клиенту сообщение об ошибке
                try {
                    await bot.sendMessage(chatId, 
                        '❌ Произошла ошибка при отправке сообщения. Попробуйте позже или свяжитесь с нами по телефону: 8 (953) 573-69-06'
                    );
                } catch (e) {
                    console.error('Ошибка отправки клиенту:', e);
                }
            }
        }

        // Обработка фото
        if (update.message && update.message.photo) {
            const chatId = update.message.chat.id;
            
            // Пропускаем фото из группы
            if (chatId === GROUP_ID) {
                res.status(200).json({ ok: true });
                return;
            }
            
            const userId = update.message.from.id;
            const userName = update.message.from.first_name + (update.message.from.last_name ? ' ' + update.message.from.last_name : '');
            const username = update.message.from.username ? '@' + update.message.from.username : 'без username';
            const photoId = update.message.photo[update.message.photo.length - 1].file_id;
            const caption = update.message.caption || '';

            try {
                const sentMessage = await bot.sendPhoto(GROUP_ID, photoId, {
                    caption: `📷 Фото от ${userName} (${username})\n` +
                             `ID: ${userId}\n\n` +
                             (caption ? `Подпись: ${caption}` : '') +
                             `\n━━━━━━━━━━━━━━━━━━━━\n` +
                             `💬 Ответьте на это сообщение, чтобы ответить клиенту`
                });
                
                // Сохраняем связь для фото
                messageMap.set(sentMessage.message_id, userId);
                
                await bot.sendMessage(chatId, 
                    '✅ Фото отправлено менеджерам!\n\n' +
                    '💬 Присоединяйтесь к нашему чату для новостей и акций!',
                    {
                        reply_markup: {
                            inline_keyboard: [[
                                { text: '💬 Присоединиться к чату', url: CLIENT_GROUP_INVITE_LINK }
                            ]]
                        }
                    }
                );
            } catch (error) {
                console.error('Ошибка отправки фото в группу:', error);
                try {
                    await bot.sendMessage(chatId, 
                        '❌ Произошла ошибка при отправке фото. Попробуйте позже или свяжитесь с нами по телефону: 8 (953) 573-69-06'
                    );
                } catch (e) {
                    console.error('Ошибка отправки клиенту:', e);
                }
            }
        }

        // Обработка ответов от менеджеров в группе
        if (update.message && update.message.text && update.message.text.startsWith('/send_')) {
            const match = update.message.text.match(/\/send_(\d+)\s+(.+)/);
            if (match && update.message.chat.id === GROUP_ID) {
                const targetUserId = match[1];
                const replyText = match[2];
                const managerName = update.message.from.first_name;

                await bot.sendMessage(targetUserId, 
                    `💬 Ответ от менеджера:\n\n${replyText}\n\n` +
                    `━━━━━━━━━━━━━━━━\n` +
                    `Цветочная Мафия 🌹`
                );
                await bot.sendMessage(GROUP_ID, 
                    `✅ Ответ отправлен клиенту ${targetUserId}\n` +
                    `Менеджер: ${managerName}`
                );
            }
        }

        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Error processing update:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

