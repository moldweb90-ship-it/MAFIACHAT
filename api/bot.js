// Vercel Serverless Function for Telegram Bot
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const GROUP_ID = -1003691437577;

// Для Vercel используем вебхуки вместо polling
let bot;

if (BOT_TOKEN) {
    bot = new TelegramBot(BOT_TOKEN);
}

module.exports = async (req, res) => {
    // Разрешаем только POST запросы
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!bot) {
        return res.status(500).json({ error: 'Bot token not configured' });
    }

    try {
        const update = req.body;

        // Обработка команды /start
        if (update.message && update.message.text === '/start') {
            const chatId = update.message.chat.id;
            const userName = update.message.from.first_name;
            
            await bot.sendMessage(chatId, 
                `🌹 Добро пожаловать в Цветочную Мафию, ${userName}!\n\n` +
                `Я передам ваше сообщение менеджерам, и они ответят в течение минуты.\n\n` +
                `Просто напишите ваш вопрос или используйте команды:\n` +
                `/help - помощь\n` +
                `/delivery - информация о доставке\n` +
                `/prices - цены на букеты\n` +
                `/pickup - самовывоз (скидка 600₽)\n` +
                `/order - оформить заказ\n` +
                `/contact - связаться с менеджером\n\n` +
                `💬 Напишите ваш вопрос, и мы поможем!`
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

        // Обработка текстовых сообщений (не команды)
        if (update.message && update.message.text && !update.message.text.startsWith('/')) {
            const chatId = update.message.chat.id;
            const userId = update.message.from.id;
            const userName = update.message.from.first_name + (update.message.from.last_name ? ' ' + update.message.from.last_name : '');
            const username = update.message.from.username ? '@' + update.message.from.username : 'без username';
            const text = update.message.text;

            const messageToGroup = 
                `📩 Новое сообщение от клиента:\n\n` +
                `👤 Имя: ${userName}\n` +
                `🆔 ID: ${userId}\n` +
                `📱 Username: ${username}\n\n` +
                `💬 Сообщение:\n${text}\n\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `💬 Ответить: /send_${userId} ваш ответ`;

            await bot.sendMessage(GROUP_ID, messageToGroup);
            await bot.sendMessage(chatId, 
                '✅ Ваше сообщение отправлено менеджерам!\n\n' +
                'Мы ответим в течение минуты. ⏱️'
            );
        }

        // Обработка фото
        if (update.message && update.message.photo) {
            const chatId = update.message.chat.id;
            const userId = update.message.from.id;
            const userName = update.message.from.first_name + (update.message.from.last_name ? ' ' + update.message.from.last_name : '');
            const username = update.message.from.username ? '@' + update.message.from.username : 'без username';
            const photoId = update.message.photo[update.message.photo.length - 1].file_id;
            const caption = update.message.caption || '';

            await bot.sendPhoto(GROUP_ID, photoId, {
                caption: `📷 Фото от ${userName} (${username})\n` +
                         `ID: ${userId}\n\n` +
                         (caption ? `Подпись: ${caption}` : '')
            });
            await bot.sendMessage(chatId, '✅ Фото отправлено менеджерам!');
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

