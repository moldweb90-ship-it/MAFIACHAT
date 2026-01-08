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
            // Обновляем позицию баббла
            welcomeBubble.style.bottom = isMobileNow ? '90px' : '100px';
            welcomeBubble.style.right = newRight;
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
        
        // Создаем баббл В РОДИТЕЛЬСКОМ ОКНЕ (на сайте Joomla), а не внутри iframe
        const welcomeBubble = document.createElement('div');
        welcomeBubble.id = 'mafia-chat-welcome-bubble';
        welcomeBubble.className = 'mafia-chat-welcome-bubble';
        welcomeBubble.style.cssText = 'position: fixed; bottom: ' + (isMobile ? '90px' : '100px') + '; right: ' + rightOffset + '; z-index: 999999 !important; pointer-events: auto; background: white; padding: 12px 16px; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); max-width: 280px; display: none; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; line-height: 1.5; border: 1px solid #e5e7eb;';
        
        // Содержимое баббла
        welcomeBubble.innerHTML = '<div style="display: flex; gap: 12px; align-items: center;"><div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; flex-shrink: 0;"><img src="https://raw.githubusercontent.com/moldweb90-ship-it/MAFIACHAT/main/public/Eiva.jpg" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src=\'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3EФото%3C/text%3E%3C/svg%3E\'"></div><div style="flex: 1;"><div style="font-weight: 600; margin-bottom: 4px; color: #111827;">Добрый вечер! 👋</div><div style="color: #6b7280; font-size: 13px;">Чем могу помочь?</div></div><button onclick="document.getElementById(\\'mafia-chat-welcome-bubble\\').style.display=\\'none\\'; if(window.mafiaChatToggle) window.mafiaChatToggle();" style="position: absolute; top: -8px; right: -8px; width: 24px; height: 24px; border-radius: 50%; background: white; border: 1px solid #e5e7eb; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #6b7280; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">✕</button></div>';
        
        document.body.appendChild(welcomeBubble);
        
        // Экспортируем функцию для открытия чата
        window.mafiaChatToggle = function() {
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ type: 'open-chat' }, WIDGET_URL);
            }
        };
        
        // Клик по бабблу открывает чат
        welcomeBubble.onclick = function(e) {
            if (e.target.tagName !== 'BUTTON' && e.target.closest('button') === null) {
                window.mafiaChatToggle();
                welcomeBubble.style.display = 'none';
            }
        };
        
        // Клик по бабблу открывает чат
        welcomeBubble.onclick = function(e) {
            if (e.target.tagName !== 'BUTTON' && e.target.closest('button') === null) {
                window.mafiaChatToggle();
                welcomeBubble.style.display = 'none';
            }
        };
        
        // Состояние чата и баббла
        let chatIsOpen = false;
        
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
                if (event.data.isVisible) {
                    welcomeBubble.style.display = 'block';
                    welcomeBubble.style.animation = 'fadeInUp 0.3s ease-out';
                } else {
                    welcomeBubble.style.display = 'none';
                }
            }
        });
        
        // Функция обновления размера контейнера
        function updateContainerSize(isChatOpen) {
            chatIsOpen = isChatOpen;
            if (isChatOpen) {
                widgetContainer.style.width = '400px';
                widgetContainer.style.height = '700px';
                iframe.style.width = '400px';
                iframe.style.height = '700px';
                // Скрываем баббл когда чат открыт
                welcomeBubble.style.display = 'none';
            } else {
                // Чат закрыт - минимальный размер
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
        
        // Добавляем CSS анимацию для баббла
        const style = document.createElement('style');
        style.textContent = '@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }';
        document.head.appendChild(style);
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
