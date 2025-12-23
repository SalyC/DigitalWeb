class Snowfall {
    constructor(options = {}) {
        this.settings = {
            density: 50,
            speed: 1,
            wind: 0.5,
            size: 2,
            color: '#ffffff',
            ...options
        };
        
        this.snowflakes = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isActive = false;
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.createSnowflakes();
        this.startAnimation();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'snowfall-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
            opacity: 0.8;
        `;
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createSnowflakes() {
        this.snowflakes = [];
        
        for (let i = 0; i < this.settings.density; i++) {
            this.snowflakes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * this.settings.size + 1,
                speed: Math.random() * this.settings.speed + 0.5,
                wind: (Math.random() - 0.5) * this.settings.wind,
                opacity: Math.random() * 0.5 + 0.5,
                sway: Math.random() * 0.5,
                swayAngle: 0,
                shape: Math.floor(Math.random() * 3)
            });
        }
    }

    startAnimation() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.canvas.style.opacity = '0.8';
        this.animate();
    }

    animate() {
        if (!this.isActive) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (const flake of this.snowflakes) {
            this.drawSnowflake(flake);
            this.updateSnowflake(flake);
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawSnowflake(flake) {
        this.ctx.save();
        this.ctx.translate(flake.x, flake.y);
        
        if (flake.shape === 1) {
            this.ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                this.ctx.rotate(Math.PI / 3);
                this.ctx.lineTo(flake.radius * 2, 0);
                this.ctx.rotate(-Math.PI / 6);
                this.ctx.lineTo(flake.radius, 0);
                this.ctx.rotate(Math.PI / 6);
            }
            this.ctx.closePath();
        } else if (flake.shape === 2) {
            this.ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const x = flake.radius * Math.cos(angle);
                const y = flake.radius * Math.sin(angle);
                if (i === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.closePath();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, flake.radius, 0, Math.PI * 2);
        }
        
        this.ctx.fillStyle = this.settings.color;
        this.ctx.globalAlpha = flake.opacity;
        this.ctx.fill();
        
        this.ctx.restore();
    }

    updateSnowflake(flake) {
        flake.y += flake.speed;
        flake.x += flake.wind + Math.sin(flake.swayAngle) * flake.sway;
        flake.swayAngle += 0.05;
        
        if (flake.y > this.canvas.height) {
            flake.y = -10;
            flake.x = Math.random() * this.canvas.width;
        }
        
        if (flake.x > this.canvas.width) {
            flake.x = 0;
        } else if (flake.x < 0) {
            flake.x = this.canvas.width;
        }
    }

    stopAnimation() {
        this.isActive = false;
        this.canvas.style.opacity = '0';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    setIntensity(level) {
    const levels = {
        'low': { density: 30, speed: 0.8, size: 1.5 },
        'medium': { density: 50, speed: 1, size: 2 },
        'high': { density: 80, speed: 1.2, size: 2.5 },
        'storm': { density: 120, speed: 1.5, size: 3 }
    };
    
    if (levels[level]) {
        this.settings = { ...this.settings, ...levels[level] };
        this.createSnowflakes();
        
        // Отправляем событие для достижений
        if (window.achievementSystem) {
            window.dispatchEvent(new CustomEvent('snowChanged'));
        }
        
        return true;
    }
    return false;
}

    toggle() {
        if (this.isActive) {
            this.stopAnimation();
        } else {
            this.startAnimation();
        }
        
        // Отправляем событие для достижений
        if (window.achievementSystem) {
            window.dispatchEvent(new CustomEvent('snowChanged'));
        }
    }

    destroy() {
        this.stopAnimation();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.snowfall = new Snowfall();
});