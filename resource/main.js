// Main JavaScript for Lumina website
document.addEventListener('DOMContentLoaded', () => {
    // Navigation elements
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-item a');
    
    // Toggle mobile menu
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            navbarCollapse.classList.toggle('active');
            navbarToggler.classList.toggle('active');
            const isExpanded = navbarCollapse.classList.contains('active');
            navbarToggler.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                navbarCollapse.classList.remove('active');
                navbarToggler.classList.remove('active');
                navbarToggler.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbarCollapse.classList.remove('active');
                navbarToggler.classList.remove('active');
                navbarToggler.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Add scroll effect to navbar
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }
    

    
    // Add active state to current page nav link
    const normalizePath = (path) => {
        if (!path) return '/';
        const withoutTrailingSlash = path.replace(/\/+$/, '');
        return withoutTrailingSlash === '' ? '/' : withoutTrailingSlash;
    };

    const currentPath = normalizePath(window.location.pathname);
    
    navLinks.forEach(link => {
        const linkPath = normalizePath(new URL(link.getAttribute('href'), window.location.origin).pathname);
        
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
    
    // Button ripple effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Ensure button is not covered by other elements
        button.style.position = 'relative';
        button.style.zIndex = '10';
        button.style.overflow = 'hidden';
    });

    // Scroll animations with Intersection Observer
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeInObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Add fade-in class to elements that should animate
        const elementsToAnimate = document.querySelectorAll(
            '.mission-card, .project-card, .resource-card, .news-item, .mission-section, section'
        );
        
        elementsToAnimate.forEach((el, index) => {
            el.classList.add('fade-in');
            // Stagger animation
            el.style.transitionDelay = `${index * 0.1}s`;
            fadeInObserver.observe(el);
        });
    }

    // 3D tilt effect for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        if (prefersReducedMotion) return;
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});

// Table of Contents generation for news articles
window.onload = function() {
    if (document.querySelector('.news-article')) {
        const tocContainer = document.getElementById('toc');
        if (tocContainer) {
            const contentDiv = document.querySelector('.news-body');
            const headings = contentDiv.querySelectorAll('h2, h3, h4, h5, h6');
            
            if (headings.length > 0) {
                let tocHtml = '<h3>目次</h3><ul>';
                headings.forEach((heading, index) => {
                    const id = 'section-' + index;
                    heading.setAttribute('id', id);
                    const level = parseInt(heading.tagName.substring(1));
                    tocHtml += `<li class="toc-level-${level}"><a href="#${id}">${heading.textContent}</a></li>`;
                });
                tocHtml += '</ul>';
                tocContainer.innerHTML = tocHtml;
            } else {
                tocContainer.style.display = 'none'; // Hide if no headings
            }
        }
    }
};

// Utility function for lazy loading images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
document.addEventListener('DOMContentLoaded', lazyLoadImages);