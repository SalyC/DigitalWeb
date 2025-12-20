document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница Александра загружена');
    
    animatePageElements();
    
    initDropdown();
    
    initContactInteractions();
});

function animatePageElements() {
    const elements = document.querySelectorAll('.photo-card, .name-section, .info-section, .contacts-section');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

function initDropdown() {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    
    if (dropdownBtn && dropdownContent) {
        dropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownContent.style.display = 
                dropdownContent.style.display === 'block' ? 'none' : 'block';
        });
        
        document.addEventListener('click', function() {
            dropdownContent.style.display = 'none';
        });
        
        dropdownContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

function initContactInteractions() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

function showCopyNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 2000);
}

window.addEventListener('resize', function() {
    const dropdownContent = document.querySelector('.dropdown-content');
    if (dropdownContent && window.innerWidth <= 768) {
        dropdownContent.style.position = 'static';
    } else if (dropdownContent) {
        dropdownContent.style.position = 'absolute';
    }
});