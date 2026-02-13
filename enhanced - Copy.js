// enhanced.js - World-class interactive features

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all enhanced features
    initTypewriterEffect();
    initPageTransitions();
    initParallaxElements();
    initSmoothScroll();
    initHoverEffects();
    initScrollAnimations();
    initVideoOptimization();
    initFormValidation();
    initParticleSystem();
    initCursorEffects();
    initLoadingOptimization();
    initCarousel();
    initCardAnimation();
});

// Typewriter effect for hero tagline
function initTypewriterEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.innerHTML = '';
        heroTitle.classList.add('typewriter');
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        setTimeout(typeWriter, 1000);
    }
}

// Smooth page transitions
function initPageTransitions() {
    const links = document.querySelectorAll('a[href^="http"], a[href$=".html"]');
    
    links.forEach(link => {
        if (link.href && !link.href.includes('javascript:') && !link.href.includes('#')) {
            link.addEventListener('click', function(e) {
                if (this.target === '_blank') return;
                
                e.preventDefault();
                const href = this.href;
                
                // Create transition overlay
                const transition = document.createElement('div');
                transition.className = 'page-transition';
                document.body.appendChild(transition);
                
                // Trigger transition
                setTimeout(() => {
                    transition.classList.add('active');
                }, 10);
                
                // Navigate after transition
                setTimeout(() => {
                    window.location.href = href;
                }, 800);
            });
        }
    });
}

// Parallax scrolling effect
function initParallaxElements() {
    const parallaxElements = document.querySelectorAll('.parallax-section, .particle');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            if (el.classList.contains('particle')) {
                const rate = scrolled * -0.5;
                const speed = Array.from(el.parentNode.children).indexOf(el) * 0.1;
                el.style.transform = `translateY(${rate * speed}px)`;
            } else {
                const rate = scrolled * 0.5;
                el.style.transform = `translateY(${rate}px)`;
            }
        });
    });
}

// Enhanced smooth scroll with easing
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (!target) return;
            
            const headerHeight = document.querySelector('#main-header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition - headerHeight;
            const duration = 1000;
            let start = null;
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }
            
            // Easing function
            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }
            
            requestAnimationFrame(animation);
            
            // Update active nav link
            updateActiveNavLink(targetId);
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                updateActiveNavLink(`#${sectionId}`);
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('nav-active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('nav-active');
        }
    });
}

// Advanced hover effects
function initHoverEffects() {
    const hoverElements = document.querySelectorAll('.feature-box, .project-card, .mission-point, .value-item');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = this.style.transform.replace(/scale\([^)]*\)/, '') + ' scale(1.02)';
            this.style.zIndex = '10';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(/scale\([^)]*\)/, '');
            this.style.zIndex = '';
        });
    });
}

// Scroll animations with Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add stagger effect for child elements
                if (entry.target.classList.contains('pillars-grid')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 200);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements that should animate
    document.querySelectorAll('.feature-box, .project-card, .vision-card, .mission-card, .mission-point, .value-item, .leader-card, .pillars-grid').forEach(el => {
        observer.observe(el);
    });
}

// Video optimization and lazy loading
function initVideoOptimization() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Set video to play inline on mobile
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        
        // Add loading optimization
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.load();
                        observer.unobserve(video);
                    }
                });
            });
            observer.observe(video);
        }
    });
}

// Form validation for newsletter
function initFormValidation() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const submitBtn = newsletterForm.querySelector('.newsletter-btn');
    
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!validateEmail(emailInput.value)) {
            showFormError(emailInput, 'Please enter a valid email address');
            return;
        }
        
        // Simulate API call
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        this.disabled = true;
        
        setTimeout(() => {
            showFormSuccess(emailInput, 'Thank you for subscribing! Welcome to the future.');
            emailInput.value = '';
            this.innerHTML = '<i class="fas fa-paper-plane"></i>';
            this.disabled = false;
        }, 1500);
    });
    
    // Real-time validation
    emailInput.addEventListener('input', function() {
        if (validateEmail(this.value)) {
            this.style.borderColor = 'var(--color-gold)';
        } else {
            this.style.borderColor = '';
        }
    });
}

// Email validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show form error
function showFormError(input, message) {
    const error = document.createElement('div');
    error.className = 'form-error';
    error.style.cssText = `
        color: #ff6b6b;
        font-size: 0.9rem;
        margin-top: 0.5rem;
        text-align: left;
    `;
    error.textContent = message;
    
    // Remove existing error
    const existingError = input.parentNode.querySelector('.form-error');
    if (existingError) existingError.remove();
    
    input.parentNode.appendChild(error);
    input.style.borderColor = '#ff6b6b';
    
    setTimeout(() => {
        error.style.opacity = '0';
        setTimeout(() => error.remove(), 300);
    }, 3000);
}

// Show form success
function showFormSuccess(input, message) {
    const success = document.createElement('div');
    success.className = 'form-success';
    success.style.cssText = `
        color: var(--color-gold);
        font-size: 0.9rem;
        margin-top: 0.5rem;
        text-align: left;
        animation: fadeIn 0.3s ease;
    `;
    success.textContent = message;
    
    // Remove existing messages
    const existingMessage = input.parentNode.querySelector('.form-error, .form-success');
    if (existingMessage) existingMessage.remove();
    
    input.parentNode.appendChild(success);
    input.style.borderColor = 'var(--color-gold)';
    
    setTimeout(() => {
        success.style.opacity = '0';
        setTimeout(() => success.remove(), 300);
    }, 3000);
}

// Particle system enhancement
function initParticleSystem() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Create additional particles
    for (let i = 6; i <= 15; i++) {
        const particle = document.createElement('div');
        particle.className = `particle particle-${i}`;
        
        // Random properties
        const size = Math.random() * 3 + 1;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 4 + 3;
        const color = Math.random() > 0.5 ? 'var(--color-gold)' : 'var(--color-blue)';
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            top: ${top}%;
            left: ${left}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
            background: ${color};
        `;
        
        document.querySelector('.hero-particles').appendChild(particle);
    }
}

// Custom cursor effects (optional)
function initCursorEffects() {
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--color-gold);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s, background 0.3s;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });
        
        // Change cursor on hover
        const hoverElements = document.querySelectorAll('a, button, .feature-box, .project-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.background = 'rgba(212, 175, 55, 0.2)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.background = 'transparent';
            });
        });
    }
}

// Loading optimization
function initLoadingOptimization() {
    // Preload critical images
    const criticalImages = [
        'logo.jpg',
        'hero-poster.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Lazy load non-critical images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Performance optimization
window.addEventListener('load', function() {
    // Remove loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                // Trigger initial animations
                document.body.classList.add('loaded');
            }, 500);
        }, 500);
    }
    
    // Initialize service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
});

// Performance monitoring
if ('performance' in window) {
    // Report loading performance
    window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    });
}

// Error tracking
window.addEventListener('error', function(e) {
    console.error('Website error:', e.error);
    // In production, you would send this to an error tracking service
});

// Keyboard navigation enhancement
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.querySelector('#nav-menu');
        const toggle = document.querySelector('#mobile-menu-toggle');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            toggle.classList.remove('active');
        }
    }
    
    // Tab key navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// Remove keyboard navigation class on mouse click
document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

        // Loading screen
        window.addEventListener('load', function() {
            const loadingScreen = document.getElementById('loading-screen');
            const loadingProgress = document.querySelector('.loading-progress');

            // Simulate loading progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        loadingScreen.style.opacity = '0';
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                        }, 500);
                    }, 500);
                }
                loadingProgress.style.width = progress + '%';
            }, 100);
        });

        // Smooth scrolling for navigation links
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

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.getElementById('nav-menu');

        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Back to top button
        const backToTopBtn = document.getElementById('back-to-top');

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.feature-box, .project-card, .vision-card, .mission-card, .footer').forEach(el => {
            observer.observe(el);
        });

        // Parallax effect for hero particles
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            document.querySelectorAll('.particle').forEach((particle, index) => {
                const speed = (index + 1) * 0.1;
                particle.style.transform = `translateY(${rate * speed}px)`;
            });
        });

        // Header scroll effect
        window.addEventListener('scroll', function() {
            const header = document.getElementById('main-header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        document.querySelector('.newsletter-btn')?.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.previousElementSibling.value;
            if (email) {
                alert('Thank you for subscribing! We\'ll keep you updated on our latest developments.');
                this.previousElementSibling.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
        // Animate numbers on scroll
// Animate numbers on scroll
function animateNumbersOnScroll() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = entry.target;
                const count = parseFloat(number.getAttribute('data-count'));
                animateNumber(number, count);
                observer.unobserve(number);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(number => observer.observe(number));
}

function animateNumber(element, target) {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
            element.style.animation = 'countUp 0.5s ease-out';
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Add hover effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.project-icon');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.project-icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    animateNumbersOnScroll();
    
    // Add scroll animations
    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease';
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => observer.observe(element));
});

// Project navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card-minimal');
    const navDots = document.querySelectorAll('.nav-dot');
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');
    let currentProject = 0;

    // Update active project
    function updateActiveProject(index) {
        // Update project cards
        projectCards.forEach((card, i) => {
            card.style.opacity = i === index ? '1' : '0.6';
            card.style.transform = i === index ? 'translateY(-8px)' : 'translateY(0)';
        });
        
        // Update navigation dots
        navDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentProject = index;
    }

    // Navigation dot click
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateActiveProject(index);
        });
    });

    // Previous button
    prevBtn.addEventListener('click', () => {
        let newIndex = currentProject - 1;
        if (newIndex < 0) newIndex = projectCards.length - 1;
        updateActiveProject(newIndex);
    });

    // Next button
    nextBtn.addEventListener('click', () => {
        let newIndex = currentProject + 1;
        if (newIndex >= projectCards.length) newIndex = 0;
        updateActiveProject(newIndex);
    });

    // Auto-rotate projects every 8 seconds
    setInterval(() => {
        let newIndex = currentProject + 1;
        if (newIndex >= projectCards.length) newIndex = 0;
        updateActiveProject(newIndex);
    }, 8000);

    // Project hover effects
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
        });
    });

    // Initialize first project as active
    updateActiveProject(0);
});

// Project detail modal functionality
function showProjectDetails(projectId) {
    // You can implement a modal or expandable section here
    alert(`Viewing details for ${projectId} project. This would open a detailed modal in production.`);
}

// Back to Top functionality
document.getElementById('back-to-top').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// World-class marquee initialization
function initWorldClassMarquee() {
    const track = document.querySelector('.marquee-scene .wc-track');
    const scene = document.querySelector('.marquee-scene');
    const cards = document.querySelectorAll('.marquee-scene .wc-card');
    if (!track || !scene || cards.length === 0) return;

    let currentIndex = 0;
    let paused = false;
    const sceneWidth = scene.offsetWidth; // full width of scene
    const interval = 4000; // milliseconds per card

    // Show specific card
    function showCard(index) {
        cards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index) card.classList.add('active');
        });
        const offset = -index * sceneWidth;
        track.style.transform = `translateX(${offset}px)`;
        currentIndex = index;
    }

    // Initialize first card
    showCard(0);

    // Auto-advance cards
    let autoAdvance = setInterval(() => {
        if (!paused) {
            const nextIndex = (currentIndex + 1) % cards.length;
            showCard(nextIndex);
        }
    }, interval);

    // Pause/play control
    const toggle = document.querySelector('.wc-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            paused = !paused;
            toggle.setAttribute('aria-pressed', String(paused));
            toggle.innerHTML = paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
        });
    }

    // Pause on hover/focus for accessibility
    scene.addEventListener('mouseenter', () => paused = true);
    scene.addEventListener('mouseleave', () => paused = false);
    scene.addEventListener('focusin', () => paused = true);
    scene.addEventListener('focusout', () => paused = false);

    // Keyboard navigation
    scene.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') showCard((currentIndex - 1 + cards.length) % cards.length);
        if (e.key === 'ArrowRight') showCard((currentIndex + 1) % cards.length);
    });
}

// Auto-run marquee after DOM ready
document.addEventListener('DOMContentLoaded', initWorldClassMarquee);

// Leadership Carousel Functionality
function initCarousel() {s
    const carousels = document.querySelectorAll('.leader-carousel');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        const indicators = carousel.querySelectorAll('.carousel-indicator');
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        // Update carousel position
        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('current', index === currentIndex);
            });
        }
        
        // Next slide
        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }
        
        // Previous slide
        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }
        
        // Go to specific slide
        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }
        
        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });
        
        // Auto-play (optional)
        let autoplayInterval = setInterval(nextSlide, 5000);
        
        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(nextSlide, 5000);
        });
        
        // Keyboard navigation
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });
        
        // Make carousel focusable
        carousel.setAttribute('tabindex', '0');
        
        // Initialize
        updateCarousel();
    });
}

// Card animation for product highlight
function initCardAnimation() {
    const cardImage = document.querySelector('.card-image');
    if (cardImage) {
        // Add entrance animation
        cardImage.style.opacity = '0';
        cardImage.style.transform = 'translateY(50px)';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'all 0.8s ease-out';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(cardImage);
        
        // Add subtle floating animation
        let floatDirection = 1;
        setInterval(() => {
            const currentTransform = cardImage.style.transform;
            const translateY = floatDirection * 5;
            cardImage.style.transform = `translateY(${translateY}px)`;
            floatDirection *= -1;
        }, 3000);
    }
}

// Newsletter form submission
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    
    // Here you would typically send the email to your server
    alert('Thank you for subscribing to CPace Technologies newsletter!');
    this.reset();
}); 

document.querySelectorAll(".wc-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -15;
    const rotateY = ((x / rect.width) - 0.5) * 15;

    card.style.transform =
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0)";
  });
});

window.addEventListener("scroll", () => {
  document.querySelectorAll(".wc-card").forEach(card => {
    const depth = card.dataset.depth;
    const offset = window.scrollY * depth;
    card.style.transform += ` translateY(${offset * 0.05}px)`;
  });
});

gsap.registerPlugin(ScrollTrigger);

const rows = document.querySelectorAll(".marquee__row");
const noiseCanvas = document.querySelector(".noise-canvas");
const ctx = noiseCanvas.getContext("2d");

let scrollVelocity = 0;
let lastScrollY = window.scrollY;
let snapTimeout;

// ---------- Helpers ----------
function baseSpeed() {
  if (window.innerWidth < 768) return 30;
  if (window.innerWidth < 1200) return 40;
  return 50;
}

function getDirection(row) {
  if (window.innerWidth < 768) return -1;
  return row.dataset.direction === "right" ? 1 : -1;
}

// ---------- Scroll velocity ----------
window.addEventListener("scroll", () => {
  const delta = window.scrollY - lastScrollY;
  scrollVelocity = gsap.utils.clamp(-3, 3, delta * 0.08);
  lastScrollY = window.scrollY;

  clearTimeout(snapTimeout);
  snapTimeout = setTimeout(() => {
    gsap.to(rows, {
      timeScale: 1,
      duration: 0.6,
      ease: "expo.out"
    });
  }, 120);
});

// ---------- Marquee rows ----------
rows.forEach((row, index) => {
  const track = row.querySelector(".marquee__track");
  let direction = getDirection(row);

  let tween = gsap.to(track, {
    xPercent: direction * -50,
    duration: baseSpeed() + index * 6,
    repeat: -1,
    ease: "none"
  });

  // Scroll-scrub influence
  ScrollTrigger.create({
    trigger: row,
    start: "top bottom",
    end: "bottom top",
    scrub: true,
    onUpdate: self => {
      const drift = Math.sin(Date.now() * 0.0005 + index) * 0.05;
      tween.timeScale(1 + scrollVelocity + drift + self.progress * 0.3);
    }
  });

  // Premium hover slow-down
  row.addEventListener("mouseenter", () => {
    gsap.to(tween, {
      timeScale: 0.25,
      duration: 0.5,
      ease: "expo.out"
    });
  });

  row.addEventListener("mouseleave", () => {
    gsap.to(tween, {
      timeScale: 1,
      duration: 0.8,
      ease: "expo.inOut"
    });
  });

  // Per-image magnetism
  track.querySelectorAll("img").forEach(img => {
    img.addEventListener("mousemove", e => {
      const r = img.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;

      gsap.to(img, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.4,
        ease: "power3.out"
      });
    });

    img.addEventListener("mouseleave", () => {
      gsap.to(img, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "expo.out"
      });
    });
  });

  // Resize recalibration + direction morph
  window.addEventListener("resize", () => {
    direction = getDirection(row);
    tween.kill();

    tween = gsap.to(track, {
      xPercent: direction * -50,
      duration: baseSpeed() + index * 6,
      repeat: -1,
      ease: "none"
    });
  });
});

// ---------- Noise overlay ----------
function resizeNoise() {
  noiseCanvas.width = window.innerWidth;
  noiseCanvas.height = window.innerHeight;
}
resizeNoise();
window.addEventListener("resize", resizeNoise);

function drawNoise() {
  const imgData = ctx.createImageData(
    noiseCanvas.width,
    noiseCanvas.height
  );
  const buffer = imgData.data;

  for (let i = 0; i < buffer.length; i += 4) {
    const v = Math.random() * 255;
    buffer[i] = v;
    buffer[i + 1] = v;
    buffer[i + 2] = v;
    buffer[i + 3] = 15;
  }

  ctx.putImageData(imgData, 0, 0);
  requestAnimationFrame(drawNoise);
}
drawNoise();

// Project Roadmap JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for animations
    const phases = document.querySelectorAll('.roadmap-phase');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.1
    });
    
    phases.forEach(phase => {
        phase.style.animationPlayState = 'paused';
        observer.observe(phase);
    });
    
    // Auto pause videos when not in view
    const videos = document.querySelectorAll('.video-container video');
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (!entry.isIntersecting && !video.paused) {
                video.pause();
            }
        });
    }, {
        threshold: 0.5
    });
    
    videos.forEach(video => {
        videoObserver.observe(video);
    });
    
    // Smooth scroll for CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                // Smooth scroll to contact section
                const contactSection = document.querySelector('section.contact');
                if (contactSection) {
                    contactSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// World-Class Marquee Controller
class WorldClassMarquee {
    constructor() {
        this.scene = document.querySelector('.marquee-scene');
        this.track = document.querySelector('.wc-track');
        this.cards = document.querySelectorAll('.wc-card');
        this.isPaused = false;
        
        // Clone cards for seamless looping
        this.setupSeamlessLoop();
        
        // Initialize interactions
        this.init();
    }
    
    setupSeamlessLoop() {
        // Clone all cards and append to track for seamless loop
        const cardClones = [];
        this.cards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            cardClones.push(clone);
        });
        
        // Append clones to the track
        cardClones.forEach(clone => {
            this.track.appendChild(clone);
        });
    }
    
    init() {
        // Card click/tap handlers
        this.cards.forEach(card => {
            card.addEventListener('click', (e) => this.handleCardClick(e, card));
            
            // Keyboard navigation
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCardClick(e, card);
                }
            });
            
            // Touch feedback
            card.addEventListener('touchstart', () => {
                card.style.transform = 'translateY(-4px) scale(1.01)';
            }, { passive: true });
            
            card.addEventListener('touchend', () => {
                card.style.transform = '';
            }, { passive: true });
        });
        
        // Pause/Resume on hover (desktop)
        this.scene.addEventListener('mouseenter', () => {
            this.isPaused = true;
            this.track.style.animationPlayState = 'paused';
        });
        
        this.scene.addEventListener('mouseleave', () => {
            this.isPaused = false;
            this.track.style.animationPlayState = 'running';
        });
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Reduced motion preference
        this.handleReducedMotion();
    }
    
    handleCardClick(event, card) {
        event.preventDefault();
        
        // Visual feedback
        card.style.transform = 'translateY(-2px) scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
        // Get card data
        const title = card.querySelector('h3').textContent;
        const link = card.querySelector('.wc-cta').getAttribute('href');
        
        // Log interaction (replace with your analytics)
        console.log(`Card clicked: ${title} -> ${link}`);
        
        // Navigate after animation
        setTimeout(() => {
            window.location.href = link;
        }, 300);
    }
    
    handleResize() {
        // Reset animation to prevent visual glitches
        const currentTransform = getComputedStyle(this.track).transform;
        this.track.style.animation = 'none';
        
        // Force reflow
        void this.track.offsetWidth;
        
        // Restart animation
        this.track.style.animation = '';
        this.track.style.animationPlayState = this.isPaused ? 'paused' : 'running';
    }
    
    handleReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (mediaQuery.matches) {
            // Replace animation with static layout
            this.track.style.animation = 'none';
            this.track.style.transform = 'none';
            this.track.style.flexWrap = 'wrap';
            this.track.style.justifyContent = 'center';
            
            // Remove clones
            const clones = this.track.querySelectorAll('[aria-hidden="true"]');
            clones.forEach(clone => clone.remove());
        }
        
        // Listen for changes
        mediaQuery.addEventListener('change', (e) => {
            if (e.matches) {
                this.track.style.animation = 'none';
                this.track.style.transform = 'none';
                this.track.style.flexWrap = 'wrap';
                this.track.style.justifyContent = 'center';
                
                const clones = this.track.querySelectorAll('[aria-hidden="true"]');
                clones.forEach(clone => clone.remove());
            } else {
                this.track.style.animation = '';
                this.track.style.flexWrap = 'nowrap';
                this.track.style.justifyContent = 'flex-start';
                this.setupSeamlessLoop();
            }
        });
    }
    
    // Control methods
    play() {
        this.isPaused = false;
        this.track.style.animationPlayState = 'running';
    }
    
    pause() {
        this.isPaused = true;
        this.track.style.animationPlayState = 'paused';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const marquee = new WorldClassMarquee();
    
    // Optional: Expose to global scope for control
    window.WorldClassMarquee = marquee;
});

/* ===============================
   MOMENTUM DRAG SLIDER
=============================== */

const slider = document.getElementById("slider");

let isDown=false;
let startX;
let scrollLeft;
let velocity=0;
let raf;

slider.addEventListener("mousedown",e=>{
  isDown=true;
  startX=e.pageX-slider.offsetLeft;
  scrollLeft=slider.scrollLeft;
  cancelAnimationFrame(raf);
});

slider.addEventListener("mouseleave",()=>isDown=false);
slider.addEventListener("mouseup",()=>{
  isDown=false;
  momentum();
});

slider.addEventListener("mousemove",e=>{
  if(!isDown)return;
  const x=e.pageX-slider.offsetLeft;
  const walk=(x-startX)*2;
  const prev=slider.scrollLeft;
  slider.scrollLeft=scrollLeft-walk;
  velocity=slider.scrollLeft-prev;
});

/* Momentum physics */

function momentum(){
  slider.scrollLeft+=velocity;
  velocity*=0.95;
  if(Math.abs(velocity)>0.5){
    raf=requestAnimationFrame(momentum);
  } else{
    snapToCenter();
  }
}

/* ===============================
   SNAP TO CENTER
=============================== */

function snapToCenter(){
  const cards=[...document.querySelectorAll(".wc-card")];
  const center=window.innerWidth/2;

  let closest, minDist=Infinity;

  cards.forEach(card=>{
    const rect=card.getBoundingClientRect();
    const cardCenter=rect.left+rect.width/2;
    const dist=Math.abs(center-cardCenter);
    if(dist<minDist){
      minDist=dist;
      closest=card;
    }
  });

  slider.scrollBy({
    left:closest.getBoundingClientRect().left
        +closest.offsetWidth/2
        -center,
    behavior:"smooth"
  });
}

/* ===============================
   SCROLL REVEAL
=============================== */

const scrollRevealObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("visible");
    }
  });
},{threshold:.25});

document.querySelectorAll(".reveal")
.forEach(el=>scrollRevealObserver.observe(el));

/* ===============================
   DYNAMIC LIGHT FOLLOW
=============================== */

document.querySelectorAll(".wc-card")
.forEach(card=>{
  card.addEventListener("mousemove",e=>{
    const rect=card.getBoundingClientRect();
    const x=e.clientX-rect.left;
    const y=e.clientY-rect.top;

    card.style.setProperty(
      "--light",
      `${x}px ${y}px`
    );
  });
});
