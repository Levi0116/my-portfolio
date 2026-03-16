// ========== CODE LINES ANIMATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Animation des lignes de code
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach((line, index) => {
        line.style.animation = `slideInCode 0.5s ease forwards ${index * 0.1}s`;
    });
});

// ========== STATS COUNTER ==========
function animateStats() {
    const stats = document.querySelectorAll('.stat-number[data-count]');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 20);
    });
}

// Observer pour lancer l'animation quand la section est visible
const heroSection = document.querySelector('.hero');
if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateStats, 500);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(heroSection);
}

// ========== PARALLAX EFFECT ==========
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    
    if (hero) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// ========== CARD HOVER EFFECTS ==========
document.querySelectorAll('.expertise-card, .project-card, .innovation-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// ========== SCROLL REVEAL FOR TIMELINE ==========
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animation des années
            const yearElement = entry.target.querySelector('.timeline-year');
            if (yearElement) {
                yearElement.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    yearElement.style.transform = 'scale(1)';
                }, 300);
            }
        }
    });
}, { threshold: 0.3 });

timelineItems.forEach(item => {
    timelineObserver.observe(item);
});