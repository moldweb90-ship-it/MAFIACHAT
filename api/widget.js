module.exports = (req, res) => {
    // Устанавливаем правильные заголовки для JavaScript
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Возвращаем JavaScript код
    const widgetCode = `(function() {
    'use strict';
    
    console.log('[MAFIA CHAT] Скрипт начал загрузку');
    
    // URL виджета
    const WIDGET_URL = 'https://mafiachat-sx8l.vercel.app';
    
    // Проверка, что скрипт еще не загружен
    if (window.mafiaChatWidgetLoaded) {
        console.log('[MAFIA CHAT] Скрипт уже загружен, выходим');
        return;
    }
    window.mafiaChatWidgetLoaded = true;
    console.log('[MAFIA CHAT] Скрипт помечен как загружен');
    
    // Функция инициализации виджета
    function initWidget() {
        console.log('[MAFIA CHAT] initWidget вызван');
        
        // Проверяем наличие body
        if (!document.body) {
            console.log('[MAFIA CHAT] body еще не готов, ждем...');
            setTimeout(initWidget, 50);
            return;
        }
        console.log('[MAFIA CHAT] body найден');
        
        // Проверяем, что контейнер еще не создан
        if (document.getElementById('mafia-chat-widget-wrapper')) {
            console.log('[MAFIA CHAT] Контейнер уже существует, выходим');
            return;
        }
        
        console.log('[MAFIA CHAT] Создаем контейнер');
        // Создаем контейнер для виджета
        const isMobile = window.innerWidth <= 768;
        const bottomOffset = isMobile ? '5px' : '16px';
        const rightOffset = isMobile ? '5px' : '16px';
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'mafia-chat-widget-wrapper';
        widgetContainer.style.cssText = 'position: fixed; bottom: ' + bottomOffset + '; right: ' + rightOffset + '; z-index: 999999 !important; pointer-events: none; width: 400px; height: 700px; overflow: visible;';
        document.body.appendChild(widgetContainer);
        console.log('[MAFIA CHAT] Контейнер создан и добавлен в DOM');
        
        // Обновляем отступы при изменении размера окна
        window.addEventListener('resize', function() {
            const isMobileNow = window.innerWidth <= 768;
            const newBottom = isMobileNow ? '5px' : '16px';
            const newRight = isMobileNow ? '5px' : '16px';
            widgetContainer.style.bottom = newBottom;
            widgetContainer.style.right = newRight;
        });
        
        console.log('[MAFIA CHAT] Создаем iframe');
        // Загружаем виджет через iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'mafia-chat-iframe';
        iframe.src = WIDGET_URL + '?widget=true';
        iframe.style.cssText = 'border: none; background: transparent; position: absolute; bottom: 0; right: 0; width: 400px; height: 700px; pointer-events: auto !important; z-index: 999999 !important;';
        iframe.allow = 'microphone';
        iframe.scrolling = 'no';
        iframe.frameBorder = '0';
        iframe.setAttribute('allowtransparency', 'true');
        console.log('[MAFIA CHAT] Iframe создан, src:', iframe.src);
        
        widgetContainer.appendChild(iframe);
        console.log('[MAFIA CHAT] Iframe добавлен в контейнер');
        
        // Слушаем сообщения от iframe через postMessage
        window.addEventListener('message', function(event) {
            // Проверяем origin для безопасности
            if (event.origin !== WIDGET_URL) {
                return;
            }
            
            console.log('[MAFIA CHAT] Получено сообщение от iframe:', event.data);
            
            if (event.data && event.data.type === 'chat-toggle') {
                const isOpen = event.data.isOpen;
                console.log('[MAFIA CHAT] Чат переключен, открыт:', isOpen);
                
                if (isOpen) {
                    widgetContainer.style.width = '400px';
                    widgetContainer.style.height = '700px';
                    iframe.style.width = '400px';
                    iframe.style.height = '700px';
                } else {
                    widgetContainer.style.width = '80px';
                    widgetContainer.style.height = '80px';
                    iframe.style.width = '80px';
                    iframe.style.height = '80px';
                }
            }
        });
        
        iframe.onload = function() {
            console.log('[MAFIA CHAT] Iframe загружен успешно');
        };
        
        iframe.onerror = function() {
            console.error('[MAFIA CHAT] Ошибка загрузки iframe');
        };
        
        console.log('[MAFIA CHAT] Инициализация завершена');
    }
    
    // Запускаем инициализацию
    console.log('[MAFIA CHAT] Проверяем readyState:', document.readyState);
    if (document.readyState === 'loading') {
        console.log('[MAFIA CHAT] DOM еще загружается, ждем DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', function() {
            console.log('[MAFIA CHAT] DOMContentLoaded сработал');
            initWidget();
        });
    } else {
        console.log('[MAFIA CHAT] DOM уже готов, запускаем сразу');
        initWidget();
    }
    
    console.log('[MAFIA CHAT] Скрипт завершен');
})();`;
    
    res.status(200).send(widgetCode);
};
