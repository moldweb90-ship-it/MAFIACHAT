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
    
    // Вставляем стили чата
    function injectStyles() {
        if (document.getElementById('chat-widget-styles')) return;
        
        var style = document.createElement('style');
        style.id = 'chat-widget-styles';
        style.textContent = `
            .tg-scrollbar::-webkit-scrollbar { width: 4px; }
            .tg-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .tg-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 4px; }
            .tg-bg { background-color: #E6EBEF; background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%236c8ea0' fill-opacity='0.12' fill-rule='evenodd'/%3E%3C/svg%3E"); }
            .message-in::before { content: ""; position: absolute; left: -6px; bottom: 6px; width: 10px; height: 10px; background: white; border-bottom-right-radius: 10px; clip-path: polygon(100% 0, 100% 100%, 0 100%); }
            .message-out::before { content: ""; position: absolute; right: -6px; bottom: 6px; width: 10px; height: 10px; background: #EEFFDE; border-bottom-left-radius: 10px; clip-path: polygon(0 0, 0% 100%, 100% 100%); }
            @keyframes slideInUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
            @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 80% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
            .widget-animate { animation: slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            .pop-in { animation: popIn 0.3s ease-out forwards; }
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            .chat-input-wrapper { transition: all 0.2s ease-in-out; }
            .chat-input-wrapper:focus-within { background-color: white; box-shadow: 0 0 0 2px rgba(42, 171, 238, 0.2); border-color: rgba(42, 171, 238, 0.4); }
            #chat-widget-window { position: fixed; bottom: 0; right: 0; width: 100%; height: 100%; max-width: 380px; max-height: 620px; z-index: 9998; }
            @media (max-width: 768px) {
                #chat-widget-window { width: calc(100vw - 32px); max-width: 400px; height: 70vh; max-height: 600px; min-height: 400px; border-radius: 20px; bottom: 80px; right: 16px; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Создание кнопки
    function createButton() {
        if (!document.body) {
            setTimeout(createButton, 100);
            return;
        }
        
        if (document.getElementById('chat-widget-button')) return;
        
        button = document.createElement('button');
        button.id = 'chat-widget-button';
        button.style.cssText = 'position: fixed; bottom: 16px; right: 16px; width: 56px; height: 56px; background: #2AABEE; border: none; border-radius: 50%; color: white; cursor: pointer; z-index: 10000; box-shadow: 0 4px 14px rgba(42,171,238,0.4); display: flex; align-items: center; justify-content: center; transition: all 0.3s;';
        
        var icon = document.createElement('svg');
        icon.style.cssText = 'width: 24px; height: 24px; fill: white;';
        icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.innerHTML = '<path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>';
        button.appendChild(icon);
        
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
    
    // Создание чата через iframe
    function createChat() {
        if (chatContainer) return;
        
        chatContainer = document.createElement('div');
        chatContainer.id = 'chat-widget-container';
        chatContainer.style.cssText = 'position: fixed; bottom: 0; right: 0; z-index: 9998; pointer-events: none;';
        
        var chatWindow = document.createElement('div');
        chatWindow.id = 'chat-widget-window';
        chatWindow.className = 'hidden bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200/50';
        chatWindow.style.cssText = 'position: fixed; bottom: 0; right: 0; width: 100%; height: 100%; max-width: 380px; max-height: 620px; pointer-events: auto;';
        
        var iframe = document.createElement('iframe');
        iframe.src = 'https://mafiachat-sx8l.vercel.app/?widget=true';
        iframe.style.cssText = 'width: 100%; height: 100%; border: none; border-radius: 16px;';
        iframe.allow = 'microphone';
        iframe.setAttribute('frameborder', '0');
        
        chatWindow.appendChild(iframe);
        chatContainer.appendChild(chatWindow);
        document.body.appendChild(chatContainer);
    }
    
    // Открытие/закрытие чата
    function toggleChat() {
        if (!chatContainer) createChat();
        
        var chatWindow = document.getElementById('chat-widget-window');
        if (!chatWindow) return;
        
        isOpen = !isOpen;
        
        if (isOpen) {
            chatWindow.classList.remove('hidden');
            if (button) {
                button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            }
        } else {
            chatWindow.classList.add('hidden');
            if (button) {
                button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white" style="width: 24px; height: 24px;"><path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path></svg>';
            }
        }
    }
    
    // Закрытие при клике вне чата
    document.addEventListener('click', function(e) {
        if (isOpen && chatContainer && !chatContainer.contains(e.target) && !button.contains(e.target)) {
            toggleChat();
        }
    });
    
    // Инициализация
    function init() {
        injectStyles();
        createButton();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
