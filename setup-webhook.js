// Скрипт для настройки webhook на Vercel
// Запустите: node setup-webhook.js

const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN || '8266109869:AAGrCaaptlP-zVLDhULXT2btDCJEJE7PR1c';

// ⚠️ ВАЖНО: Замените на ваш Vercel URL!
// После деплоя на Vercel вы получите URL типа: https://your-project.vercel.app
const VERCEL_URL = process.env.VERCEL_URL || 'https://your-project.vercel.app';

const bot = new TelegramBot(BOT_TOKEN);

async function setupWebhook() {
    try {
        console.log('🔧 Настройка webhook...');
        console.log('URL:', `${VERCEL_URL}/api/bot`);
        
        // Удаляем старый webhook (если есть)
        await bot.deleteWebHook();
        console.log('✅ Старый webhook удален');
        
        // Устанавливаем новый webhook
        const result = await bot.setWebHook(`${VERCEL_URL}/api/bot`);
        console.log('✅ Webhook установлен:', result);
        
        // Проверяем статус webhook
        const info = await bot.getWebHookInfo();
        console.log('\n📊 Информация о webhook:');
        console.log('URL:', info.url);
        console.log('Pending updates:', info.pending_update_count);
        console.log('Last error date:', info.last_error_date ? new Date(info.last_error_date * 1000) : 'нет');
        console.log('Last error message:', info.last_error_message || 'нет');
        
        console.log('\n✅ Готово! Бот теперь работает через Vercel 24/7!');
        console.log('⚠️  Убедитесь, что:');
        console.log('   1. Проект задеплоен на Vercel');
        console.log('   2. BOT_TOKEN установлен в переменных окружения Vercel');
        console.log('   3. VERCEL_URL указан правильно');
        
    } catch (error) {
        console.error('❌ Ошибка настройки webhook:', error);
        process.exit(1);
    }
}

setupWebhook();


