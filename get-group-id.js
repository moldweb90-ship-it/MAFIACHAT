// Временный скрипт для получения ID группы клиентов
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Пробуем получить токен из .env или используем дефолтный
const BOT_TOKEN = process.env.BOT_TOKEN || '8266109869:AAGrCaaptlP-zVLDhULXT2btDCJEJE7PR1c';

if (!BOT_TOKEN) {
    console.error('❌ BOT_TOKEN не найден');
    process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: false });

async function getGroupId() {
    try {
        // Способ 1: Получить ID по username группы
        const username = 'flowersmafiann'; // без @
        console.log(`🔍 Пытаюсь получить информацию о группе @${username}...`);
        
        try {
            const chat = await bot.getChat(`@${username}`);
            console.log('\n✅ Информация о группе:');
            console.log('📋 Название:', chat.title);
            console.log('🆔 ID группы:', chat.id);
            console.log('📝 Тип:', chat.type);
            console.log('\n💡 Добавьте в Vercel переменную окружения:');
            console.log(`   CLIENT_GROUP_ID = ${chat.id}`);
            return chat.id;
        } catch (error) {
            console.log('❌ Не удалось получить по username:', error.message);
        }
        
        // Способ 2: Получить через обновления (если бот получал сообщения из группы)
        console.log('\n🔍 Пытаюсь получить ID через последние обновления...');
        const updates = await bot.getUpdates({ limit: 100 });
        
        const groups = updates
            .map(u => u.message || u.channel_post)
            .filter(m => m && (m.chat.type === 'group' || m.chat.type === 'supergroup'))
            .map(m => ({
                id: m.chat.id,
                title: m.chat.title,
                username: m.chat.username
            }));
        
        if (groups.length > 0) {
            console.log('\n📋 Найденные группы:');
            groups.forEach((g, i) => {
                console.log(`\n${i + 1}. ${g.title || 'Без названия'}`);
                console.log(`   ID: ${g.id}`);
                console.log(`   Username: ${g.username || 'нет'}`);
            });
            
            // Ищем группу с нужным username
            const targetGroup = groups.find(g => g.username === username);
            if (targetGroup) {
                console.log('\n✅ Найдена целевая группа!');
                console.log(`🆔 ID группы: ${targetGroup.id}`);
                console.log('\n💡 Добавьте в Vercel переменную окружения:');
                console.log(`   CLIENT_GROUP_ID = ${targetGroup.id}`);
                return targetGroup.id;
            }
        }
        
        console.log('\n⚠️ Не удалось автоматически определить ID группы.');
        console.log('\n📝 Инструкция для ручного получения:');
        console.log('1. Отправьте любое сообщение в группу https://t.me/+6sQdMez_ZYZmMDdi');
        console.log('2. Запустите этот скрипт снова');
        console.log('3. Или добавьте бота в группу и отправьте /start в группе');
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        console.error(error);
    }
    
    process.exit(0);
}

getGroupId();

