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
        try {
            console.log('[MAFIA CHAT] Инициализация виджета...');
            
            // Проверяем наличие body
            if (!document.body) {
                console.log('[MAFIA CHAT] Body еще не готов, повтор через 50ms');
                setTimeout(initWidget, 50);
                return;
            }
            
            // Проверяем, что контейнер еще не создан
            if (document.getElementById('mafia-chat-widget-wrapper')) {
                console.log('[MAFIA CHAT] Виджет уже инициализирован');
                return;
            }
            
            console.log('[MAFIA CHAT] Создание контейнера...');
        
            // Создаем контейнер для виджета
            const isMobile = window.innerWidth <= 768;
            const bottomOffset = isMobile ? '5px' : '16px';
            const rightOffset = isMobile ? '5px' : '16px';
            console.log('[MAFIA CHAT] isMobile:', isMobile, 'offsets:', bottomOffset, rightOffset);
            
            const widgetContainer = document.createElement('div');
            widgetContainer.id = 'mafia-chat-widget-wrapper';
            // Минимальный размер для кнопки, но overflow: visible чтобы баббл был виден
            widgetContainer.style.cssText = 'position: fixed; bottom: ' + bottomOffset + '; right: ' + rightOffset + '; z-index: 999999 !important; pointer-events: none; width: 80px; height: 80px; overflow: visible;';
            document.body.appendChild(widgetContainer);
            console.log('[MAFIA CHAT] Контейнер создан и добавлен в DOM');
        
            // Обновляем отступы при изменении размера окна
            window.addEventListener('resize', function() {
                try {
                    const isMobileNow = window.innerWidth <= 768;
                    const newBottom = isMobileNow ? '5px' : '16px';
                    const newRight = isMobileNow ? '5px' : '16px';
                    widgetContainer.style.bottom = newBottom;
                    widgetContainer.style.right = newRight;
                } catch (e) {
                    console.error('[MAFIA CHAT] Ошибка в resize:', e);
                }
            });
            
            // Загружаем виджет через iframe
            console.log('[MAFIA CHAT] Создание iframe...');
            const iframe = document.createElement('iframe');
            iframe.id = 'mafia-chat-iframe';
            iframe.src = WIDGET_URL + '?widget=true';
            console.log('[MAFIA CHAT] iframe src:', iframe.src);
            // Минимальный размер для кнопки, баббл будет виден через overflow: visible контейнера
            iframe.style.cssText = 'border: none; background: transparent; position: absolute; bottom: 0; right: 0; width: 80px; height: 80px; pointer-events: auto !important; z-index: 999999 !important;';
            iframe.allow = 'microphone';
            iframe.scrolling = 'no';
            iframe.frameBorder = '0';
            iframe.setAttribute('allowtransparency', 'true');
            
            widgetContainer.appendChild(iframe);
            console.log('[MAFIA CHAT] iframe добавлен в контейнер');
            
            // Экспортируем функцию для открытия чата
            window.mafiaChatToggle = function() {
                try {
                    console.log('[MAFIA CHAT] Открытие чата через mafiaChatToggle');
                    if (iframe && iframe.contentWindow) {
                        iframe.contentWindow.postMessage({ type: 'open-chat' }, WIDGET_URL);
                        console.log('[MAFIA CHAT] postMessage отправлен');
                    } else {
                        console.error('[MAFIA CHAT] iframe или contentWindow недоступен');
                    }
                } catch (e) {
                    console.error('[MAFIA CHAT] Ошибка в mafiaChatToggle:', e);
                }
            };
        
            // Состояние чата и баббла
            let chatIsOpen = false;
            
            // Слушаем сообщения от iframe через postMessage
            window.addEventListener('message', function(event) {
                try {
                    // Проверяем origin для безопасности
                    if (event.origin !== WIDGET_URL) {
                        return;
                    }
                    
                    console.log('[MAFIA CHAT] Получено сообщение от iframe:', event.data);
                    
                    if (event.data && event.data.type === 'chat-toggle') {
                        console.log('[MAFIA CHAT] chat-toggle:', event.data.isOpen);
                        updateContainerSize(event.data.isOpen);
                    }
                    
                } catch (e) {
                    console.error('[MAFIA CHAT] Ошибка в обработчике message:', e);
                }
            });
        
            // Функция обновления размера контейнера
            function updateContainerSize(isChatOpen) {
                try {
                    console.log('[MAFIA CHAT] updateContainerSize:', isChatOpen);
                    chatIsOpen = isChatOpen;
                    if (isChatOpen) {
                        widgetContainer.style.width = '400px';
                        widgetContainer.style.height = '700px';
                        iframe.style.width = '400px';
                        iframe.style.height = '700px';
                        console.log('[MAFIA CHAT] Контейнер увеличен до 400x700px');
                    } else {
                        // Чат закрыт - минимальный размер
                        widgetContainer.style.width = '80px';
                        widgetContainer.style.height = '80px';
                        iframe.style.width = '80px';
                        iframe.style.height = '80px';
                        console.log('[MAFIA CHAT] Контейнер уменьшен до 80x80px');
                    }
                } catch (e) {
                    console.error('[MAFIA CHAT] Ошибка в updateContainerSize:', e);
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
        
            iframe.onload = function() {
                console.log('[MAFIA CHAT] iframe загружен успешно');
            };
            
            iframe.onerror = function() {
                console.error('[MAFIA CHAT] Ошибка загрузки iframe');
            };
            
            console.log('[MAFIA CHAT] Виджет успешно инициализирован!');
        } catch (e) {
            console.error('[MAFIA CHAT] КРИТИЧЕСКАЯ ОШИБКА при инициализации:', e);
            console.error('[MAFIA CHAT] Stack trace:', e.stack);
        }
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
