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
    iframe.setAttribute('allowtransparency', 'true');
    
    // Адаптивные размеры для мобильных и десктопов
    function updateIframeSize() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            // На мобильных - полноэкранный режим
            iframe.style.width = '100vw';
            iframe.style.height = '100vh';
            iframe.style.position = 'fixed';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.bottom = 'auto';
            iframe.style.right = 'auto';
        } else {
            // На десктопе - фиксированный размер виджета
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
    
    // После загрузки iframe настраиваем прозрачный фон
    iframe.onload = function() {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            
            // Убираем белый фон у body и html
            if (iframeDoc.body) {
                iframeDoc.body.style.background = 'transparent';
                iframeDoc.body.style.backgroundColor = 'transparent';
                iframeDoc.body.setAttribute('data-widget-mode', 'true');
            }
            if (iframeDoc.documentElement) {
                iframeDoc.documentElement.style.background = 'transparent';
                iframeDoc.documentElement.style.backgroundColor = 'transparent';
            }
            
            // Добавляем стиль для прозрачного фона
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
            // CORS может блокировать доступ - это нормально
            // iframe все равно будет работать
            console.log('Виджет чата загружен (ограниченный доступ к iframe из-за CORS)');
        }
    };
    
    // Обработка ошибок загрузки
    iframe.onerror = function() {
        console.error('Ошибка загрузки виджета чата. Проверьте URL:', WIDGET_URL);
        widgetContainer.innerHTML = '<div style="position: fixed; bottom: 20px; right: 20px; background: #ff4444; color: white; padding: 12px 20px; border-radius: 8px; z-index: 99999; font-size: 14px; pointer-events: auto;">Ошибка загрузки чата</div>';
    };
    
})();
