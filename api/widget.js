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
    
    // URL виджета
    const WIDGET_URL = 'https://mafiachat-sx8l.vercel.app';
    
    // Проверка, что скрипт еще не загружен
    if (window.mafiaChatWidgetLoaded) {
        return;
    }
    window.mafiaChatWidgetLoaded = true;
    
    // Функция инициализации виджета
    function initWidget() {
        // Проверяем наличие body
        if (!document.body) {
            setTimeout(initWidget, 50);
            return;
        }
        
        // Проверяем, что контейнер еще не создан
        if (document.getElementById('mafia-chat-widget-wrapper')) {
            return;
        }
        
        // Создаем контейнер для виджета (минимальный размер для кнопки)
        const isMobile = window.innerWidth <= 768;
        const bottomOffset = isMobile ? '5px' : '16px';
        const rightOffset = isMobile ? '5px' : '16px';
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'mafia-chat-widget-wrapper';
        // Начальный размер только для кнопки (80x80px), чтобы не блокировать клики на сайте
        widgetContainer.style.cssText = 'position: fixed; bottom: ' + bottomOffset + '; right: ' + rightOffset + '; z-index: 999999 !important; pointer-events: none; width: 80px; height: 80px; overflow: visible;';
        document.body.appendChild(widgetContainer);
        
        // Обновляем отступы при изменении размера окна
        window.addEventListener('resize', function() {
            const isMobileNow = window.innerWidth <= 768;
            const newBottom = isMobileNow ? '5px' : '16px';
            const newRight = isMobileNow ? '5px' : '16px';
            widgetContainer.style.bottom = newBottom;
            widgetContainer.style.right = newRight;
        });
        
        // Загружаем виджет через iframe (начальный размер только для кнопки)
        const iframe = document.createElement('iframe');
        iframe.id = 'mafia-chat-iframe';
        iframe.src = WIDGET_URL + '?widget=true';
        // Начальный размер только для кнопки, чтобы не блокировать клики на сайте
        iframe.style.cssText = 'border: none; background: transparent; position: absolute; bottom: 0; right: 0; width: 80px; height: 80px; pointer-events: auto !important; z-index: 999999 !important;';
        iframe.allow = 'microphone';
        iframe.scrolling = 'no';
        iframe.frameBorder = '0';
        iframe.setAttribute('allowtransparency', 'true');
        
        widgetContainer.appendChild(iframe);
        
        // Слушаем сообщения от iframe через postMessage
        window.addEventListener('message', function(event) {
            // Проверяем origin для безопасности
            if (event.origin !== WIDGET_URL) {
                return;
            }
            
            if (event.data && event.data.type === 'chat-toggle') {
                updateContainerSize(event.data.isOpen);
            }
        });
        
        // Функция обновления размера контейнера
        function updateContainerSize(isOpen) {
            if (isOpen) {
                widgetContainer.style.width = '400px';
                widgetContainer.style.height = '700px';
                iframe.style.width = '400px';
                iframe.style.height = '700px';
            } else {
                // Чат закрыт - минимальный размер только для кнопки
                widgetContainer.style.width = '80px';
                widgetContainer.style.height = '80px';
                iframe.style.width = '80px';
                iframe.style.height = '80px';
            }
        }
        
        // Периодически проверяем состояние чата и принудительно обновляем размер
        setInterval(function() {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const chatWindow = iframeDoc.getElementById('chat-window');
                if (chatWindow) {
                    const isOpen = !chatWindow.classList.contains('hidden');
                    const currentWidth = parseInt(widgetContainer.style.width) || 80;
                    
                    // Если чат закрыт, но размер большой - принудительно исправляем
                    if (!isOpen && currentWidth > 100) {
                        updateContainerSize(false);
                    }
                    // Если чат открыт, но размер маленький - принудительно исправляем
                    if (isOpen && currentWidth < 300) {
                        updateContainerSize(true);
                    }
                }
            } catch (e) {
                // CORS блокирует - это нормально, используем postMessage
            }
        }, 300);
        
        iframe.onerror = function() {
            console.error('[MAFIA CHAT] Ошибка загрузки iframe');
        };
    }
    
    // Запускаем инициализацию
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
})();`;
    
    res.status(200).send(widgetCode);
};
