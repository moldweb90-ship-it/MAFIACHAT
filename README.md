# Flower Mafia Chat Widget

Telegram-стиль чат-виджет для сайта "Цветочная Мафия".

## Локальный запуск

1. Установите зависимости:
```bash
npm install
```

2. Запустите сервер:
```bash
npm start
```

3. Откройте в браузере: `http://localhost:3000`

## Развертывание на Vercel

1. Загрузите проект на GitHub
2. Подключите репозиторий к Vercel
3. Vercel автоматически определит конфигурацию из `vercel.json`

## Подключение на Joomla сайте

Добавьте в `<head>` вашего шаблона Joomla:

```html
<script src="https://your-vercel-app.vercel.app/index.html" async></script>
```

Или используйте встроенный скрипт (будет создан позже):

```html
<script src="https://your-vercel-app.vercel.app/widget.js" async></script>
```

## Структура проекта

- `index.html` - основной файл виджета
- `server.js` - локальный сервер для разработки
- `vercel.json` - конфигурация для Vercel
- `package.json` - зависимости проекта

