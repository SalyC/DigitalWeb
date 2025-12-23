class ThemeSwitcher {
    constructor() {
        this.currentTheme = this.getSavedTheme();
        this.applyTheme();
    }

    getSavedTheme() {
        const saved = localStorage.getItem('theme');
        return saved === 'light' ? 'light' : 'dark';
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }

    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.currentTheme = theme;
            this.applyTheme();
            localStorage.setItem('theme', theme);
            
            if (window.achievementSystem) {
                window.dispatchEvent(new CustomEvent('themeChanged', {
                    detail: { theme }
                }));
            }
            
            return true;
        }
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.themeSwitcher = new ThemeSwitcher();
});