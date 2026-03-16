// ========== SCROLL ANIMATIONS AMÉLIORÉES ==========
const animatedElements = document.querySelectorAll('.animate');

let animationFrame;
function checkScroll() {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    
    animationFrame = requestAnimationFrame(() => {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
                element.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
    });
}

window.addEventListener('scroll', checkScroll, { passive: true });
checkScroll();

// ========== ANIMATE STATS ==========
function animateStats() {
    document.querySelectorAll('.stat-number[data-count]').forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;
        
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

// Animate stats when hero section is visible
const heroSection = document.querySelector('.hero');
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(animateStats, 500);
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5, rootMargin: '0px' });

if (heroSection) {
    heroObserver.observe(heroSection);
}

// ========== ANIMATE SKILL BARS ==========
function animateSkills() {
    document.querySelectorAll('.skill-progress').forEach(progress => {
        const width = progress.getAttribute('data-width');
        progress.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        progress.style.width = width + '%';
    });
}

const skillsSection = document.querySelector('.skills-grid');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(animateSkills, 300);
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5, rootMargin: '0px' });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// ========== ANIMATION POUR LES CARTES AU SCROLL ==========
const cards = document.querySelectorAll('.project-card, .tool-card, .skill-card-modern');

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100); // Délai progressif
        }
    });
}, { threshold: 0.1, rootMargin: '0px' });

cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    cardObserver.observe(card);
});