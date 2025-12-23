class ThemeSwitcher {
    constructor() {
        this.themes = ['light', 'dark'];
        this.currentTheme = this.getSavedTheme();
        this.init();
    }

    init() {
        this.applyTheme();
    }

    getSavedTheme() {
        const saved = localStorage.getItem('theme');
        if (saved && this.themes.includes(saved)) {
            return saved;
        }
        return 'dark';
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }

    setTheme(theme) {
        if (this.themes.includes(theme)) {
            this.currentTheme = theme;
            this.applyTheme();
            localStorage.setItem('theme', theme);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.themeSwitcher = new ThemeSwitcher();
});