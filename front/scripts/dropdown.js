class DropdownEnhancer {
    constructor() {
        this.dropdowns = [];
        this.init();
    }

    init() {
        this.collectDropdowns();
        this.setupEnhancedDropdowns();
        this.setupKeyboardNavigation();
        this.setupMobileDropdowns();
    }

    collectDropdowns() {
        this.dropdowns = document.querySelectorAll('.dropdown');
    }

    setupEnhancedDropdowns() {
        this.dropdowns.forEach(dropdown => {
            const btn = dropdown.querySelector('.dropdown-btn');
            const content = dropdown.querySelector('.dropdown-content');
            
            if (!btn || !content) return;
            
            const indicator = btn.querySelector('i');
            if (!indicator) {
                const newIndicator = document.createElement('i');
                newIndicator.className = 'fas fa-chevron-down dropdown-indicator';
                btn.appendChild(newIndicator);
            }
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown(dropdown);
            });
            
            document.addEventListener('click', () => {
                this.closeDropdown(dropdown);
            });
            
            content.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }

    toggleDropdown(dropdown) {
        const isOpen = dropdown.classList.contains('open');
        
        this.dropdowns.forEach(d => {
            if (d !== dropdown) this.closeDropdown(d);
        });
        
        if (isOpen) {
            this.closeDropdown(dropdown);
        } else {
            this.openDropdown(dropdown);
        }
    }

    openDropdown(dropdown) {
        dropdown.classList.add('open');
        const content = dropdown.querySelector('.dropdown-content');
        const indicator = dropdown.querySelector('.dropdown-indicator');
        
        if (content) {
            content.style.display = 'block';
            content.style.animation = 'slideDown 0.3s ease forwards';
        }
        
        if (indicator) {
            indicator.style.transform = 'rotate(180deg)';
            indicator.style.transition = 'transform 0.3s ease';
        }
    }

    closeDropdown(dropdown) {
        dropdown.classList.remove('open');
        const content = dropdown.querySelector('.dropdown-content');
        const indicator = dropdown.querySelector('.dropdown-indicator');
        
        if (content) {
            content.style.animation = 'slideUp 0.3s ease forwards';
            setTimeout(() => {
                content.style.display = 'none';
            }, 300);
        }
        
        if (indicator) {
            indicator.style.transform = 'rotate(0deg)';
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.dropdowns.forEach(dropdown => this.closeDropdown(dropdown));
            }
            
            if (e.key === 'Tab') {
                const openDropdown = document.querySelector('.dropdown.open');
                if (openDropdown) {
                    const focusable = openDropdown.querySelectorAll('a');
                    if (focusable.length > 0) {
                        e.preventDefault();
                    }
                }
            }
        });
    }

    setupMobileDropdowns() {
        const checkMobile = () => {
            const isMobile = window.innerWidth <= 768;
            
            this.dropdowns.forEach(dropdown => {
                const content = dropdown.querySelector('.dropdown-content');
                if (content) {
                    if (isMobile) {
                        content.style.position = 'static';
                        content.style.width = '100%';
                    } else {
                        content.style.position = 'absolute';
                        content.style.width = '';
                    }
                }
            });
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DropdownEnhancer();
});