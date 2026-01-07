(function() {
    'use strict';
    
    // URL виджета
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
    iframe.setAttribute('allowtransparency', 'true');
    
    // Адаптивные размеры - показываем только кнопку, чат открывается по клику
    function updateIframeSize() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            // На мобильных - iframe подстраивается под содержимое
            iframe.style.width = '100vw';
            iframe.style.height = '100vh';
            iframe.style.position = 'fixed';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.bottom = 'auto';
            iframe.style.right = 'auto';
        } else {
            // На десктопе - минимальный размер для кнопки, расширяется при открытии чата
            iframe.style.width = '80px';
            iframe.style.height = '80px';
            iframe.style.position = 'absolute';
            iframe.style.top = 'auto';
            iframe.style.left = 'auto';
            iframe.style.bottom = '20px';
            iframe.style.right = '20px';
        }
    }
    
    // Обновляем размеры iframe при открытии/закрытии чата
    function updateIframeSizeOnToggle() {
        setTimeout(() => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const chatWindow = iframeDoc.getElementById('chat-window');
                const isMobile = window.innerWidth <= 768;
                
                if (chatWindow && !isMobile) {
                    const isOpen = !chatWindow.classList.contains('hidden');
                    if (isOpen) {
                        iframe.style.width = '400px';
                        iframe.style.height = '700px';
                    } else {
                        iframe.style.width = '80px';
                        iframe.style.height = '80px';
                    }
                }
            } catch (e) {
                // CORS блокирует доступ
            }
        }, 100);
    }
    
    updateIframeSize();
    window.addEventListener('resize', updateIframeSize);
    
    widgetContainer.appendChild(iframe);
    
    // Отслеживаем изменения в iframe для обновления размеров
    setInterval(updateIframeSizeOnToggle, 500);
    
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
            style.textContent = `
                body, html { 
                    background: transparent !important; 
                    background-color: transparent !important; 
                    margin: 0 !important; 
                    padding: 0 !important; 
                }
                body[data-widget-mode="true"] { 
                    background: transparent !important; 
                }
            `;
            iframeDoc.head.appendChild(style);
            
        } catch (e) {
            console.log('Виджет чата загружен');
        }
    };
    
    iframe.onerror = function() {
        console.error('Ошибка загрузки виджета чата');
    };
    
})();

