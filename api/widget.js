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
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'mafia-chat-widget-wrapper';
        widgetContainer.style.cssText = 'position: fixed; bottom: 0; right: 0; z-index: 99999; pointer-events: none; width: 0; height: 0; overflow: visible;';
        document.body.appendChild(widgetContainer);
        
        // Загружаем виджет через iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'mafia-chat-iframe';
        iframe.src = WIDGET_URL + '?widget=true';
        iframe.style.cssText = 'border: none; background: transparent; position: absolute; bottom: 0; right: 0; width: 80px; height: 80px;';
        iframe.allow = 'microphone';
        iframe.scrolling = 'no';
        iframe.frameBorder = '0';
        iframe.setAttribute('allowtransparency', 'true');
        
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
                // На десктопе - размер для кнопки
                iframe.style.width = '80px';
                iframe.style.height = '80px';
                iframe.style.position = 'absolute';
                iframe.style.top = 'auto';
                iframe.style.left = 'auto';
                iframe.style.bottom = '20px';
                iframe.style.right = '20px';
            }
        }
        
        updateIframeSize();
        window.addEventListener('resize', updateIframeSize);
        
        widgetContainer.appendChild(iframe);
        
        // Обновляем размеры iframe при открытии/закрытии чата
        let lastSize = 'small';
        function updateIframeSizeOnToggle() {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const chatWindow = iframeDoc.getElementById('chat-window');
                const isMobile = window.innerWidth <= 768;
                
                if (chatWindow && !isMobile) {
                    const isOpen = !chatWindow.classList.contains('hidden');
                    if (isOpen && lastSize !== 'large') {
                        iframe.style.width = '400px';
                        iframe.style.height = '700px';
                        lastSize = 'large';
                    } else if (!isOpen && lastSize !== 'small') {
                        iframe.style.width = '80px';
                        iframe.style.height = '80px';
                        lastSize = 'small';
                    }
                }
            } catch (e) {
                // CORS блокирует доступ - это нормально
            }
        }
        
        // Отслеживаем изменения в iframe
        setInterval(updateIframeSizeOnToggle, 300);
        
        // Настраиваем прозрачный фон после загрузки
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
                style.textContent = \`
                    body, html { 
                        background: transparent !important; 
                        background-color: transparent !important; 
                        margin: 0 !important; 
                        padding: 0 !important; 
                    }
                    body[data-widget-mode="true"] { 
                        background: transparent !important; 
                    }
                \`;
                iframeDoc.head.appendChild(style);
                
            } catch (e) {
                console.log('Виджет чата загружен');
            }
        };
        
        iframe.onerror = function() {
            console.error('Ошибка загрузки виджета чата');
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

