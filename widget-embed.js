(function() {
    // Предотвращаем двойную загрузку
    if (window.TelegramChatWidgetLoaded) return;
    window.TelegramChatWidgetWidgetLoaded = true;
    
    // Загружаем Tailwind CSS только если его нет
    if (!document.querySelector('script[src*="tailwindcss"]')) {
        var tailwind = document.createElement('script');
        tailwind.src = 'https://cdn.tailwindcss.com';
        document.head.appendChild(tailwind);
    }
    
    // Функция загрузки виджета
    function loadWidget() {
        if (!document.body) {
            setTimeout(loadWidget, 100);
            return;
        }
        
        // Проверяем, не загружен ли уже виджет
        if (document.getElementById('telegram-widget-container')) return;
        
        // Создаем контейнер для виджета
        var container = document.createElement('div');
        container.id = 'telegram-widget-container';
        container.innerHTML = `
            <div id="telegram-widget-iframe-wrapper" style="position: fixed; bottom: 20px; right: 20px; width: 380px; height: 620px; max-width: calc(100vw - 40px); max-height: calc(100vh - 40px); z-index: 9999; pointer-events: none;">
                <iframe 
                    id="telegram-chat-iframe" 
                    src="https://chatmafia.vercel.app/" 
                    style="width: 100%; height: 100%; border: none; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); pointer-events: none;"
                    allow="microphone"
                    scrolling="no"
                ></iframe>
            </div>
        `;
        
        document.body.appendChild(container);
        
        var iframe = document.getElementById('telegram-chat-iframe');
        var wrapper = document.getElementById('telegram-widget-iframe-wrapper');
        
        // Включаем pointer-events только при клике на iframe
        iframe.onload = function() {
            // Ждем загрузки контента
            setTimeout(function() {
                iframe.style.pointerEvents = 'auto';
                wrapper.style.pointerEvents = 'auto';
            }, 500);
        };
        
        // Обработка кликов вне виджета для закрытия
        document.addEventListener('click', function(e) {
            if (!wrapper.contains(e.target) && !iframe.contentWindow) {
                // Виджет закрывается автоматически через свой интерфейс
            }
        });
    }
    
    // Загружаем виджет
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadWidget);
    } else {
        loadWidget();
    }
})();

