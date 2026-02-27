// Project Filtering Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.getAttribute('data-filter');
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Enhanced Roadmap Interactivity
    const roadmapPhases = document.querySelectorAll('.roadmap-phase');
    
    roadmapPhases.forEach((phase, index) => {
        // Add hover effect with video interaction
        phase.addEventListener('mouseenter', () => {
            const video = phase.querySelector('video');
            if (video) {
                video.play().catch(() => {
                    // Autoplay might be blocked
                });
            }
        });

        phase.addEventListener('mouseleave', () => {
            const video = phase.querySelector('video');
            if (video) {
                video.pause();
            }
        });

        // Add click interaction for better engagement
        phase.addEventListener('click', function() {
            const video = this.querySelector('video');
            if (video) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        });

        // Intersection Observer for staggered animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.2 });

        observer.observe(phase);
    });

    // Enhanced Feature Card Interactivity
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            // Add stagger effect to other cards
            featureCards.forEach((otherCard, otherIndex) => {
                if (otherIndex !== index) {
                    otherCard.style.opacity = '0.7';
                }
            });
        });

        card.addEventListener('mouseleave', function() {
            featureCards.forEach((otherCard) => {
                otherCard.style.opacity = '1';
            });
        });
    });

    // Smooth scroll for roadmap sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// Add gradient animation to section header
const style = document.createElement('style');
style.textContent = `
    @keyframes gradientShift {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .section-header h2 {
        background: linear-gradient(90deg, var(--white), rgba(212, 175, 55, 0.6), var(--white));
        background-size: 200% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradientShift 3s ease infinite;
    }

    .roadmap-phase {
        animation: fadeInUp 0.8s ease forwards;
    }
`;
document.head.appendChild(style);

