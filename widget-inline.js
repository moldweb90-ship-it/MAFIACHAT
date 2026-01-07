(function() {
    // Предотвращаем двойную загрузку
    if (window.TelegramChatWidgetLoaded) return;
    window.TelegramChatWidgetLoaded = true;
    
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
        if (document.getElementById('telegram-widget-embed')) return;
        
        // Создаем контейнер для виджета - компактный, в углу, не перекрывает сайт
        var container = document.createElement('div');
        container.id = 'telegram-widget-embed';
        container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; width: 380px; height: 620px; max-width: calc(100vw - 40px); max-height: calc(100vh - 40px); z-index: 9999; pointer-events: none;';
        
        // Создаем iframe с правильными размерами
        var iframe = document.createElement('iframe');
        iframe.id = 'telegram-chat-iframe';
        iframe.src = 'https://mafiachat-sx8l.vercel.app/';
        iframe.style.cssText = 'width: 100%; height: 100%; border: none; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); pointer-events: none; display: none;';
        iframe.allow = 'microphone';
        iframe.scrolling = 'no';
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowtransparency', 'true');
        
        container.appendChild(iframe);
        document.body.appendChild(container);
        
        // Показываем iframe и включаем pointer-events только после загрузки
        iframe.onload = function() {
            setTimeout(function() {
                iframe.style.display = 'block';
                iframe.style.pointerEvents = 'auto';
                container.style.pointerEvents = 'auto';
            }, 500);
        };
        
        // Обработка сообщений от iframe для управления видимостью
        window.addEventListener('message', function(e) {
            // Проверяем origin для безопасности
            if (!e.origin.includes('vercel.app') && !e.origin.includes('localhost')) return;
            
            if (e.data && e.data.type === 'telegram-widget-close') {
                container.style.display = 'none';
            }
            if (e.data && e.data.type === 'telegram-widget-open') {
                container.style.display = 'block';
            }
            if (e.data && e.data.type === 'telegram-widget-toggle') {
                if (container.style.display === 'none') {
                    container.style.display = 'block';
                } else {
                    container.style.display = 'none';
                }
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

