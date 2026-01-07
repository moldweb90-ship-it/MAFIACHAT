# 📱 Установка чата на Joomla

## Шаг 1: URL проекта на Vercel

URL проекта: `https://mafiachat-sx8l.vercel.app`

## Шаг 2: Откройте настройки шаблона Joomla

1. Войдите в админ-панель Joomla
2. Перейдите в **Расширения → Шаблоны**
3. Выберите ваш активный шаблон
4. Нажмите на название шаблона для редактирования

## Шаг 3: Добавьте скрипт в "After <head>"

1. Найдите поле **"After <head>"** (или **"Перед </head>"**)
2. Скопируйте код из файла `joomla-widget-loader.js`
3. **ВАЖНО**: Замените `https://ваш-проект.vercel.app` на ваш реальный URL Vercel
4. Вставьте код в поле "After <head>"
5. Сохраните изменения

## Пример кода для вставки:

```html
<script>
(function() {
    'use strict';
    
    // ⚙️ КОНФИГУРАЦИЯ
    const WIDGET_URL = 'https://mafiachat-sx8l.vercel.app';
    
    // Проверка, что скрипт еще не загружен
    if (window.mafiaChatWidgetLoaded) {
        return;
    }
    window.mafiaChatWidgetLoaded = true;
    
    // Создаем контейнер для виджета
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'mafia-chat-widget-wrapper';
    widgetContainer.style.cssText = 'position: fixed; bottom: 0; right: 0; z-index: 99999; pointer-events: none; width: 0; height: 0; overflow: visible;';
    document.body.appendChild(widgetContainer);
    
    // Загружаем виджет через iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'mafia-chat-iframe';
    iframe.src = WIDGET_URL + '?widget=true';
    iframe.style.cssText = 'border: none; background: transparent; position: absolute; bottom: 0; right: 0; width: 400px; height: 700px;';
    iframe.allow = 'microphone';
    iframe.scrolling = 'no';
    iframe.frameBorder = '0';
    
    // Адаптивные размеры
    function updateIframeSize() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            iframe.style.width = '100vw';
            iframe.style.height = '100vh';
            iframe.style.position = 'fixed';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.bottom = 'auto';
            iframe.style.right = 'auto';
        } else {
            iframe.style.width = '400px';
            iframe.style.height = '700px';
            iframe.style.position = 'absolute';
            iframe.style.top = 'auto';
            iframe.style.left = 'auto';
            iframe.style.bottom = '0';
            iframe.style.right = '0';
        }
    }
    
    updateIframeSize();
    window.addEventListener('resize', updateIframeSize);
    
    widgetContainer.appendChild(iframe);
    
    // После загрузки iframe пытаемся убрать белый фон
    iframe.onload = function() {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            
            if (iframeDoc.body) {
                iframeDoc.body.style.background = 'transparent';
                iframeDoc.body.style.backgroundColor = 'transparent';
                iframeDoc.body.setAttribute('data-widget-mode', 'true');
            }
            if (iframeDoc.documentElement) {
                iframeDoc.documentElement.style.background = 'transparent';
                iframeDoc.documentElement.style.backgroundColor = 'transparent';
            }
            
            const style = iframeDoc.createElement('style');
            style.textContent = `
                body, html { background: transparent !important; background-color: transparent !important; }
                body[data-widget-mode="true"] { background: transparent !important; }
            `;
            iframeDoc.head.appendChild(style);
            
        } catch (e) {
            console.log('Виджет чата загружен (ограниченный доступ к iframe из-за CORS)');
        }
    };
    
    iframe.onerror = function() {
        console.error('Ошибка загрузки виджета чата. Проверьте URL:', WIDGET_URL);
    };
    
})();
</script>
```

## Шаг 4: Проверка работы

1. Откройте ваш сайт в браузере
2. В правом нижнем углу должен появиться синий круглый значок чата
3. Нажмите на него - должен открыться чат
4. Чат должен работать точно так же, как на локальной версии

## ⚠️ Важные замечания

1. **URL Vercel**: `https://mafiachat-sx8l.vercel.app` (уже настроен в скрипте)
2. **Z-index**: Виджет имеет z-index: 99999, чтобы быть поверх всех элементов
3. **Мобильные устройства**: На мобильных чат открывается в полноэкранном режиме
4. **Прозрачный фон**: Скрипт автоматически убирает белый фон у виджета

## 🔧 Решение проблем

### Чат не появляется
- Проверьте, что URL Vercel правильный
- Откройте консоль браузера (F12) и проверьте ошибки
- Убедитесь, что сайт на Vercel доступен

### Белый фон у чата
- Это нормально, если CORS блокирует доступ к iframe
- Виджет все равно будет работать
- Можно попробовать добавить в `vercel.json` дополнительные CORS заголовки

### Чат перекрывает элементы сайта
- Измените z-index в скрипте (по умолчанию 99999)
- Или измените позицию виджета (bottom/right)

## 📝 Дополнительная настройка

Если нужно изменить позицию виджета, измените в скрипте:
```javascript
widgetContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 99999; ...';
```

Если нужно изменить размер на десктопе:
```javascript
iframe.style.width = '380px';  // вместо 400px
iframe.style.height = '620px';  // вместо 700px
```

