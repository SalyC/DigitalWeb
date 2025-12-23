class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.commands = {
            '/help': this.showHelp.bind(this),
            '/clear': this.clearChat.bind(this),
            '/theme': this.changeTheme.bind(this),
            '/time': this.showTime.bind(this),
            '/members': this.showMembers.bind(this),
            '/projects': this.showProjects.bind(this),
            '/contact': this.showContact.bind(this),
            '/about': this.showAbout.bind(this),
            '/snow': this.toggleSnow.bind(this)
        };
        
        this.inactivityTimer = null;
        this.userHasTyped = false;
        this.telegramDev = 't.me/GM_on_the_Rakbot';
        this.lastInactivityMessage = null;
        
        this.init();
    }

    init() {
        this.createWidget();
        this.setupEventListeners();
        this.showWelcomeMessage();
    }

    createWidget() {
        const widgetHTML = `
            <div class="chat-widget">
                <button class="chat-toggle" aria-label="Открыть чат">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
                    </svg>
                </button>
                <div class="chat-container">
                    <div class="chat-header">
                        <span>❄️ Командный чат</span>
                        <button class="chat-close" aria-label="Закрыть чат">×</button>
                    </div>
                    <div class="chat-messages"></div>
                    <div class="chat-input-container">
                        <div class="chat-input-wrapper">
                            <input type="text" class="chat-input" placeholder="Введите команду..." autocomplete="off">
                            <button class="chat-send" aria-label="Отправить">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
                                </svg>
                            </button>
                        </div>
                        <div class="command-hint">Для доступных команд введите /help</div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
        
        this.widget = document.querySelector('.chat-widget');
        this.toggleBtn = this.widget.querySelector('.chat-toggle');
        this.container = this.widget.querySelector('.chat-container');
        this.closeBtn = this.widget.querySelector('.chat-close');
        this.messagesContainer = this.widget.querySelector('.chat-messages');
        this.input = this.widget.querySelector('.chat-input');
        this.sendBtn = this.widget.querySelector('.chat-send');
    }

    setupEventListeners() {
        this.toggleBtn.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());
        
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
                this.userHasTyped = true;
                this.resetInactivityTimer();
            }
        });
        
        this.input.addEventListener('input', () => {
            this.userHasTyped = true;
            this.resetInactivityTimer();
        });
        
        this.sendBtn.addEventListener('click', () => {
            this.sendMessage();
            this.userHasTyped = true;
            this.resetInactivityTimer();
        });
        
        document.addEventListener('click', (e) => {
            if (!this.widget.contains(e.target) && this.isOpen) {
                this.closeChat();
            }
        });
        
        this.container.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.container.classList.add('open');
            this.input.focus();
            this.startInactivityTimer();
        } else {
            this.container.classList.remove('open');
            this.clearInactivityTimer();
        }
    }

    openChat() {
        this.isOpen = true;
        this.container.classList.add('open');
        this.input.focus();
        this.startInactivityTimer();
    }

    closeChat() {
        this.isOpen = false;
        this.container.classList.remove('open');
        this.clearInactivityTimer();
    }

    showWelcomeMessage() {
        const welcomeMessage = `
            <div class="message system">
                ❄️ Добро пожаловать в командный чат!<br>
                Все команды: <strong>/help</strong>
            </div>
        `;
        this.addMessage(welcomeMessage, 'system');
    }

    addMessage(content, type = 'bot') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = content;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        if (content.includes('🤔 Появились вопросы или нашли баг?')) {
            this.lastInactivityMessage = content;
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        this.addMessage(this.escapeHtml(message), 'user');
        
        this.input.value = '';
        this.userHasTyped = true;
        this.resetInactivityTimer();
        
        setTimeout(() => {
            this.processCommand(message);
        }, 300);
    }

    processCommand(message) {
        if (!message.startsWith('/')) {
            this.addMessage('Команды должны начинаться с символа "/". Введите /help для списка команд', 'bot');
            return;
        }

        const parts = message.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (this.commands[command]) {
            this.commands[command](args);
        } else {
            this.addMessage(`Неизвестная команда: ${command}. Введите /help для списка команд`, 'bot');
        }
    }

    showHelp() {
        const helpMessage = `
            <div class="help-command">
                <h4>📋 Доступные команды:</h4>
                <ul>
                    <li><strong>/help</strong> - Показать это сообщение</li>
                    <li><strong>/clear</strong> - Очистить историю чата</li>
                    <li><strong>/theme [light/dark]</strong> - Изменить тему сайта</li>
                    <li><strong>/time</strong> - Показать текущее время</li>
                    <li><strong>/members</strong> - Показать членов команды</li>
                    <li><strong>/projects</strong> - Показать проекты команды</li>
                    <li><strong>/contact</strong> - Контактная информация</li>
                    <li><strong>/about</strong> - О нашем портфолио</li>
                    <li><strong>/snow [stop/toggle/intensity]</strong> - Управление снегопадом</li>
                </ul>
            </div>
        `;
        this.addMessage(helpMessage, 'bot');
        this.resetInactivityTimer();
    }

    clearChat() {
        this.messagesContainer.innerHTML = '';
        this.lastInactivityMessage = null;
        this.addMessage('История чата очищена', 'system');
        this.showWelcomeMessage();
        this.resetInactivityTimer();
    }

    changeTheme(args) {
        const theme = args[0] || 'toggle';
        
        if (theme === 'toggle') {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.addMessage(`🎨 Тема изменена на: ${newTheme}`, 'bot');
        } else if (theme === 'light' || theme === 'dark') {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            this.addMessage(`🎨 Тема установлена: ${theme}`, 'bot');
        } else {
            this.addMessage('Использование: /theme [light/dark] или /theme для переключения', 'bot');
        }
        this.resetInactivityTimer();
    }

    showTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const dateString = now.toLocaleDateString('ru-RU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        this.addMessage(`🕐 <strong>Текущее время:</strong><br>${timeString}<br>${dateString}`, 'bot');
        this.resetInactivityTimer();
    }

    showMembers() {
        const members = [
            '👤 Александр - React Developer',
            '👤 Ярослав - Project Manager',
            '👤 Надежда - FullStack Developer',
            '👤 Денис - UI/UX Designer',
            '👤 Эдуард - Python Intern',
            '👤 Артем - Python Intern'
        ].join('<br>');
        
        this.addMessage(`👥 <strong>Члены команды:</strong><br>${members}`, 'bot');
        this.resetInactivityTimer();
    }

    showProjects() {
        const projects = `
            <div class="help-command">
                <h4>🚀 Наши проекты:</h4>
                <ul>
                    <li><strong>Веб-портфолио</strong> - Текущий сайт</li>
                    <li><strong>Asana фестиваль</strong> - React + Node.js</li>
                    <li><strong>Cypher Man</strong> - React + Node.js</li>
                    <li><strong>Логотип</strong> - Photoshop + Figma</li>
                    <li><strong>Система управления задачами</strong> - JavaScript + Figma</li>
                </ul>
            </div>
        `;
        this.addMessage(projects, 'bot');
        this.resetInactivityTimer();
    }

    showContact() {
        const contacts = `
            <div class="help-command">
                <h4>📞 Контакты:</h4>
                <p><strong>Email:</strong> soulfromlichess@gmail.com</p>
                <p><strong>Телефон:</strong> +7 (777) 777-77-77</p>
                <p><strong>Telegram:</strong> @GM_on_the_Rakbot</p>
                <p><strong>GitHub:</strong> github.com/SalyC</p>
            </div>
        `;
        this.addMessage(contacts, 'bot');
        this.resetInactivityTimer();
    }

    showAbout() {
        const about = `
            <div class="help-command">
                <h4>ℹ️ О портфолио:</h4>
                <p>Это командное веб-портфолио, созданное для демонстрации наших навыков и проектов.</p>
                <p><strong>Технологии:</strong></p>
                <ul>
                    <li>HTML5, CSS3, JavaScript (ES6+)</li>
                    <li>React, Node.js</li>
                    <li>Git, Docker, CI/CD</li>
                    <li>UI/UX Design</li>
                </ul>
                <p><em>© 2025 DigitalWeb Team</em></p>
            </div>
        `;
        this.addMessage(about, 'bot');
        this.resetInactivityTimer();
    }

    toggleSnow(args) {
        const action = args[0] || 'toggle';
        
        if (!window.snowfall) {
            this.addMessage('❌ Снегопад не инициализирован', 'bot');
            return;
        }
        
        switch(action) {
            case 'start':
            case 'on':
                if (!window.snowfall.isActive) {
                    window.snowfall.startAnimation();
                    this.addMessage('❄️ <strong>Снегопад запущен!</strong>', 'bot');
                } else {
                    this.addMessage('❄️ Снегопад уже активен', 'bot');
                }
                break;
                
            case 'stop':
            case 'off':
                if (window.snowfall.isActive) {
                    window.snowfall.stopAnimation();
                    this.addMessage('☀️ <strong>Снегопад остановлен!</strong>', 'bot');
                } else {
                    this.addMessage('☀️ Снегопад уже выключен', 'bot');
                }
                break;
                
            case 'toggle':
                if (window.snowfall.isActive) {
                    window.snowfall.stopAnimation();
                    this.addMessage('☀️ <strong>Снегопад выключен</strong>', 'bot');
                } else {
                    window.snowfall.startAnimation();
                    this.addMessage('❄️ <strong>Снегопад включен</strong>', 'bot');
                }
                break;
                
            case 'intensity':
                const intensity = args[1];
                if (intensity && ['low', 'medium', 'high', 'storm'].includes(intensity)) {
                    const success = window.snowfall.setIntensity(intensity);
                    if (success) {
                        const intensityNames = {
                            'low': 'низкая',
                            'medium': 'средняя',
                            'high': 'высокая',
                            'storm': 'штормовая'
                        };
                        this.addMessage(`❄️ Интенсивность: <strong>${intensityNames[intensity]}</strong>`, 'bot');
                    }
                } else {
                    this.addMessage('❌ Использование: /snow intensity [low/medium/high/storm]', 'bot');
                }
                break;
                
            case 'status':
                const status = window.snowfall.isActive ? 'включен' : 'выключен';
                const intensityLevel = window.snowfall.settings.density <= 30 ? 'низкая' :
                                      window.snowfall.settings.density <= 50 ? 'средняя' :
                                      window.snowfall.settings.density <= 80 ? 'высокая' : 'штормовая';
                this.addMessage(`❄️ Статус: ${status}<br>Интенсивность: ${intensityLevel}`, 'bot');
                break;
                
            default:
                this.addMessage('❌ Использование: /snow [stop/toggle/intensity/status]', 'bot');
        }
        this.resetInactivityTimer();
    }

    startInactivityTimer() {
        this.clearInactivityTimer();
        this.userHasTyped = false;
        
        this.inactivityTimer = setTimeout(() => {
            if (this.isOpen && !this.userHasTyped) {
                this.showInactivityMessage();
            }
        }, 5000);
    }

    resetInactivityTimer() {
        this.clearInactivityTimer();
        this.startInactivityTimer();
    }

    clearInactivityTimer() {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
            this.inactivityTimer = null;
        }
    }

    showInactivityMessage() {
        const messageContent = `<div class="message system">🤔 Появились вопросы или нашли баг?<br>Напишите разработчику: <a href="https://${this.telegramDev}" target="_blank">${this.telegramDev}</a></div>`;
        
        const messages = this.messagesContainer.querySelectorAll('.message.system');
        let alreadyExists = false;
        
        messages.forEach(msg => {
            if (msg.innerHTML === messageContent) {
                alreadyExists = true;
            }
        });
        
        if (!alreadyExists && this.lastInactivityMessage !== messageContent) {
            this.addMessage(messageContent, 'system');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.chatWidget = new ChatWidget();
});