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
    
    var isOpen = false;
    var container = null;
    var iframe = null;
    var button = null;
    
    // Функция создания кнопки (копия widget-trigger из index.html)
    function createButton() {
        if (!document.body) {
            setTimeout(createButton, 100);
            return;
        }
        
        if (document.getElementById('widget-trigger')) return;
        
        // Создаем кнопку с таким же дизайном как widget-trigger
        button = document.createElement('button');
        button.id = 'widget-trigger';
        button.className = 'pointer-events-auto group w-14 h-14 md:w-16 md:h-16 bg-[#2AABEE] rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(42,171,238,0.4)] hover:shadow-[0_8px_24px_rgba(42,171,238,0.5)] hover:bg-[#229ED9] transition-all duration-300 transform hover:scale-105 z-50 fixed bottom-4 right-4';
        button.style.cssText = 'position: fixed; bottom: 16px; right: 16px; width: 56px; height: 56px; z-index: 9999;';
        
        // Иконка закрыта (отправка)
        var iconClosed = document.createElement('svg');
        iconClosed.id = 'icon-closed';
        iconClosed.className = 'w-6 h-6 md:w-8 md:h-8 text-white fill-current transition-transform duration-300 transform group-hover:-rotate-12 translate-x-[-1px] translate-y-[1px]';
        iconClosed.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        iconClosed.setAttribute('viewBox', '0 0 24 24');
        iconClosed.innerHTML = '<path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>';
        
        // Иконка открыта (крестик)
        var iconOpened = document.createElement('svg');
        iconOpened.id = 'icon-opened';
        iconOpened.className = 'w-6 h-6 md:w-7 md:h-7 text-white hidden';
        iconOpened.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        iconOpened.setAttribute('viewBox', '0 0 24 24');
        iconOpened.setAttribute('fill', 'none');
        iconOpened.setAttribute('stroke', 'currentColor');
        iconOpened.setAttribute('stroke-width', '2');
        iconOpened.setAttribute('stroke-linecap', 'round');
        iconOpened.setAttribute('stroke-linejoin', 'round');
        iconOpened.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
        
        button.appendChild(iconClosed);
        button.appendChild(iconOpened);
        
        button.onclick = function(e) {
            e.stopPropagation();
            toggleChat();
        };
        
        document.body.appendChild(button);
    }
    
    // Функция создания контейнера с чатом
    function createChatContainer() {
        if (container) return;
        
        container = document.createElement('div');
        container.id = 'telegram-widget-embed';
        container.style.cssText = 'position: fixed; bottom: 90px; right: 20px; width: 380px; height: 620px; max-width: calc(100vw - 40px); max-height: calc(100vh - 120px); z-index: 9998; display: none;';
        
        iframe = document.createElement('iframe');
        iframe.id = 'telegram-chat-iframe';
        iframe.src = 'https://mafiachat-sx8l.vercel.app/?widget=true';
        iframe.style.cssText = 'width: 100%; height: 100%; border: none; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);';
        iframe.allow = 'microphone';
        iframe.scrolling = 'no';
        iframe.setAttribute('frameborder', '0');
        
        container.appendChild(iframe);
        document.body.appendChild(container);
    }
    
    // Функция открытия/закрытия чата
    function toggleChat() {
        if (!container) createChatContainer();
        
        isOpen = !isOpen;
        
        if (isOpen) {
            container.style.display = 'block';
            // Меняем иконку на крестик
            var iconClosed = button.querySelector('#icon-closed');
            var iconOpened = button.querySelector('#icon-opened');
            if (iconClosed) iconClosed.classList.add('hidden');
            if (iconOpened) iconOpened.classList.remove('hidden');
        } else {
            container.style.display = 'none';
            // Возвращаем иконку отправки
            var iconClosed = button.querySelector('#icon-closed');
            var iconOpened = button.querySelector('#icon-opened');
            if (iconClosed) iconClosed.classList.remove('hidden');
            if (iconOpened) iconOpened.classList.add('hidden');
        }
    }
    
    // Закрытие при клике вне чата
    document.addEventListener('click', function(e) {
        if (isOpen && container && !container.contains(e.target) && !button.contains(e.target)) {
            toggleChat();
        }
    });
    
    // Инициализация
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            createButton();
        });
    } else {
        createButton();
    }
})();
