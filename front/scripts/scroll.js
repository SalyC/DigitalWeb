class ScrollAnimator {
    constructor() {
        this.animatedElements = [];
        this.init();
    }

    init() {
        this.collectElements();
        this.setupObserver();
        this.addScrollProgress();
        this.setupBackToTop();
    }

    collectElements() {
        this.animatedElements = document.querySelectorAll(
            '.animate-on-scroll, .photo-card, .info-section, .skills-grid div'
        );
    }

    setupObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        this.animatedElements.forEach(el => observer.observe(el));
    }

    addScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #419FD9, #DF6FF6);
            z-index: 10000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    setupBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
        backToTop.setAttribute('aria-label', 'Наверх');
        backToTop.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: #360c49ff;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(backToTop);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.transform = 'translateY(0)';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.transform = 'translateY(20px)';
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimator();
});