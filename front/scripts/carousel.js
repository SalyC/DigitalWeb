let slideIndex = 1;
let autoPlayInterval = null;
let progressBar = null;

showSlides(slideIndex);
startAutoPlay();

function plusSlides(n) {
    showSlides(slideIndex += n);
    resetAutoPlay();
}

function currentSlide(n) {
    showSlides(slideIndex = n);
    resetAutoPlay();
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].classList.remove("active");
    }
    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
        dots[i].style.backgroundColor = "#bbb";
    }
    
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].style.display = "block";
        slides[slideIndex - 1].classList.add("active");
    }
    
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].className += " active";
        dots[slideIndex - 1].style.backgroundColor = "#717171";
    }
    
    updateProgressBar();
}

function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        plusSlides(1);
    }, 5000);
}

function resetAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }
}

function addProgressBar() {
    const slideshow = document.querySelector('.slideshow-container');
    if (!slideshow || progressBar) return;
    
    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'carousel-progress';
    progressBarContainer.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(255, 255, 255, 0.2);
        z-index: 10;
        border-radius: 0 0 10px 10px;
    `;
    
    progressBar = document.createElement('div');
    progressBar.className = 'progress';
    progressBar.style.cssText = `
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #419FD9, #DF6FF6);
        transition: width 5s linear;
        border-radius: 0 0 10px 10px;
    `;
    
    progressBarContainer.appendChild(progressBar);
    slideshow.appendChild(progressBarContainer);
    updateProgressBar();
}

function updateProgressBar() {
    if (!progressBar) return;
    
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    
    setTimeout(() => {
        progressBar.style.transition = 'width 5s linear';
        progressBar.style.width = '100%';
    }, 10);
}

function addHoverEffects() {
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dots = document.querySelectorAll('.dot');
    
    if (prevBtn) {
        prevBtn.style.transition = 'all 0.3s ease';
        prevBtn.addEventListener('mouseenter', () => {
            prevBtn.style.transform = 'scale(1.2)';
            prevBtn.style.backgroundColor = 'rgba(44, 7, 53, 0.8)';
        });
        prevBtn.addEventListener('mouseleave', () => {
            prevBtn.style.transform = 'scale(1)';
            prevBtn.style.backgroundColor = '';
        });
    }
    
    if (nextBtn) {
        nextBtn.style.transition = 'all 0.3s ease';
        nextBtn.addEventListener('mouseenter', () => {
            nextBtn.style.transform = 'scale(1.2)';
            nextBtn.style.backgroundColor = 'rgba(44, 7, 53, 0.8)';
        });
        nextBtn.addEventListener('mouseleave', () => {
            nextBtn.style.transform = 'scale(1)';
            nextBtn.style.backgroundColor = '';
        });
    }
    
    dots.forEach((dot, index) => {
        dot.style.transition = 'all 0.3s ease';
        dot.title = `Слайд ${index + 1}`;
        
        dot.addEventListener('mouseenter', () => {
            if (!dot.classList.contains('active')) {
                dot.style.transform = 'scale(1.2)';
                dot.style.backgroundColor = 'rgba(44, 7, 53, 0.8)';
            }
        });
        
        dot.addEventListener('mouseleave', () => {
            if (!dot.classList.contains('active')) {
                dot.style.transform = 'scale(1)';
                dot.style.backgroundColor = '#bbb';
            }
        });
    });
}

function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            plusSlides(-1);
        } else if (e.key === 'ArrowRight') {
            plusSlides(1);
        } else if (e.key >= 1 && e.key <= 9) {
            const slideNum = parseInt(e.key);
            if (slideNum <= document.querySelectorAll('.mySlides').length) {
                currentSlide(slideNum);
            }
        }
    });
}

function setupTouchControls() {
    const slideshow = document.querySelector('.slideshow-container');
    if (!slideshow) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    slideshow.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slideshow.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(touchStartX, touchEndX);
    }, { passive: true });
    
    function handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                plusSlides(1);
            } else {
                plusSlides(-1);
            }
        }
    }
}

function initCarouselEnhancements() {
    addProgressBar();
    addHoverEffects();
    setupKeyboardControls();
    setupTouchControls();
    
    const slideshow = document.querySelector('.slideshow-container');
    if (slideshow) {
        const autoplayIndicator = document.createElement('div');
        autoplayIndicator.className = 'autoplay-indicator';
        autoplayIndicator.innerHTML = '<i class="fas fa-play"></i>';
        autoplayIndicator.title = 'Автоплей включен (клик для паузы)';
        autoplayIndicator.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 11;
            font-size: 12px;
            transition: all 0.3s ease;
        `;
        
        let isPlaying = true;
        autoplayIndicator.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                startAutoPlay();
                autoplayIndicator.innerHTML = '<i class="fas fa-play"></i>';
                autoplayIndicator.title = 'Автоплей включен (клик для паузы)';
            } else {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
                autoplayIndicator.innerHTML = '<i class="fas fa-pause"></i>';
                autoplayIndicator.title = 'Автоплей выключен (клик для включения)';
            }
        });
        
        slideshow.appendChild(autoplayIndicator);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initCarouselEnhancements();
    }, 100);
});

window.addEventListener('beforeunload', () => {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
});