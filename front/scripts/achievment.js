class AchievementSystem {
    constructor() {
        this.achievements = {
            'first_visit': {
                id: 'first_visit',
                name: 'Первое посещение',
                description: 'Впервые посетили сайт',
                icon: '🏠',
                points: 10,
                secret: false,
                unlocked: false,
                category: 'basic'
            },
            'theme_changer': {
                id: 'theme_changer',
                name: 'Смена темы',
                description: 'Изменили тему сайта',
                icon: '🎨',
                points: 15,
                secret: false,
                unlocked: false,
                category: 'basic'
            },
            'snow_master': {
                id: 'snow_master',
                name: 'Повелитель снега',
                description: 'Изменили интенсивность снегопада',
                icon: '❄️',
                points: 20,
                secret: false,
                unlocked: false,
                category: 'interaction'
            },
            'fast_typer': {
                id: 'fast_typer',
                name: 'Скоростная печать',
                description: 'Ввели 5 команд за 30 секунд',
                icon: '⚡',
                points: 30,
                secret: true,
                unlocked: false,
                category: 'interaction'
            },
            'chat_pro': {
                id: 'chat_pro',
                name: 'Профессионал чата',
                description: 'Использовали все команды чата',
                icon: '💬',
                points: 60,
                secret: false,
                unlocked: false,
                category: 'interaction'
            },
            'scroll_master': {
                id: 'scroll_master',
                name: 'Мастер скролла',
                description: 'Прокрутили сайт на 1000px',
                icon: '📜',
                points: 20,
                secret: true,
                unlocked: false,
                category: 'interaction'
            },
            'night_owl': {
                id: 'night_owl',
                name: 'Ночная сова',
                description: 'Посетили сайт после полуночи',
                icon: '🦉',
                points: 25,
                secret: true,
                unlocked: false,
                category: 'time'
            },
            'secret_coder': {
                id: 'secret_coder',
                name: 'Тайный разработчик',
                description: 'Нашли секретную команду в консоли',
                icon: '🔐',
                points: 50,
                secret: true,
                unlocked: false,
                category: 'secret'
            },
            'easter_egg': {
                id: 'easter_egg',
                name: 'Пасхалка найдена!',
                description: 'Обнаружили скрытый элемент',
                icon: '🥚',
                points: 100,
                secret: true,
                unlocked: false,
                category: 'secret'
            },
            'team_explorer': {
                id: 'team_explorer',
                name: 'Исследователь команды',
                description: 'Посетили все страницы участников',
                icon: '👥',
                points: 40,
                secret: false,
                unlocked: false,
                category: 'exploration'
            },
            'perfectionist': {
                id: 'perfectionist',
                name: 'Перфекционист',
                description: 'Разблокировали все достижения',
                icon: '🏆',
                points: 200,
                secret: false,
                unlocked: false,
                category: 'special'
            }
        };
        
        this.stats = {
            totalPoints: 0,
            unlockedCount: 0,
            totalCount: Object.keys(this.achievements).length,
            commandsUsed: 0,
            pagesVisited: new Set(),
            chatMessages: 0,
            snowChanges: 0,
            themeChanges: 0,
            scrollDistance: 0,
            visitTime: null,
            usedCommands: new Set(),
            lastCommandTime: 0,
            commandCountInPeriod: 0
        };
        
        this.lastCommandTime = null;
        this.commandsInLast30s = 0;
        this.visitStartTime = Date.now();
        this.scrollStart = 0;
        this.easterEggClicks = 0;
        this.allCommands = ['/help', '/clear', '/theme', '/time', '/members', 
                            '/projects', '/contact', '/about', '/snow'];
        
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.startTracking();
        this.checkTimeBasedAchievements();
        this.setupConsoleEasterEgg();
        this.checkFirstVisit();
        this.trackPageVisit();
        
        this.addStyles();
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('achievements_progress');
            if (saved) {
                const data = JSON.parse(saved);
                
                if (data.unlocked && Array.isArray(data.unlocked)) {
                    data.unlocked.forEach(achievementId => {
                        if (this.achievements[achievementId]) {
                            this.achievements[achievementId].unlocked = true;
                        }
                    });
                }
                
                if (data.stats) {
                    Object.keys(data.stats).forEach(key => {
                        if (key !== 'pagesVisited' && key !== 'usedCommands') {
                            this.stats[key] = data.stats[key];
                        }
                    });
                    
                    if (data.stats.pagesVisited) {
                        this.stats.pagesVisited = new Set(data.stats.pagesVisited);
                    }
                    if (data.stats.usedCommands) {
                        this.stats.usedCommands = new Set(data.stats.usedCommands);
                    }
                }
                
                this.updateStats();
                console.log('Прогресс достижений загружен');
            }
        } catch (e) {
            console.error('Ошибка загрузки прогресса:', e);
            this.saveProgress();
        }
    }

    saveProgress() {
        try {
            const data = {
                unlocked: Object.values(this.achievements)
                    .filter(a => a.unlocked)
                    .map(a => a.id),
                stats: {
                    ...this.stats,
                    pagesVisited: Array.from(this.stats.pagesVisited),
                    usedCommands: Array.from(this.stats.usedCommands)
                }
            };
            
            localStorage.setItem('achievements_progress', JSON.stringify(data));
        } catch (e) {
            console.error('Ошибка сохранения прогресса:', e);
        }
    }

    setupEventListeners() {
        window.addEventListener('scroll', this.trackScroll.bind(this));
        
        document.addEventListener('click', (e) => {
            this.checkForEasterEgg(e.target);
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                this.unlockAchievement('easter_egg');
                this.showSpecialNotification('🎮 Секретная комбинация Ctrl+Shift+A активирована!');
            }
        });
        
        this.setupChatListeners();
    }

    setupChatListeners() {
        this.setupThemeListener();
        this.setupSnowListener();
        this.setupChatCommandListener();
    }

    setupThemeListener() {
        const originalSetItem = localStorage.setItem;
        const self = this;
        
        localStorage.setItem = function(key, value) {
            originalSetItem.apply(this, arguments);
            
            if (key === 'theme') {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                if (value !== currentTheme) {
                    self.handleThemeChange(value);
                }
            }
        };
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const theme = document.documentElement.getAttribute('data-theme');
                    self.handleThemeChange(theme);
                }
            });
        });
        
        observer.observe(document.documentElement, { attributes: true });
    }

    setupSnowListener() {
        setInterval(() => {
            if (window.snowfall) {
                const isActive = window.snowfall.isActive;
                if (isActive && this.stats.snowChanges === 0) {
                    this.handleSnowChange();
                }
            }
        }, 1000);
    }

    setupChatCommandListener() {
        const originalSendMessage = window.chatWidget?.sendMessage;
        if (originalSendMessage && window.chatWidget) {
            const self = this;
            window.chatWidget.sendMessage = function() {
                const input = this.input;
                const message = input.value.trim();
                
                if (message && message.startsWith('/')) {
                    self.handleChatCommand(message);
                }
                
                return originalSendMessage.apply(this, arguments);
            };
        }
    }

    startTracking() {
        setInterval(() => {
            const now = Date.now();
            if (this.lastCommandTime && (now - this.lastCommandTime) > 30000) {
                this.commandsInLast30s = 0;
            }
        }, 1000);
        
        setInterval(() => {
            this.saveProgress();
        }, 30000);
    }

    checkFirstVisit() {
        const hasVisited = localStorage.getItem('has_visited');
        if (!hasVisited) {
            localStorage.setItem('has_visited', 'true');
            setTimeout(() => {
                this.unlockAchievement('first_visit');
            }, 1000);
        }
        
        const currentHour = new Date().getHours();
        this.stats.visitTime = currentHour;
        if (currentHour >= 0 && currentHour < 6) {
            this.unlockAchievement('night_owl');
        }
    }

    trackPageVisit() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.stats.pagesVisited.add(currentPage);
        
        const teamPages = [
            'alexander-page.html',
            'yaroslav-page.html', 
            'nadya-page.html',
            'denis-page.html',
            'edik-page.html',
            'artyom-page.html'
        ];
        
        let visitedAll = true;
        teamPages.forEach(page => {
            if (!this.stats.pagesVisited.has(page)) {
                visitedAll = false;
            }
        });
        
        if (visitedAll && !this.achievements.team_explorer.unlocked) {
            this.unlockAchievement('team_explorer');
        }
    }

    trackScroll() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDelta = Math.abs(currentScroll - (this.scrollStart || 0));
        
        if (scrollDelta > 50) {
            this.scrollStart = currentScroll;
            this.stats.scrollDistance += scrollDelta;
            
            if (this.stats.scrollDistance >= 1000 && !this.achievements.scroll_master.unlocked) {
                this.unlockAchievement('scroll_master');
            }
        }
    }

    handleChatCommand(command) {
        const baseCommand = command.split(' ')[0].toLowerCase();
        
        this.stats.commandsUsed++;
        this.stats.usedCommands.add(baseCommand);
        
        const now = Date.now();
        if (this.lastCommandTime && (now - this.lastCommandTime) < 30000) {
            this.commandsInLast30s++;
        } else {
            this.commandsInLast30s = 1;
        }
        this.lastCommandTime = now;
        
        if (this.commandsInLast30s >= 5 && !this.achievements.fast_typer.unlocked) {
            this.unlockAchievement('fast_typer');
        }
        
        let allUsed = true;
        this.allCommands.forEach(cmd => {
            if (!this.stats.usedCommands.has(cmd)) {
                allUsed = false;
            }
        });
        
        if (allUsed && !this.achievements.chat_pro.unlocked) {
            this.unlockAchievement('chat_pro');
        }
        
        this.saveProgress();
    }

    handleThemeChange(theme) {
        this.stats.themeChanges++;
        
        if (this.stats.themeChanges >= 1 && !this.achievements.theme_changer.unlocked) {
            this.unlockAchievement('theme_changer');
        }
        
        this.saveProgress();
    }

    handleSnowChange() {
        this.stats.snowChanges++;
        
        if (this.stats.snowChanges >= 1 && !this.achievements.snow_master.unlocked) {
            this.unlockAchievement('snow_master');
        }
        
        this.saveProgress();
    }

    checkForEasterEgg(element) {
        const logoSelectors = ['.logo', '.logo-left', '.logo-right', '[alt*="лого"]', '[alt*="logo"]'];
        let isLogo = false;
        
        logoSelectors.forEach(selector => {
            if (element.closest(selector) || element.matches(selector)) {
                isLogo = true;
            }
        });
        
        if (isLogo) {
            this.easterEggClicks++;
            
            clearTimeout(this.easterEggTimer);
            this.easterEggTimer = setTimeout(() => {
                this.easterEggClicks = 0;
            }, 2000);
            
            if (this.easterEggClicks >= 3 && !this.achievements.easter_egg.unlocked) {
                this.unlockAchievement('easter_egg');
                this.showSpecialNotification('🎉 Пасхалка найдена! Вы кликнули на логотип 3 раза!');
                this.easterEggClicks = 0;
            }
        }
    }

    setupConsoleEasterEgg() {
        console.log('%c🔍 Ищите пасхалки!', 'color: #419FD9; font-size: 16px; font-weight: bold;');
        console.log('%cВведите в консоль: console.log("digitalweb") для секретного достижения!', 'color: #DF6FF6;');
        
        const originalConsoleLog = console.log;
        const self = this;
        
        console.log = function(...args) {
            originalConsoleLog.apply(console, args);
            
            const message = args.join(' ').toLowerCase();
            if (message.includes('digitalweb') || message.includes('gm_on_the_rakbot')) {
                if (!self.achievements.secret_coder.unlocked) {
                    self.unlockAchievement('secret_coder');
                    self.showSpecialNotification('🔐 Секретная консольная команда обнаружена!');
                }
            }
        };
    }

    checkTimeBasedAchievements() {
        const now = new Date();
        const currentHour = now.getHours();
        
        if (currentHour >= 0 && currentHour < 6 && !this.achievements.night_owl.unlocked) {
            this.unlockAchievement('night_owl');
        }
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        
        if (!achievement || achievement.unlocked) {
            return;
        }
        
        achievement.unlocked = true;
        this.stats.unlockedCount++;
        this.stats.totalPoints += achievement.points;
        
        console.log('🎉 Достижение разблокировано:', achievement.name);
        this.showAchievementNotification(achievement);
        this.updateStats();
        this.saveProgress();
        
        const event = new CustomEvent('achievementUnlocked', {
            detail: { achievement }
        });
        window.dispatchEvent(event);
        
        if (this.stats.unlockedCount === this.stats.totalCount) {
            this.unlockAchievement('perfectionist');
        }
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-notification-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-text">
                    <div class="achievement-title">Достижение разблокировано!</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-points">+${achievement.points} очков</div>
                </div>
                ${achievement.secret ? '<div class="achievement-secret-badge">Секретно</div>' : ''}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        this.playAchievementSound();
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 4000);
    }

    showSpecialNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'special-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 2000);
    }

    playAchievementSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
        }
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .achievement-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #2d3748, #4a5568);
                color: white;
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                z-index: 10001;
                max-width: 350px;
                transform: translateX(400px);
                transition: transform 0.5s ease;
                border-left: 4px solid #419FD9;
            }
            
            .achievement-notification.show {
                transform: translateX(0);
            }
            
            .achievement-notification-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .achievement-icon {
                font-size: 36px;
            }
            
            .achievement-text {
                flex: 1;
            }
            
            .achievement-title {
                font-size: 12px;
                opacity: 0.8;
                margin-bottom: 5px;
            }
            
            .achievement-name {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .achievement-description {
                font-size: 14px;
                opacity: 0.9;
                margin-bottom: 5px;
            }
            
            .achievement-points {
                font-size: 14px;
                color: #FFD700;
                font-weight: bold;
            }
            
            .achievement-secret-badge {
                background: #FF6B6B;
                color: white;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 12px;
                position: absolute;
                top: 10px;
                right: 10px;
            }
            
            .special-notification {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                background: linear-gradient(135deg, #419FD9, #DF6FF6);
                color: white;
                padding: 20px 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.4);
                z-index: 10002;
                font-size: 18px;
                font-weight: bold;
                text-align: center;
                transition: transform 0.5s ease;
            }
            
            .special-notification.show {
                transform: translate(-50%, -50%) scale(1);
            }
            
            @keyframes slideInRight {
                from { transform: translateX(400px); }
                to { transform: translateX(0); }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); }
                to { transform: translateX(400px); }
            }
            
            @keyframes popIn {
                from { transform: translate(-50%, -50%) scale(0); }
                to { transform: translate(-50%, -50%) scale(1); }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        
        document.head.appendChild(style);
    }

    updateStats() {
        console.log('📊 Статистика достижений:', {
            'Очки': this.stats.totalPoints,
            'Достижения': `${this.stats.unlockedCount}/${this.stats.totalCount}`,
            'Использовано команд': this.stats.commandsUsed,
            'Посещено страниц': this.stats.pagesVisited.size,
            'Изменений темы': this.stats.themeChanges,
            'Изменений снега': this.stats.snowChanges
        });
    }

    testAllAchievements() {
        console.log('Тестирование всех достижений...');
        
        const achievements = Object.keys(this.achievements);
        let index = 0;
        
        const unlockNext = () => {
            if (index < achievements.length) {
                this.unlockAchievement(achievements[index]);
                index++;
                setTimeout(unlockNext, 1000);
            }
        };
        
        unlockNext();
    }

    resetProgress() {
        if (confirm('Вы уверены, что хотите сбросить весь прогресс достижений?')) {
            localStorage.removeItem('achievements_progress');
            localStorage.removeItem('has_visited');
            
            Object.values(this.achievements).forEach(achievement => {
                achievement.unlocked = false;
            });
            
            this.stats = {
                totalPoints: 0,
                unlockedCount: 0,
                totalCount: Object.keys(this.achievements).length,
                commandsUsed: 0,
                pagesVisited: new Set(),
                chatMessages: 0,
                snowChanges: 0,
                themeChanges: 0,
                scrollDistance: 0,
                visitTime: null,
                usedCommands: new Set(),
                lastCommandTime: 0,
                commandCountInPeriod: 0
            };
            
            this.updateStats();
            this.showSpecialNotification('Прогресс сброшен!');
            this.saveProgress();
        }
    }

    showAchievementsPanel() {
        this.createAchievementsPanel();
    }

    createAchievementsPanel() {
        const existingPanel = document.querySelector('.achievements-panel');
        const existingOverlay = document.querySelector('.achievements-overlay');
        if (existingPanel) existingPanel.remove();
        if (existingOverlay) existingOverlay.remove();
        
        const panel = document.createElement('div');
        panel.className = 'achievements-panel';
        panel.innerHTML = `
            <div class="achievements-panel-header">
                <h2>🏆 Система достижений</h2>
                <div class="panel-controls">
                    <button class="close-panel">×</button>
                </div>
            </div>
            <div class="achievements-stats">
                <div class="stat-item">
                    <div class="stat-value">${this.stats.totalPoints}</div>
                    <div class="stat-label">Всего очков</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.stats.unlockedCount}/${this.stats.totalCount}</div>
                    <div class="stat-label">Достижений</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.stats.commandsUsed}</div>
                    <div class="stat-label">Команд</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.stats.pagesVisited.size}</div>
                    <div class="stat-label">Страниц</div>
                </div>
            </div>
            <div class="achievements-grid">
                ${this.generateAchievementsHTML()}
            </div>
        `;
        
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 800px;
            max-height: 80vh;
            background: var(--card-bg, #fff);
            color: var(--text-color, #333);
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 10003;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;
        
        const overlay = document.createElement('div');
        overlay.className = 'achievements-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10002;
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(panel);
        
        panel.querySelector('.close-panel').addEventListener('click', () => {
            document.body.removeChild(panel);
            document.body.removeChild(overlay);
        });
        
        overlay.addEventListener('click', () => {
            document.body.removeChild(panel);
            document.body.removeChild(overlay);
        });
        
        panel.querySelector('.test-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Протестировать все достижения? (для разработчиков)')) {
                this.testAllAchievements();
                setTimeout(() => {
                    document.body.removeChild(panel);
                    document.body.removeChild(overlay);
                    this.showAchievementsPanel();
                }, 2000);
            }
        });
        
        panel.querySelector('.reset-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.resetProgress();
            setTimeout(() => {
                document.body.removeChild(panel);
                document.body.removeChild(overlay);
                this.showAchievementsPanel();
            }, 100);
        });
    }

    generateAchievementsHTML() {
        const categories = {};
        
        Object.values(this.achievements).forEach(achievement => {
            if (!categories[achievement.category]) {
                categories[achievement.category] = [];
            }
            categories[achievement.category].push(achievement);
        });
        
        let html = '';
        
        for (const [category, achievements] of Object.entries(categories)) {
            html += `
                <div class="achievement-category">
                    <h3>${this.getCategoryName(category)}</h3>
                    <div class="category-achievements">
                        ${achievements.map(achievement => `
                            <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                                <div class="achievement-icon">${achievement.unlocked || !achievement.secret ? achievement.icon : '❓'}</div>
                                <div class="achievement-info">
                                    <div class="achievement-name">${achievement.unlocked || !achievement.secret ? achievement.name : 'Секретное достижение'}</div>
                                    <div class="achievement-description">
                                        ${achievement.unlocked ? achievement.description : (achievement.secret ? 'Разблокируйте чтобы увидеть' : achievement.description)}
                                    </div>
                                    <div class="achievement-points">${achievement.points} очков</div>
                                </div>
                                ${achievement.secret ? '<div class="secret-badge">Секретно</div>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        return html;
    }

    getCategoryName(category) {
        const names = {
            'basic': 'Базовые',
            'interaction': 'Взаимодействие',
            'secret': 'Секретные',
            'time': 'Временные',
            'exploration': 'Исследование',
            'special': 'Особые'
        };
        return names[category] || category;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.achievementSystem = new AchievementSystem();
        
        console.log('🎮 Система достижений инициализирована!');
        console.log('Для просмотра достижений используйте команду: /quest');
        console.log('Для тестирования введите в консоль: achievementSystem.testAllAchievements()');
        console.log('Для сброса: achievementSystem.resetProgress()');
    }, 1000);
});