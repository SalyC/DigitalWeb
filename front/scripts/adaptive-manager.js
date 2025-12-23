class ResponsiveManager {
    constructor() {
        this.breakpoints = {
            mobile: 768,
            tablet: 992,
            desktop: 1200
        };
        this.currentBreakpoint = '';
        this.init();
    }

    init() {
        this.detectBreakpoint();
        this.setupResizeHandler();
        this.applyResponsiveStyles();
        this.setupTouchOptimizations();
        this.setupOrientationHandler();
    }

    detectBreakpoint() {
        const width = window.innerWidth;
        
        if (width < this.breakpoints.mobile) {
            this.currentBreakpoint = 'mobile';
        } else if (width < this.breakpoints.tablet) {
            this.currentBreakpoint = 'tablet';
        } else {
            this.currentBreakpoint = 'desktop';
        }
        
        document.body.setAttribute('data-breakpoint', this.currentBreakpoint);
        document.documentElement.style.setProperty('--viewport-width', `${width}px`);
    }

    setupResizeHandler() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.detectBreakpoint();
                this.applyResponsiveStyles();
                this.handleResizeEvents();
            }, 250);
        });
    }

    applyResponsiveStyles() {
        if (this.currentBreakpoint === 'mobile') {
            this.optimizeForMobile();
        } else {
            this.restoreDesktopStyles();
        }
        
        if (this.currentBreakpoint === 'tablet') {
            this.optimizeForTablet();
        }
    }

    optimizeForMobile() {
        document.body.style.setProperty('--animation-speed', '0.2s');
        
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.dataset.mobileSrc) {
                img.src = img.dataset.mobileSrc;
            }
        });
        
        const elementsToHide = document.querySelectorAll('[data-hide-mobile]');
        elementsToHide.forEach(el => {
            el.style.display = 'none';
        });
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.style.padding = '10px';
            link.style.fontSize = '14px';
        });
    }

    optimizeForTablet() {
        const gridContainers = document.querySelectorAll('.grid-container');
        gridContainers.forEach(container => {
            container.style.gap = '20px';
        });
    }

    restoreDesktopStyles() {
        document.body.style.setProperty('--animation-speed', '0.3s');
        
        const elementsToHide = document.querySelectorAll('[data-hide-mobile]');
        elementsToHide.forEach(el => {
            el.style.display = '';
        });
    }

    setupTouchOptimizations() {
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            const tapElements = document.querySelectorAll('a, button, .nav-link, .dropdown-btn');
            tapElements.forEach(el => {
                el.style.minHeight = '44px';
                el.style.minWidth = '44px';
                el.style.padding = '12px';
            });
            
            let lastTouchEnd = 0;
            document.addEventListener('touchend', (e) => {
                const now = Date.now();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
        }
    }

    setupOrientationHandler() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.detectBreakpoint();
                this.applyResponsiveStyles();
            }, 100);
        });
    }

    handleResizeEvents() {
        if (window.carouselEnhancer) {
            window.carouselEnhancer.showSlides(window.carouselEnhancer.currentSlide);
        }
        
        this.recalculateHeights();
    }

    recalculateHeights() {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && this.currentBreakpoint === 'mobile') {
            heroSection.style.minHeight = `${window.innerHeight * 0.8}px`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.responsiveManager = new ResponsiveManager();
});