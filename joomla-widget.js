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
    var welcomeBubble = null;
    
    // Функция создания welcome bubble
    function createWelcomeBubble() {
        if (!document.body) {
            setTimeout(createWelcomeBubble, 100);
            return;
        }
        
        if (document.getElementById('telegram-welcome-bubble')) return;
        
        // Проверяем, не был ли закрыт bubble в этой сессии
        if (sessionStorage.getItem('telegram_bubble_closed')) return;
        
        welcomeBubble = document.createElement('div');
        welcomeBubble.id = 'telegram-welcome-bubble';
        welcomeBubble.innerHTML = `
            <div style="display: flex; gap: 12px; align-items: center;">
                <div style="position: relative; width: 48px; height: 48px; flex-shrink: 0;">
                    <img src="https://raw.githubusercontent.com/moldweb90-ship-it/MAFIACHAT/main/public/Eiva.jpg" 
                         style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 1px solid #e5e7eb;" 
                         onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3EФото%3C/text%3E%3C/svg%3E'">
                    <span style="position: absolute; bottom: 0; right: 0; width: 14px; height: 14px; background: #10b981; border: 2px solid white; border-radius: 50%;"></span>
                </div>
                <div>
                    <p style="font-size: 14px; font-weight: bold; color: #1f2937; line-height: 1.2; margin: 0;">Флорист Анна</p>
                    <p style="font-size: 12px; color: #4b5563; line-height: 1.4; margin: 2px 0 0 0;">Добрый день! 👋<br>Сделаем скидку на первый заказ?</p>
                </div>
            </div>
            <button onclick="this.parentElement.style.display='none'; sessionStorage.setItem('telegram_bubble_closed', 'true');" 
                    style="position: absolute; top: -8px; right: -8px; background: white; border: 1px solid #e5e7eb; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #9ca3af; font-size: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">✕</button>
        `;
        welcomeBubble.style.cssText = 'position: fixed; bottom: 90px; right: 20px; background: white; padding: 12px 16px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); max-width: 280px; z-index: 10000; cursor: pointer; border: 1px solid #e5e7eb;';
        
        welcomeBubble.onclick = function(e) {
            if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'IMG') {
                toggleChat();
            }
        };
        
        document.body.appendChild(welcomeBubble);
        
        // Показываем bubble сразу
        welcomeBubble.style.display = 'block';
    }
    
    // Функция создания кнопки
    function createButton() {
        if (!document.body) {
            setTimeout(createButton, 100);
            return;
        }
        
        if (document.getElementById('telegram-chat-button')) return;
        
        // Создаем кнопку
        button = document.createElement('button');
        button.id = 'telegram-chat-button';
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path></svg>';
        button.style.cssText = 'position: fixed; bottom: 20px; right: 20px; width: 56px; height: 56px; background: #2AABEE; border: none; border-radius: 50%; color: white; cursor: pointer; z-index: 9999; box-shadow: 0 4px 14px rgba(42,171,238,0.4); display: flex; align-items: center; justify-content: center; transition: all 0.3s;';
        
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
    
    // Функция создания контейнера с чатом
    function createChatContainer() {
        if (container) return;
        
        container = document.createElement('div');
        container.id = 'telegram-widget-embed';
        container.style.cssText = 'position: fixed; bottom: 90px; right: 20px; width: 380px; height: 620px; max-width: calc(100vw - 40px); max-height: calc(100vh - 120px); z-index: 9998; display: none;';
        
        iframe = document.createElement('iframe');
        iframe.id = 'telegram-chat-iframe';
        iframe.src = 'https://mafiachat-sx8l.vercel.app/';
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
            // Скрываем welcome bubble
            if (welcomeBubble) welcomeBubble.style.display = 'none';
            // Меняем иконку на крестик
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        } else {
            container.style.display = 'none';
            // Возвращаем иконку отправки
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path></svg>';
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
            createWelcomeBubble();
            createButton();
        });
    } else {
        createWelcomeBubble();
        createButton();
    }
})();
