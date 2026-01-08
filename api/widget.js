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
        
        // Создаем контейнер для виджета
        const isMobile = window.innerWidth <= 768;
        const bottomOffset = isMobile ? '5px' : '16px';
        const rightOffset = isMobile ? '5px' : '16px';
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'mafia-chat-widget-wrapper';
        // Минимальный размер для кнопки, но overflow: visible чтобы баббл был виден
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
        
        // Загружаем виджет через iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'mafia-chat-iframe';
        iframe.src = WIDGET_URL + '?widget=true';
        // Минимальный размер для кнопки, баббл будет виден через overflow: visible контейнера
        iframe.style.cssText = 'border: none; background: transparent; position: absolute; bottom: 0; right: 0; width: 80px; height: 80px; pointer-events: auto !important; z-index: 999999 !important;';
        iframe.allow = 'microphone';
        iframe.scrolling = 'no';
        iframe.frameBorder = '0';
        iframe.setAttribute('allowtransparency', 'true');
        
        widgetContainer.appendChild(iframe);
        
        // Состояние чата и баббла
        let chatIsOpen = false;
        let bubbleIsVisible = false;
        
        // Слушаем сообщения от iframe через postMessage
        window.addEventListener('message', function(event) {
            // Проверяем origin для безопасности
            if (event.origin !== WIDGET_URL) {
                return;
            }
            
            if (event.data && event.data.type === 'chat-toggle') {
                updateContainerSize(event.data.isOpen);
            }
            
            // Обрабатываем события показа/скрытия баббла
            if (event.data && event.data.type === 'bubble-visibility') {
                updateBubbleSize(event.data.isVisible);
            }
        });
        
        // Функция обновления размера для баббла
        function updateBubbleSize(isVisible) {
            bubbleIsVisible = isVisible;
            if (isVisible) {
                // Баббл виден - увеличиваем iframe чтобы он не обрезался
                // Баббл находится на bottom: 80px от кнопки, нужна высота ~280px
                // Но только если чат закрыт (если чат открыт, размер уже большой)
                if (!chatIsOpen) {
                    widgetContainer.style.width = '320px';
                    widgetContainer.style.height = '300px';
                    iframe.style.width = '320px';
                    iframe.style.height = '300px';
                }
            } else {
                // Баббл скрыт - уменьшаем до минимума (только если чат закрыт)
                if (!chatIsOpen) {
                    widgetContainer.style.width = '80px';
                    widgetContainer.style.height = '80px';
                    iframe.style.width = '80px';
                    iframe.style.height = '80px';
                }
            }
        }
        
        // Функция обновления размера контейнера
        function updateContainerSize(isChatOpen) {
            chatIsOpen = isChatOpen;
            if (isChatOpen) {
                widgetContainer.style.width = '400px';
                widgetContainer.style.height = '700px';
                iframe.style.width = '400px';
                iframe.style.height = '700px';
            } else {
                // Чат закрыт - проверяем состояние баббла
                if (bubbleIsVisible) {
                    // Баббл виден - оставляем размер для баббла
                    widgetContainer.style.width = '320px';
                    widgetContainer.style.height = '300px';
                    iframe.style.width = '320px';
                    iframe.style.height = '300px';
                } else {
                    // Баббл скрыт - уменьшаем до минимума
                    widgetContainer.style.width = '80px';
                    widgetContainer.style.height = '80px';
                    iframe.style.width = '80px';
                    iframe.style.height = '80px';
                }
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
