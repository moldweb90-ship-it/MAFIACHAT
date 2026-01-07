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
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'mafia-chat-widget-wrapper';
        widgetContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 999999 !important; pointer-events: none; width: 80px; height: 80px; overflow: visible;';
        document.body.appendChild(widgetContainer);
        console.log('[MAFIA CHAT] Контейнер создан и добавлен в DOM');
        
        console.log('[MAFIA CHAT] Создаем iframe');
        // Загружаем виджет через iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'mafia-chat-iframe';
        iframe.src = WIDGET_URL + '?widget=true';
        iframe.style.cssText = 'border: none; background: transparent; position: absolute; bottom: 0; right: 0; width: 80px; height: 80px; pointer-events: auto !important; z-index: 999999 !important;';
        iframe.allow = 'microphone';
        iframe.scrolling = 'no';
        iframe.frameBorder = '0';
        iframe.setAttribute('allowtransparency', 'true');
        console.log('[MAFIA CHAT] Iframe создан, src:', iframe.src);
        
        // Обновляем размеры iframe при открытии/закрытии чата
        let lastSize = 'small';
        function updateIframeSize(isOpen) {
            console.log('[MAFIA CHAT] updateIframeSize вызван, isOpen:', isOpen);
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                console.log('[MAFIA CHAT] Мобильный режим');
                iframe.style.width = '100vw';
                iframe.style.height = '100vh';
                widgetContainer.style.width = '100vw';
                widgetContainer.style.height = '100vh';
            } else {
                if (isOpen) {
                    console.log('[MAFIA CHAT] Открываем чат - размер 400x700');
                    iframe.style.width = '400px';
                    iframe.style.height = '700px';
                    widgetContainer.style.width = '400px';
                    widgetContainer.style.height = '700px';
                    lastSize = 'large';
                } else {
                    console.log('[MAFIA CHAT] Закрываем чат - размер 80x80');
                    iframe.style.width = '80px';
                    iframe.style.height = '80px';
                    widgetContainer.style.width = '80px';
                    widgetContainer.style.height = '80px';
                    lastSize = 'small';
                }
            }
        }
        
        // Адаптивные размеры при загрузке
        function setInitialSize() {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                iframe.style.width = '100vw';
                iframe.style.height = '100vh';
                iframe.style.position = 'fixed';
                iframe.style.top = '0';
                iframe.style.left = '0';
            } else {
                iframe.style.width = '80px';
                iframe.style.height = '80px';
                iframe.style.position = 'absolute';
                iframe.style.top = 'auto';
                iframe.style.left = 'auto';
                iframe.style.bottom = '0';
                iframe.style.right = '0';
                iframe.style.pointerEvents = 'auto !important';
            }
        }
        
        setInitialSize();
        window.addEventListener('resize', setInitialSize);
        
        widgetContainer.appendChild(iframe);
        console.log('[MAFIA CHAT] Iframe добавлен в контейнер');
        
        // Отслеживаем изменения в iframe через MutationObserver
        function setupIframeObserver() {
            console.log('[MAFIA CHAT] setupIframeObserver вызван');
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                console.log('[MAFIA CHAT] Доступ к iframe документу получен');
                const chatWindow = iframeDoc.getElementById('chat-window');
                console.log('[MAFIA CHAT] chat-window найден:', !!chatWindow);
                
                if (chatWindow) {
                    const isOpen = !chatWindow.classList.contains('hidden');
                    console.log('[MAFIA CHAT] Начальное состояние чата - открыт:', isOpen);
                    updateIframeSize(isOpen);
                    
                    const observer = new MutationObserver(function(mutations) {
                        console.log('[MAFIA CHAT] MutationObserver сработал, mutations:', mutations.length);
                        mutations.forEach(function(mutation) {
                            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                                const isOpen = !chatWindow.classList.contains('hidden');
                                console.log('[MAFIA CHAT] Класс изменился, чат открыт:', isOpen);
                                updateIframeSize(isOpen);
                            }
                        });
                    });
                    
                    observer.observe(chatWindow, {
                        attributes: true,
                        attributeFilter: ['class']
                    });
                    console.log('[MAFIA CHAT] MutationObserver настроен');
                } else {
                    console.error('[MAFIA CHAT] chat-window не найден!');
                }
            } catch (e) {
                console.error('[MAFIA CHAT] Ошибка в setupIframeObserver:', e.message);
                // CORS блокирует доступ - используем fallback
                console.log('[MAFIA CHAT] Используем fallback через setInterval');
                setInterval(function() {
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        const chatWindow = iframeDoc.getElementById('chat-window');
                        if (chatWindow) {
                            const isOpen = !chatWindow.classList.contains('hidden');
                            if ((isOpen && lastSize !== 'large') || (!isOpen && lastSize !== 'small')) {
                                console.log('[MAFIA CHAT] Fallback: чат открыт:', isOpen);
                                updateIframeSize(isOpen);
                            }
                        }
                    } catch (e) {
                        console.error('[MAFIA CHAT] Fallback ошибка:', e.message);
                    }
                }, 200);
            }
        }
        
        // Настраиваем прозрачный фон после загрузки
        iframe.onload = function() {
            console.log('[MAFIA CHAT] Iframe загружен');
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                console.log('[MAFIA CHAT] Доступ к iframe документу получен в onload');
                
                if (iframeDoc.body) {
                    iframeDoc.body.style.background = 'transparent';
                    iframeDoc.body.style.backgroundColor = 'transparent';
                    iframeDoc.body.setAttribute('data-widget-mode', 'true');
                    console.log('[MAFIA CHAT] Стили body применены');
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
                    #telegram-widget-container {
                        z-index: 999999 !important;
                    }
                    #chat-window {
                        z-index: 999999 !important;
                    }
                    #widget-trigger {
                        z-index: 999999 !important;
                    }
                \`;
                iframeDoc.head.appendChild(style);
                console.log('[MAFIA CHAT] Стили добавлены в iframe');
                
                // Настраиваем observer после загрузки
                setTimeout(function() {
                    console.log('[MAFIA CHAT] Запускаем setupIframeObserver через 500ms');
                    setupIframeObserver();
                }, 500);
                
            } catch (e) {
                console.error('[MAFIA CHAT] Ошибка в onload:', e.message, e.stack);
                // Fallback - используем интервал
                console.log('[MAFIA CHAT] Используем fallback через setInterval в onload');
                setInterval(function() {
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        const chatWindow = iframeDoc.getElementById('chat-window');
                        if (chatWindow) {
                            const isOpen = !chatWindow.classList.contains('hidden');
                            if ((isOpen && lastSize !== 'large') || (!isOpen && lastSize !== 'small')) {
                                console.log('[MAFIA CHAT] Fallback onload: чат открыт:', isOpen);
                                updateIframeSize(isOpen);
                            }
                        }
                    } catch (e) {
                        console.error('[MAFIA CHAT] Fallback onload ошибка:', e.message);
                    }
                }, 200);
            }
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
