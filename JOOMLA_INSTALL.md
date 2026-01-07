# Установка виджета чата в Joomla

## Способ 1: Вставка скрипта в шаблон (Рекомендуется)

1. Откройте админ-панель Joomla
2. Перейдите в **Расширения → Шаблоны → Шаблоны**
3. Выберите ваш активный шаблон
4. Нажмите **"Редактировать"** или **"Настроить"**
5. Найдите раздел **"Дополнительные скрипты"** или **"Custom Code"** в `<head>`
6. Вставьте следующий код:

```html
<script>
(function() {
    if (window.TelegramChatWidgetLoaded) return;
    window.TelegramChatWidgetLoaded = true;
    
    if (!document.querySelector('script[src*="tailwindcss"]')) {
        var tailwind = document.createElement('script');
        tailwind.src = 'https://cdn.tailwindcss.com';
        document.head.appendChild(tailwind);
    }
    
    function loadWidget() {
        if (!document.body) {
            setTimeout(loadWidget, 100);
            return;
        }
        
        if (document.getElementById('telegram-widget-embed')) return;
        
        var container = document.createElement('div');
        container.id = 'telegram-widget-embed';
        container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; width: 380px; height: 620px; max-width: calc(100vw - 40px); max-height: calc(100vh - 40px); z-index: 9999; pointer-events: none;';
        
        var iframe = document.createElement('iframe');
        iframe.id = 'telegram-chat-iframe';
        iframe.src = 'https://chatmafia.vercel.app/';
        iframe.style.cssText = 'width: 100%; height: 100%; border: none; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); pointer-events: none; display: none;';
        iframe.allow = 'microphone';
        iframe.scrolling = 'no';
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowtransparency', 'true');
        
        container.appendChild(iframe);
        document.body.appendChild(container);
        
        iframe.onload = function() {
            setTimeout(function() {
                iframe.style.display = 'block';
                iframe.style.pointerEvents = 'auto';
                container.style.pointerEvents = 'auto';
            }, 500);
        };
        
        window.addEventListener('message', function(e) {
            if (!e.origin.includes('vercel.app') && !e.origin.includes('localhost')) return;
            
            if (e.data && e.data.type === 'telegram-widget-close') {
                container.style.display = 'none';
            }
            if (e.data && e.data.type === 'telegram-widget-open') {
                container.style.display = 'block';
            }
            if (e.data && e.data.type === 'telegram-widget-toggle') {
                if (container.style.display === 'none') {
                    container.style.display = 'block';
                } else {
                    container.style.display = 'none';
                }
            }
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadWidget);
    } else {
        loadWidget();
    }
})();
</script>
```

## Способ 2: Через модуль Custom HTML

1. Перейдите в **Расширения → Модули**
2. Создайте новый модуль **"Custom HTML"**
3. Вставьте тот же скрипт выше
4. Установите позицию модуля: **"В конце страницы"** или **"Before </body>"**
5. Сохраните и опубликуйте модуль

## Способ 3: Подключение внешнего файла

1. Загрузите файл `joomla-widget.js` на ваш сервер
2. В шаблоне в секции `<head>` добавьте:

```html
<script src="/путь/к/joomla-widget.js" async></script>
```

## Важные моменты:

- ✅ Виджет НЕ перекрывает весь сайт (размер 380x620px в углу)
- ✅ Не блокирует взаимодействие с меню и другими элементами
- ✅ Адаптивный: на мобильных устройствах автоматически подстраивается
- ✅ z-index: 9999 - виджет поверх других элементов, но не мешает
- ✅ pointer-events управляется правильно - сайт остается кликабельным

## Настройка позиции (опционально):

Если нужно изменить позицию виджета, измените в скрипте:

```javascript
// Для левого нижнего угла:
container.style.cssText = 'position: fixed; bottom: 20px; left: 20px; ...';

// Для правого верхнего угла:
container.style.cssText = 'position: fixed; top: 20px; right: 20px; ...';
```

## Изменение размера (опционально):

```javascript
// Меньший размер
container.style.cssText = '... width: 320px; height: 500px; ...';

// Больший размер
container.style.cssText = '... width: 450px; height: 700px; ...';
```

