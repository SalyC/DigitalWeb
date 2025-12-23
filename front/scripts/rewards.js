class AchievementRewards {
    constructor() {
        this.rewards = {
            100: {
                name: 'Новичок',
                description: 'Достигнуто 100 очков',
                rewards: ['🔓 Разблокирован режим отладки', '🎨 Дополнительные цвета тем']
            },
            300: {
                name: 'Исследователь',
                description: 'Достигнуто 300 очков',
                rewards: ['🚀 Ускоренная анимация', '✨ Частицы повышенной яркости']
            },
            500: {
                name: 'Эксперт',
                description: 'Достигнуто 500 очков',
                rewards: ['⚡ Скрытые команды', '🎮 Мини-игры', '🔧 Консоль разработчика']
            },
            
            all_achievements: {
                name: 'ПОВЕЛИТЕЛЬ САЙТА',
                description: 'Все достижения разблокированы!',
                rewards: [
                    '👑 Режим "Бога" (God Mode)',
                    '🔮 Секретная лаборатория',
                    '⚡ Турбо-режим сайта',
                    '🎨 Продвинутые темы оформления',
                    '🔧 Полный доступ к консоли',
                    '🎮 Эксклюзивные мини-игры',
                    '✨ Эпические визуальные эффекты',
                    '🔓 Все секретные функции'
                ],
                special: true
            }
        };
        
        this.activeRewards = new Set();
        this.godModeActive = false;
        this.secretLabActive = false;
        
        this.init();
    }

    init() {
        this.loadRewards();
        this.fixGodModeState();
        this.setupAchievementListener();
        this.checkCurrentRewards();
        this.setupChatIntegration();
        
        this.removeAchievementsButton();
    }

    removeAchievementsButton() {
        const achievementsBtn = document.querySelector('.achievements-button');
        if (achievementsBtn) {
            achievementsBtn.remove();
        }
    }

    fixGodModeState() {
        if (!window.achievementSystem) return;
        
        const allUnlocked = window.achievementSystem.stats.unlockedCount === 
                            window.achievementSystem.stats.totalCount;
        
        if (this.godModeActive && !allUnlocked) {
            console.log('⚠️ Режим Бога был включен без разблокировки всех достижений. Выключаем...');
            this.godModeActive = false;
            this.saveRewards();
        }
    }

    setupAchievementListener() {
        window.addEventListener('achievementUnlocked', () => {
            setTimeout(() => {
                this.checkRewards();
            }, 1000);
        });
        
        setTimeout(() => {
            this.checkRewards();
        }, 2000);
    }

    checkRewards() {
        if (!window.achievementSystem) return;
        
        const totalPoints = window.achievementSystem.stats.totalPoints;
        const allAchievements = window.achievementSystem.stats.unlockedCount === 
                               window.achievementSystem.stats.totalCount;
        
        Object.keys(this.rewards)
            .filter(key => !isNaN(key))
            .forEach(pointsThreshold => {
                if (totalPoints >= parseInt(pointsThreshold) && 
                    !this.activeRewards.has(pointsThreshold)) {
                    
                    this.unlockReward(pointsThreshold);
                }
            });
        
        if (allAchievements && !this.activeRewards.has('all_achievements')) {
            this.unlockAllAchievementsReward();
        }
    }

    checkCurrentRewards() {
        if (!window.achievementSystem) return;
        
        const totalPoints = window.achievementSystem.stats.totalPoints;
        
        Object.keys(this.rewards)
            .filter(key => !isNaN(key))
            .forEach(pointsThreshold => {
                if (totalPoints >= parseInt(pointsThreshold)) {
                    this.activateReward(pointsThreshold, true);
                }
            });
        
        const allAchievements = window.achievementSystem.stats.unlockedCount === 
                               window.achievementSystem.stats.totalCount;
        
        if (allAchievements) {
            this.activateAllAchievementsReward(true);
        } else if (this.godModeActive) {
            this.godModeActive = false;
            this.saveRewards();
        }
    }

    setupChatIntegration() {
        setTimeout(() => {
            if (window.chatWidget) {
                this.addGodModeCommandsToChat();
            }
        }, 2000);
    }

    addGodModeCommandsToChat() {
        if (window.chatWidget) {
            const commands = {
                '/god': this.handleGodModeCommand.bind(this),
                '/lab': this.handleLabCommand.bind(this),
                '/matrix': this.handleMatrixCommand.bind(this),
                '/neon': this.handleNeonCommand.bind(this),
                '/gold': this.handleGoldCommand.bind(this),
                '/turbo': this.handleTurboCommand.bind(this),
                '/effects': this.handleEffectsCommand.bind(this),
                '/console': this.handleConsoleCommand.bind(this),
                '/debug': this.handleDebugCommand.bind(this),
                '/snake': this.handleSnakeCommand.bind(this),
                '/rewards': this.handleRewardsCommand.bind(this),
                '/labclose': this.handleLabCloseCommand.bind(this),
                '/quest': this.handleQuestCommand.bind(this) 
            };
            
            Object.entries(commands).forEach(([cmd, handler]) => {
                window.chatWidget.commands[cmd] = handler;
            });
            
            this.patchHelpCommand();
        }
    }

    patchHelpCommand() {
        const originalShowHelp = window.chatWidget.showHelp;
        window.chatWidget.showHelp = function() {
            originalShowHelp.call(this);
            
            setTimeout(() => {
                if (window.achievementRewards?.checkAllAchievements()) {
                    this.addMessage(`
                        <div class="help-command" style="background: linear-gradient(135deg, gold, orange); color: #333; padding: 15px; border-radius: 10px; margin-top: 10px;">
                            <h4>👑 КОМАНДЫ РЕЖИМА БОГА:</h4>
                            <ul>
                                <li><strong>/god [on/off]</strong> - Включить/выключить режим Бога</li>
                                <li><strong>/lab</strong> - Секретная лаборатория</li>
                                <li><strong>/labclose</strong> - Закрыть лабораторию</li>
                                <li><strong>/matrix</strong> - Тема "Матрица"</li>
                                <li><strong>/neon</strong> - Неоновая тема</li>
                                <li><strong>/gold</strong> - Золотая тема</li>
                                <li><strong>/turbo [on/off]</strong> - Турбо-режим</li>
                                <li><strong>/effects [on/off]</strong> - Визуальные эффекты</li>
                                <li><strong>/console</strong> - Консоль разработчика</li>
                                <li><strong>/debug</strong> - Отладочная информация</li>
                                <li><strong>/snake</strong> - Игра "Змейка"</li>
                                <li><strong>/rewards</strong> - Показать ваши награды</li>
                                <li><strong>/quest</strong> - Показать панель достижений</li>
                            </ul>
                        </div>
                    `, 'bot');
                } else {
                    this.addMessage(`
                        <div class="help-command" style="background: linear-gradient(135deg, #2d3748, #4a5568); color: white; padding: 10px; border-radius: 10px; margin-top: 10px;">
                            <h4>🔒 СЕКРЕТНЫЕ КОМАНДЫ:</h4>
                            <p>Разблокируйте все достижения для доступа к командам режима Бога!</p>
                            <p style="font-size: 12px; opacity: 0.8;">Прогресс: ${window.achievementSystem?.stats.unlockedCount || 0}/${window.achievementSystem?.stats.totalCount || 0}</p>
                            <p>Для просмотра достижений используйте: <strong>/quest</strong></p>
                        </div>
                    `, 'bot');
                }
            }, 100);
        }.bind(window.chatWidget);
    }


    handleQuestCommand() {
        if (window.achievementSystem) {
            window.achievementSystem.showAchievementsPanel();
            this.showChatMessage('🏆 Панель достижений открыта!');
        } else {
            this.showChatMessage('❌ Система достижений не загружена');
        }
    }

    handleGodModeCommand(args) {
        if (!this.checkAllAchievements()) {
            this.showChatMessage('🔒 Режим Бога заблокирован! Разблокируйте все достижения.');
            return;
        }
        
        const action = args[0] || 'toggle';
        
        switch (action.toLowerCase()) {
            case 'on':
            case 'enable':
            case 'вкл':
                if (!this.godModeActive) {
                    this.toggleGodMode();
                    this.showChatMessage('👑 Режим Бога ВКЛЮЧЕН!');
                } else {
                    this.showChatMessage('👑 Режим Бога уже включен');
                }
                break;
                
            case 'off':
            case 'disable':
            case 'выкл':
                if (this.godModeActive) {
                    this.toggleGodMode();
                    this.showChatMessage('👑 Режим Бога ВЫКЛЮЧЕН!');
                } else {
                    this.showChatMessage('👑 Режим Бога уже выключен');
                }
                break;
                
            case 'toggle':
            case 'переключить':
                this.toggleGodMode();
                this.showChatMessage(this.godModeActive ? '👑 Режим Бога ВКЛЮЧЕН!' : '👑 Режим Бога ВЫКЛЮЧЕН!');
                break;
                
            case 'status':
            case 'статус':
                this.showChatMessage(`👑 Режим Бога: ${this.godModeActive ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН'}<br>👥 Все достижения: ${this.checkAllAchievements() ? 'РАЗБЛОКИРОВАНЫ' : 'НЕ РАЗБЛОКИРОВАНЫ'}`);
                break;
                
            default:
                this.showChatMessage('Использование: /god [on/off/toggle/status]');
        }
    }

    handleLabCommand() {
        if (!this.checkAllAchievements()) {
            this.showChatMessage('🔒 Секретная лаборатория заблокирована! Разблокируйте все достижения.');
            return;
        }
        
        const existingLab = document.querySelector('[style*="Секретная лаборатория"]');
        if (existingLab) {
            this.showChatMessage('🔮 Лаборатория уже открыта! Используйте /labclose чтобы закрыть.');
            return;
        }
        
        this.openSecretLab();
        this.showChatMessage('🔮 Секретная лаборатория открыта!');
    }

    handleLabCloseCommand() {
        const labs = document.querySelectorAll('[style*="Секретная лаборатория"]');
        labs.forEach(lab => {
            if (lab.parentElement) {
                lab.parentElement.remove();
            }
        });
        
        const overlays = document.querySelectorAll('[style*="rgba(0,0,0,0.7)"]');
        overlays.forEach(overlay => overlay.remove());
        
        this.showChatMessage('🔮 Лаборатория закрыта');
    }

    handleMatrixCommand() {
        if (!this.checkAllAchievements()) {
            this.showChatMessage('🔒 Темы режима Бога заблокированы! Разблокируйте все достижения.');
            return;
        }
        
        this.setTheme('matrix');
        this.showChatMessage('🎨 Установлена тема "Матрица"');
    }

    handleNeonCommand() {
        if (!this.checkAllAchievements()) {
            this.showChatMessage('🔒 Темы режима Бога заблокированы! Разблокируйте все достижения.');
            return;
        }
        
        this.setTheme('neon');
        this.showChatMessage('🎨 Установлена неоновая тема');
    }

    handleGoldCommand() {
        if (!this.checkAllAchievements()) {
            this.showChatMessage('🔒 Темы режима Бога заблокированы! Разблокируйте все достижения.');
            return;
        }
        
        this.setTheme('gold');
        this.showChatMessage('🎨 Установлена золотая тема');
    }

    handleTurboCommand(args) {
        if (!this.checkAllAchievements()) {
            this.showChatMessage('🔒 Турбо-режим заблокирован! Разблокируйте все достижения.');
            return;
        }
        
        const action = args[0] || 'toggle';
        const isOn = action === 'on' || action === 'вкл';
        const isOff = action === 'off' || action === 'выкл';
        
        if (isOn) {
            document.documentElement.style.setProperty('--animation-speed', '0.05s');
            this.showChatMessage('⚡ Турбо-режим ВКЛЮЧЕН!');
        } else if (isOff) {
            document.documentElement.style.setProperty('--animation-speed', '0.3s');
            this.showChatMessage('⚡ Турбо-режим ВЫКЛЮЧЕН');
        } else {
            const currentSpeed = getComputedStyle(document.documentElement).getPropertyValue('--animation-speed').trim();
            if (currentSpeed === '0.05s') {
                document.documentElement.style.setProperty('--animation-speed', '0.3s');
                this.showChatMessage('⚡ Турбо-режим ВЫКЛЮЧЕН');
            } else {
                document.documentElement.style.setProperty('--animation-speed', '0.05s');
                this.showChatMessage('⚡ Турбо-режим ВКЛЮЧЕН!');
            }
        }
    }

    handleEffectsCommand(args) {
        if (!this.checkAllAchievements()) {
            this.showChatMessage('🔒 Визуальные эффекты заблокированы!');
            return;
        }
        
        const action = args[0] || 'toggle';
        const elements = document.querySelectorAll('.card, button, .nav-link');
        
        if (action === 'on' || action === 'вкл') {
            elements.forEach(el => {
                el.style.boxShadow = '0 0 15px var(--primary-color, #419FD9)';
            });
            this.showChatMessage('✨ Визуальные эффекты ВКЛЮЧЕНЫ!');
        } else if (action === 'off' || action === 'выкл') {
            elements.forEach(el => {
                el.style.boxShadow = '';
            });
            this.showChatMessage('✨ Визуальные эффекты ВЫКЛЮЧЕНЫ');
        } else {
            const firstElement = elements[0];
            if (firstElement && firstElement.style.boxShadow) {
                elements.forEach(el => {
                    el.style.boxShadow = '';
                });
                this.showChatMessage('✨ Визуальные эффекты ВЫКЛЮЧЕНЫ');
            } else {
                elements.forEach(el => {
                    el.style.boxShadow = '0 0 15px var(--primary-color, #419FD9)';
                });
                this.showChatMessage('✨ Визуальные эффекты ВКЛЮЧЕНЫ!');
            }
        }
    }

    handleConsoleCommand() {
        if (!this.activeRewards.has('500')) {
            this.showChatMessage('🔒 Консоль разработчика доступна с 500 очков');
            return;
        }
        
        this.openDevConsole();
        this.showChatMessage('💻 Консоль разработчика открыта');
    }

    handleDebugCommand() {
        if (!this.activeRewards.has('100')) {
            this.showChatMessage('🔒 Режим отладки доступен с 100 очков');
            return;
        }
        
        console.log('🔧 Отладочная информация:', {
            achievementSystem: window.achievementSystem?.stats,
            activeRewards: Array.from(this.activeRewards),
            godMode: this.godModeActive,
            secretLab: this.secretLabActive
        });
        
        this.showChatMessage('🔧 Отладочная информация выведена в консоль (F12)');
    }

    handleSnakeCommand() {
        if (!this.checkAllAchievements()) {
            this.showChatMessage('🔒 Мини-игры заблокированы! Разблокируйте все достижения.');
            return;
        }
        
        this.openSnakeGame();
        this.showChatMessage('🐍 Игра "Змейка" запущена!');
    }

    handleRewardsCommand() {
        let message = '<div class="help-command"><h4>🏆 ВАШИ НАГРАДЫ:</h4>';
        
        if (this.activeRewards.size === 0) {
            message += '<p>У вас еще нет наград. Зарабатывайте очки достижений!</p>';
        } else {
            message += '<ul>';
            
            Object.keys(this.rewards)
                .filter(key => this.activeRewards.has(key))
                .forEach(key => {
                    const reward = this.rewards[key];
                    message += `<li><strong>${reward.name}</strong> - ${reward.description}<br>`;
                    message += `<small>${reward.rewards.join(', ')}</small></li>`;
                });
            
            if (this.godModeActive) {
                message += '<li><strong>👑 РЕЖИМ БОГА АКТИВЕН</strong></li>';
            }
            
            message += '</ul>';
        }
        
        message += `<p>Всего очков: <strong>${window.achievementSystem?.stats.totalPoints || 0}</strong></p>`;
        message += `<p>Достижений: <strong>${window.achievementSystem?.stats.unlockedCount || 0}/${window.achievementSystem?.stats.totalCount || 0}</strong></p>`;
        message += `<p>Используйте <strong>/quest</strong> для просмотра всех достижений</p>`;
        message += '</div>';
        
        this.showChatMessage(message);
    }


    checkAllAchievements() {
        if (!window.achievementSystem) return false;
        return window.achievementSystem.stats.unlockedCount === 
                window.achievementSystem.stats.totalCount;
    }

    showChatMessage(message) {
        if (window.chatWidget) {
            window.chatWidget.addMessage(message, 'bot');
        }
    }

    unlockReward(rewardKey) {
        const reward = this.rewards[rewardKey];
        if (!reward) return;
        
        this.showRewardNotification(reward);
        this.activateReward(rewardKey);
        this.saveRewards();
    }

    unlockAllAchievementsReward() {
        const reward = this.rewards.all_achievements;
        
        this.showEpicNotification(reward);
        this.activateAllAchievementsReward();
        this.startEpicEffects();
        
        setTimeout(() => {
            this.unlockSecretLab();
            this.showChatMessage(`
                <div style="background: linear-gradient(135deg, gold, orange); color: #333; padding: 15px; border-radius: 10px;">
                    <h4>🎉 ВСЕ ДОСТИЖЕНИЯ РАЗБЛОКИРОВАНЫ!</h4>
                    <p>Теперь вам доступны команды режима Бога:</p>
                    <ul>
                        <li><strong>/god on</strong> - Включить режим Бога</li>
                        <li><strong>/lab</strong> - Секретная лаборатория</li>
                        <li><strong>/matrix, /neon, /gold</strong> - Темы оформления</li>
                        <li><strong>/quest</strong> - Просмотр достижений</li>
                        <li><strong>/help</strong> - Показать все команды</li>
                    </ul>
                    <p style="font-size: 12px; margin-top: 10px;">💡 Введите /god on для активации режима Бога!</p>
                </div>
            `);
        }, 3000);
        
        this.saveRewards();
    }

    activateReward(rewardKey, silent = false) {
        const reward = this.rewards[rewardKey];
        if (!reward) return;
        
        this.activeRewards.add(rewardKey);
        
        if (!silent) {
            console.log(`🎁 Активирована награда: ${reward.name}`);
        }
        
        switch(rewardKey) {
            case '100':
                this.activateDebugMode();
                break;
            case '300':
                this.activateFastAnimations();
                break;
            case '500':
                this.activateExpertFeatures();
                break;
        }
    }

    activateAllAchievementsReward(silent = false) {
        this.activeRewards.add('all_achievements');
        this.secretLabActive = true;
        
        if (!silent) {
            console.log('🎉 Все достижения разблокированы! Используйте /god on для активации режима Бога');
        }
        
        this.activatePremiumThemes();
        this.unlockSecretCommands();
    }


    activateDebugMode() {
        console.log('🔓 Режим отладки активирован');
    }

    activateFastAnimations() {
        console.log('🚀 Ускоренные анимации активированы');
        document.documentElement.style.setProperty('--animation-speed', '0.1s');
    }

    activateExpertFeatures() {
        console.log('⚡ Экспертные функции активированы');
    }

    activatePremiumThemes() {
        console.log('🎨 Премиум темы разблокированы!');
        this.addPremiumThemes();
    }

    unlockSecretCommands() {
        console.log('🔧 Секретные команды разблокированы!');
    }

    unlockSecretLab() {
        console.log('🔮 Секретная лаборатория разблокирована!');
        this.secretLabActive = true;
    }

    toggleGodMode() {
        if (!this.checkAllAchievements()) {
            this.showNotification('🔒 Разблокируйте все достижения для режима Бога');
            return;
        }
        
        this.godModeActive = !this.godModeActive;
        
        if (this.godModeActive) {
            this.activateGodMode();
        } else {
            this.deactivateGodMode();
        }
        
        this.saveRewards();
    }

    activateGodMode() {
        console.log('👑 God Mode активирован!');
        
        this.ensureDarkTheme();
        
        document.body.style.border = '3px solid gold';
        document.body.style.boxShadow = '0 0 20px gold';
        
        if (!document.querySelector('#god-mode-cursor')) {
            const style = document.createElement('style');
            style.id = 'god-mode-cursor';
            style.textContent = `
                body.god-mode * {
                    cursor: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text x="16" y="22" text-anchor="middle" fill="gold" font-size="24">👑</text></svg>'), auto !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.classList.add('god-mode');
    }

    deactivateGodMode() {
        document.body.style.border = '';
        document.body.style.boxShadow = '';
        document.body.classList.remove('god-mode');
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
        
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    ensureDarkTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        
        this.addPremiumThemes();
    }

    addPremiumThemes() {
        const styleId = 'premium-themes-dark';
        if (document.querySelector(`#${styleId}`)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            [data-theme="matrix"] {
                --primary-color: #00FF41 !important;
                --secondary-color: #008F11 !important;
                --background: #000000 !important;
                --text-color: #00FF41 !important;
                --card-bg: rgba(0, 255, 65, 0.05) !important;
                --button-bg: #001100 !important;
                --border-color: #008F11 !important;
            }
            
            [data-theme="neon"] {
                --primary-color: #00FF9D !important;
                --secondary-color: #9D00FF !important;
                --background: #000000 !important;
                --text-color: #00FF9D !important;
                --card-bg: rgba(0, 255, 157, 0.05) !important;
                --button-bg: #001100 !important;
                --border-color: #9D00FF !important;
            }
            
            [data-theme="gold"] {
                --primary-color: #FFD700 !important;
                --secondary-color: #FFA500 !important;
                --background: #111111 !important;
                --text-color: #FFD700 !important;
                --card-bg: rgba(255, 215, 0, 0.05) !important;
                --button-bg: #222200 !important;
                --border-color: #FFA500 !important;
            }
        `;
        document.head.appendChild(style);
    }

    setTheme(themeName) {
        this.ensureDarkTheme();
        
        if (themeName === 'matrix' || themeName === 'neon' || themeName === 'gold') {
            document.documentElement.setAttribute('data-theme', themeName);
            localStorage.setItem('theme', themeName);
            
            this.forceDarkTheme(themeName);
            
            this.showNotification(`🎨 Тема: ${themeName} (темная версия)`);
        }
    }

    forceDarkTheme(themeName) {
        const bodyStyle = document.body.style;
        
        switch(themeName) {
            case 'matrix':
                bodyStyle.backgroundColor = '#000000';
                bodyStyle.color = '#00FF41';
                break;
            case 'neon':
                bodyStyle.backgroundColor = '#000000';
                bodyStyle.color = '#00FF9D';
                break;
            case 'gold':
                bodyStyle.backgroundColor = '#111111';
                bodyStyle.color = '#FFD700';
                break;
        }
        
        document.querySelectorAll('.card, .chat-container, .achievements-panel').forEach(el => {
            el.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            el.style.color = 'inherit';
        });
    }

    openSecretLab() {
        if (!this.secretLabActive) {
            this.showChatMessage('🔒 Секретная лаборатория заблокирована!');
            return;
        }
        
        this.handleLabCloseCommand();
        
        const labDiv = document.createElement('div');
        labDiv.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        width: 90%; max-width: 600px; background: #1a1a1a; color: #fff; 
                        border-radius: 15px; padding: 20px; z-index: 10005; 
                        border: 2px solid #9D00FF; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #9D00FF; margin: 0;">🔮 Секретная лаборатория</h2>
                    <button id="close-lab-btn" style="background: none; border: none; font-size: 24px; color: #fff; cursor: pointer;">
                        ×
                    </button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <button class="lab-btn" data-theme="matrix" 
                            style="padding: 15px; background: #001100; color: #00FF41; border: 1px solid #00FF41; border-radius: 10px; cursor: pointer;">
                        🖥️ Тема "Матрица"
                    </button>
                    <button class="lab-btn" data-theme="neon" 
                            style="padding: 15px; background: #001100; color: #00FF9D; border: 1px solid #9D00FF; border-radius: 10px; cursor: pointer;">
                        💡 Неоновая тема
                    </button>
                    <button class="lab-btn" data-theme="gold" 
                            style="padding: 15px; background: #222200; color: #FFD700; border: 1px solid #FFA500; border-radius: 10px; cursor: pointer;">
                        🥇 Золотая тема
                    </button>
                    <button id="lab-snake-btn" 
                            style="padding: 15px; background: #110011; color: #FF6B6B; border: 1px solid #FF6B6B; border-radius: 10px; cursor: pointer;">
                        🐍 Запустить Змейку
                    </button>
                    <button id="lab-turbo-on" 
                            style="padding: 15px; background: #111122; color: #419FD9; border: 1px solid #419FD9; border-radius: 10px; cursor: pointer;">
                        ⚡ Турбо-режим ON
                    </button>
                    <button id="lab-turbo-off" 
                            style="padding: 15px; background: #111122; color: #DF6FF6; border: 1px solid #DF6FF6; border-radius: 10px; cursor: pointer;">
                        ⚡ Турбо-режим OFF
                    </button>
                </div>
                <div style="margin-top: 20px; padding: 15px; background: rgba(157, 0, 255, 0.1); border-radius: 10px;">
                    <p style="margin: 0; color: #9D00FF; font-size: 14px;">
                        💡 Все изменения можно сделать через чат командой /help
                    </p>
                </div>
            </div>
            <div id="lab-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                       background: rgba(0,0,0,0.7); z-index: 10004;"></div>
        `;
        
        document.body.appendChild(labDiv);
        
        setTimeout(() => {
            const closeBtn = document.getElementById('close-lab-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.handleLabCloseCommand();
                });
            }
            
            document.querySelectorAll('.lab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const theme = e.target.dataset.theme;
                    if (theme) {
                        this.setTheme(theme);
                        this.showChatMessage(`🎨 Установлена тема: ${theme}`);
                    }
                });
            });
            
            const snakeBtn = document.getElementById('lab-snake-btn');
            if (snakeBtn) {
                snakeBtn.addEventListener('click', () => {
                    this.openSnakeGame();
                    this.showChatMessage('🐍 Игра "Змейка" запущена!');
                });
            }
            
            const turboOnBtn = document.getElementById('lab-turbo-on');
            const turboOffBtn = document.getElementById('lab-turbo-off');
            
            if (turboOnBtn) {
                turboOnBtn.addEventListener('click', () => {
                    document.documentElement.style.setProperty('--animation-speed', '0.05s');
                    this.showChatMessage('⚡ Турбо-режим ВКЛЮЧЕН!');
                });
            }
            
            if (turboOffBtn) {
                turboOffBtn.addEventListener('click', () => {
                    document.documentElement.style.setProperty('--animation-speed', '0.3s');
                    this.showChatMessage('⚡ Турбо-режим ВЫКЛЮЧЕН');
                });
            }
            
            const overlay = document.getElementById('lab-overlay');
            if (overlay) {
                overlay.addEventListener('click', () => {
                    this.handleLabCloseCommand();
                });
            }
        }, 100);
    }

    openSnakeGame() {
        const oldGame = document.querySelector('[style*="Змейка (Режим Бога)"]');
        if (oldGame && oldGame.parentElement) {
            oldGame.parentElement.remove();
        }
        
        const gameDiv = document.createElement('div');
        gameDiv.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                       background: #000; z-index: 10006; display: flex; 
                       flex-direction: column; align-items: center; justify-content: center;">
                <h2 style="color: #00FF41;">🐍 Змейка (Режим Бога)</h2>
                <div style="color: #fff; margin: 20px 0; text-align: center;">
                    <p>Скоро появится...</p>
                    <p style="color: #999; font-size: 14px;">Функция в разработке</p>
                </div>
                <button id="close-snake-btn" 
                        style="padding: 10px 20px; background: #FF6B6B; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Закрыть
                </button>
            </div>
        `;
        
        document.body.appendChild(gameDiv);
        
        setTimeout(() => {
            const closeBtn = document.getElementById('close-snake-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    if (gameDiv.parentElement) {
                        gameDiv.parentElement.removeChild(gameDiv);
                    }
                });
            }
        }, 100);
    }

    openDevConsole() {
        const consoleDiv = document.createElement('div');
        consoleDiv.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                       width: 90%; max-width: 800px; height: 70%; background: #1a1a1a; 
                       color: #00FF41; border: 2px solid #00FF41; border-radius: 10px; 
                       z-index: 10005; font-family: 'Courier New', monospace; 
                       display: flex; flex-direction: column;">
                <div style="padding: 15px; border-bottom: 1px solid #00FF41; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; color: #00FF41;">💻 Консоль разработчика</h3>
                    <button id="close-console-btn" 
                            style="background: #FF6B6B; color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer;">
                        Закрыть
                    </button>
                </div>
                <div style="padding: 20px; overflow: auto; flex: 1; background: #000;">
                    <pre style="margin: 0; color: #00FF41;">${
                        JSON.stringify({
                            'Статистика достижений': window.achievementSystem?.stats || {},
                            'Активные награды': Array.from(this.activeRewards),
                            'Режим Бога': this.godModeActive,
                            'Лаборатория': this.secretLabActive,
                            'Текущая тема': document.documentElement.getAttribute('data-theme') || 'dark'
                        }, null, 2)
                    }</pre>
                </div>
            </div>
            <div id="console-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                       background: rgba(0,0,0,0.8); z-index: 10004;"></div>
        `;
        
        document.body.appendChild(consoleDiv);
        
        setTimeout(() => {
            const closeBtn = document.getElementById('close-console-btn');
            const overlay = document.getElementById('console-overlay');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    if (consoleDiv.parentElement) {
                        consoleDiv.parentElement.removeChild(consoleDiv);
                    }
                });
            }
            
            if (overlay) {
                overlay.addEventListener('click', () => {
                    if (consoleDiv.parentElement) {
                        consoleDiv.parentElement.removeChild(consoleDiv);
                    }
                });
            }
        }, 100);
    }

    showRewardNotification(reward) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FFD166, #FF9E6D);
            color: #333;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 10001;
            max-width: 500px;
            animation: slideDown 0.5s ease, fadeOut 0.5s ease 4s forwards;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="font-size: 30px;">🎁</div>
                <div>
                    <div style="font-weight: bold; font-size: 18px;">${reward.name}</div>
                    <div>${reward.description}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        this.playRewardSound();
        
        setTimeout(() => notification.remove(), 4500);
    }

    showEpicNotification(reward) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(0,0,0,0.9), rgba(65,159,217,0.9));
            z-index: 10003;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        overlay.innerHTML = `
            <div style="background: #1a1a1a; color: gold; padding: 40px; border-radius: 20px; 
                        max-width: 600px; text-align: center; border: 3px solid gold;">
                <div style="font-size: 60px;">👑</div>
                <h1 style="color: gold; margin: 20px 0;">${reward.name}</h1>
                <p style="color: #FFD700; font-size: 18px;">${reward.description}</p>
                <div style="margin: 30px 0; text-align: left; color: #fff;">
                    <h3 style="color: gold;">Вы получаете доступ к:</h3>
                    ${reward.rewards.map(r => `
                        <div style="margin: 10px 0; padding: 10px; background: rgba(255, 215, 0, 0.1); 
                                    border-radius: 5px; border-left: 3px solid gold;">
                            ${r}
                        </div>
                    `).join('')}
                </div>
                <div style="margin: 20px 0; padding: 15px; background: rgba(255, 215, 0, 0.2); border-radius: 10px;">
                    <p style="color: #FFD700; margin: 0;">
                        💡 Используйте <strong>/quest</strong> для просмотра достижений и <strong>/god on</strong> для режима Бога!
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.startConfetti();
        this.playEpicSound();
        
        setTimeout(() => overlay.remove(), 8000);
    }

    startEpicEffects() {
        this.startConfetti();
        document.body.style.animation = 'shake 0.5s ease';
        setTimeout(() => document.body.style.animation = '', 500);
    }

    startConfetti() {
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${['#FFD700', '#FF6B6B', '#4ECDC4', '#FF9E6D'][Math.floor(Math.random() * 4)]};
                    border-radius: 50%;
                    top: -20px;
                    left: ${Math.random() * 100}vw;
                    z-index: 10004;
                `;
                
                document.body.appendChild(confetti);
                
                const duration = 2000 + Math.random() * 2000;
                confetti.animate([
                    { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                    { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
                ], { duration });
                
                setTimeout(() => confetti.remove(), duration);
            }, i * 50);
        }
    }

    playEpicSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [523.25, 659.25, 783.99, 1046.50];
            
            notes.forEach((freq, i) => {
                setTimeout(() => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 2);
                }, i * 100);
            });
        } catch (e) {}
    }

    playRewardSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 1000;
            oscillator.type = 'triangle';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {}
    }

    saveRewards() {
        localStorage.setItem('achievement_rewards', JSON.stringify({
            activeRewards: Array.from(this.activeRewards),
            godModeActive: this.godModeActive,
            secretLabActive: this.secretLabActive
        }));
    }

    loadRewards() {
        const saved = localStorage.getItem('achievement_rewards');
        if (saved) {
            const data = JSON.parse(saved);
            this.activeRewards = new Set(data.activeRewards || []);
            this.godModeActive = data.godModeActive || false;
            this.secretLabActive = data.secretLabActive || false;
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: linear-gradient(135deg, #419FD9, #DF6FF6);
            color: white;
            padding: 10px 20px;
            border-radius: 10px;
            z-index: 10001;
            animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 3s forwards;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.achievementRewards = new AchievementRewards();
    }, 1500);
});