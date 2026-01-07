(function() {
    if (window.TelegramChatWidgetLoaded) return;
    window.TelegramChatWidgetLoaded = true;
    
    var isOpen = false;
    var chatContainer = null;
    var button = null;
    
    // Загружаем Tailwind CSS
    if (!document.querySelector('script[src*="tailwindcss"]')) {
        var tailwind = document.createElement('script');
        tailwind.src = 'https://cdn.tailwindcss.com';
        document.head.appendChild(tailwind);
    }
    
    // Загружаем стили и скрипты чата
    function loadChatResources() {
        // Загружаем index.html через fetch и извлекаем нужные части
        fetch('https://mafiachat-sx8l.vercel.app/')
            .then(response => response.text())
            .then(html => {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');
                
                // Извлекаем стили
                var styles = doc.querySelector('style');
                if (styles && !document.getElementById('chat-widget-styles')) {
                    var styleEl = document.createElement('style');
                    styleEl.id = 'chat-widget-styles';
                    styleEl.textContent = styles.textContent;
                    document.head.appendChild(styleEl);
                }
                
                // Извлекаем скрипт
                var script = doc.querySelector('script');
                if (script) {
                    var scriptEl = document.createElement('script');
                    scriptEl.textContent = script.textContent;
                    document.body.appendChild(scriptEl);
                }
                
                // Извлекаем HTML чата
                var chatWindow = doc.getElementById('chat-window');
                if (chatWindow) {
                    createChatWidget(chatWindow.outerHTML);
                }
            })
            .catch(err => {
                console.error('Error loading chat:', err);
                // Fallback: создаем чат напрямую
                createChatWidgetDirect();
            });
    }
    
    // Создание виджета напрямую (fallback)
    function createChatWidgetDirect() {
        if (chatContainer) return;
        
        chatContainer = document.createElement('div');
        chatContainer.id = 'telegram-widget-container';
        chatContainer.style.cssText = 'position: fixed; bottom: 0; right: 0; z-index: 9999; pointer-events: none;';
        
        var chatWindow = document.createElement('div');
        chatWindow.id = 'chat-window';
        chatWindow.className = 'pointer-events-auto hidden bg-white w-full h-full md:w-[380px] md:h-[620px] md:max-h-[85vh] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200/50';
        chatWindow.style.cssText = 'position: fixed; bottom: 0; right: 0; width: 100%; height: 100%; max-width: 380px; max-height: 620px;';
        
        // Вставляем iframe с чатом
        var iframe = document.createElement('iframe');
        iframe.src = 'https://mafiachat-sx8l.vercel.app/?widget=true';
        iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
        iframe.allow = 'microphone';
        
        chatWindow.appendChild(iframe);
        chatContainer.appendChild(chatWindow);
        document.body.appendChild(chatContainer);
    }
    
    // Создание виджета из HTML
    function createChatWidget(chatHTML) {
        if (chatContainer) return;
        
        chatContainer = document.createElement('div');
        chatContainer.id = 'telegram-widget-container';
        chatContainer.style.cssText = 'position: fixed; bottom: 0; right: 0; z-index: 9999; pointer-events: none;';
        
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = chatHTML;
        var chatWindow = tempDiv.firstElementChild;
        
        if (chatWindow) {
            chatWindow.style.cssText = 'position: fixed; bottom: 0; right: 0; width: 100%; height: 100%; max-width: 380px; max-height: 620px;';
            chatContainer.appendChild(chatWindow);
            document.body.appendChild(chatContainer);
        }
    }
    
    // Создание кнопки
    function createButton() {
        if (!document.body) {
            setTimeout(createButton, 100);
            return;
        }
        
        if (document.getElementById('widget-trigger')) return;
        
        button = document.createElement('button');
        button.id = 'widget-trigger';
        button.style.cssText = 'position: fixed; bottom: 16px; right: 16px; width: 56px; height: 56px; background: #2AABEE; border: none; border-radius: 50%; color: white; cursor: pointer; z-index: 10000; box-shadow: 0 4px 14px rgba(42,171,238,0.4); display: flex; align-items: center; justify-content: center; transition: all 0.3s;';
        
        var iconClosed = document.createElement('svg');
        iconClosed.id = 'icon-closed';
        iconClosed.style.cssText = 'width: 24px; height: 24px; fill: white;';
        iconClosed.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        iconClosed.setAttribute('viewBox', '0 0 24 24');
        iconClosed.innerHTML = '<path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>';
        
        var iconOpened = document.createElement('svg');
        iconOpened.id = 'icon-opened';
        iconOpened.style.cssText = 'width: 24px; height: 24px; display: none;';
        iconOpened.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        iconOpened.setAttribute('viewBox', '0 0 24 24');
        iconOpened.setAttribute('fill', 'none');
        iconOpened.setAttribute('stroke', 'white');
        iconOpened.setAttribute('stroke-width', '2');
        iconOpened.setAttribute('stroke-linecap', 'round');
        iconOpened.setAttribute('stroke-linejoin', 'round');
        iconOpened.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
        
        button.appendChild(iconClosed);
        button.appendChild(iconOpened);
        
        button.onmouseover = function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 8px 24px rgba(42,171,238,0.5)';
        };
        button.onmouseout = function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 14px rgba(42,171,238,0.4)';
        };
        
        button.onclick = function(e) {
            e.stopPropagation();
            toggleChat();
        };
        
        document.body.appendChild(button);
    }
    
    // Открытие/закрытие чата
    function toggleChat() {
        if (!chatContainer) {
            loadChatResources();
            setTimeout(toggleChat, 500);
            return;
        }
        
        var chatWindow = document.getElementById('chat-window');
        if (!chatWindow) {
            createChatWidgetDirect();
            chatWindow = document.getElementById('chat-window');
        }
        
        isOpen = !isOpen;
        
        if (isOpen) {
            chatWindow.classList.remove('hidden');
            var iconClosed = button.querySelector('#icon-closed');
            var iconOpened = button.querySelector('#icon-opened');
            if (iconClosed) iconClosed.style.display = 'none';
            if (iconOpened) iconOpened.style.display = 'block';
        } else {
            chatWindow.classList.add('hidden');
            var iconClosed = button.querySelector('#icon-closed');
            var iconOpened = button.querySelector('#icon-opened');
            if (iconClosed) iconClosed.style.display = 'block';
            if (iconOpened) iconOpened.style.display = 'none';
        }
    }
    
    // Закрытие при клике вне чата
    document.addEventListener('click', function(e) {
        if (isOpen && chatContainer && !chatContainer.contains(e.target) && !button.contains(e.target)) {
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
