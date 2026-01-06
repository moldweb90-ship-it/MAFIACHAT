// Простой тест бота
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = '8266109869:AAGrCaaptlP-zVLDhULXT2btDCJEJE7PR1c';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('🤖 Тестовый бот запущен!');

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    console.log('Получено сообщение:', text, 'от', msg.from.first_name);
    
    if (text === '/test') {
        bot.sendMessage(chatId, '✅ Бот работает! Тест успешен!');
    } else {
        bot.sendMessage(chatId, `Вы написали: ${text}`);
    }
});

bot.on('polling_error', (error) => {
    console.error('Ошибка polling:', error);
});

