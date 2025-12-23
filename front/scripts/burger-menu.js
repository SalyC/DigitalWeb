document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const headerContainer = document.querySelector('.header-container');
    
    const burgerButton = document.createElement('button');
    burgerButton.className = 'burger-menu';
    burgerButton.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    const navCenter = document.querySelector('.nav-center');
    if (navCenter) {
        const navClone = navCenter.cloneNode(true);
        const mobileNav = document.createElement('div');
        mobileNav.className = 'mobile-nav';
        
        const homeLink = navClone.querySelector('a.nav-link');
        if (homeLink) {
            const mobileHomeLink = document.createElement('a');
            mobileHomeLink.href = homeLink.href;
            mobileHomeLink.textContent = homeLink.textContent;
            mobileHomeLink.className = 'mobile-nav-link';
            if (homeLink.classList.contains('active')) {
                mobileHomeLink.classList.add('active');
            }
            mobileNav.appendChild(mobileHomeLink);
        }
        
        const dropdown = navClone.querySelector('.dropdown');
        if (dropdown) {
            const mobileDropdown = document.createElement('div');
            mobileDropdown.className = 'mobile-dropdown';
            
            const dropdownBtn = dropdown.querySelector('.dropdown-btn');
            const mobileDropdownBtn = document.createElement('button');
            mobileDropdownBtn.className = 'mobile-dropdown-btn';
            mobileDropdownBtn.innerHTML = 'Команда <i class="fas fa-chevron-down"></i>';
            
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            const mobileDropdownContent = document.createElement('div');
            mobileDropdownContent.className = 'mobile-dropdown-content';
            
            if (dropdownContent) {
                const links = dropdownContent.querySelectorAll('a');
                links.forEach(link => {
                    const mobileLink = document.createElement('a');
                    mobileLink.href = link.href;
                    mobileLink.textContent = link.textContent;
                    mobileDropdownContent.appendChild(mobileLink);
                });
            }
            
            mobileDropdown.appendChild(mobileDropdownBtn);
            mobileDropdown.appendChild(mobileDropdownContent);
            mobileNav.appendChild(mobileDropdown);
            
            mobileDropdownBtn.addEventListener('click', function() {
                mobileDropdownContent.classList.toggle('active');
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = mobileDropdownContent.classList.contains('active') 
                        ? 'rotate(180deg)' 
                        : 'rotate(0deg)';
                }
            });
        }
        
        mobileMenu.appendChild(mobileNav);
    }
    
    headerContainer.appendChild(burgerButton);
    header.appendChild(mobileMenu);
    
    burgerButton.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            burgerButton.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    document.addEventListener('click', function(event) {
        if (!header.contains(event.target) && mobileMenu.classList.contains('active')) {
            burgerButton.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    document.addEventListener('click', function(event) {
        const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
        mobileDropdowns.forEach(dropdown => {
            if (!dropdown.contains(event.target)) {
                const content = dropdown.querySelector('.mobile-dropdown-content');
                const icon = dropdown.querySelector('.mobile-dropdown-btn i');
                if (content && content.classList.contains('active')) {
                    content.classList.remove('active');
                    if (icon) {
                        icon.style.transform = 'rotate(0deg)';
                    }
                }
            }
        });
    });
});