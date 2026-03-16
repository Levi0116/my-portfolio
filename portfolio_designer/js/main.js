
// Initialiser
document.addEventListener('DOMContentLoaded', () => {
    const transition = new SimpleTransition();
    
    // Pour utiliser après la transition
    document.addEventListener('transitionComplete', () => {
        console.log('Transition terminée - Affichage du portfolio');
        // Ajouter ici le code pour initialiser votre portfolio
    });
});

// ========== CUSTOM CURSOR ANIMATION ==========
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let dotX = 0, dotY = 0;

// Désactiver le curseur personnalisé sur mobile
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const speed = 0.2; // Augmenté pour plus de fluidité
        const dotSpeed = 0.35; // Augmenté pour plus de fluidité
        
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        
        dotX += (mouseX - dotX) * dotSpeed;
        dotY += (mouseY - dotY) * dotSpeed;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
        
        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-item, .contact-item, .filter-btn, .social-link, .tab-btn, .tool-item, .gallery-more-btn, .gallery-nav, .gallery-close, .gallery-indicator, .gallery-thumbnail, .skill-card, .tool-card, .skill-card-modern');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-grow');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-grow');
        });
    });
} else {
    cursor.style.display = 'none';
    cursorDot.style.display = 'none';
}

// ========== SCROLL PROGRESS & BACK TO TOP ==========
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Scroll progress - plus fluide
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + '%';
            scrollProgress.style.transition = 'width 0.2s ease-out';

            // Back to top button
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }

            // Navbar scroll effect
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Active nav link
            const sections = document.querySelectorAll('section[id]');
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });

            ticking = false;
        });

        ticking = true;
    }
});

// Back to top click handler
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

// ========== MOBILE MENU ==========
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ========== PROJECT FILTER ==========
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        // Filter projects
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========== CV BUTTON HANDLERS ==========
const cvButtons = document.querySelectorAll('#cvButton, #heroCvButton, #footerCvButton');
    
cvButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        // Remplacez 'assets/cv.pdf' par le chemin de votre CV
        window.open('assets/CV_KOUAME_Levi_fr.pdf', '_blank');
    });
});

// ========== CONTACT FORM ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            alert('Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ========== INITIALIZE ANIMATIONS ==========
document.addEventListener('DOMContentLoaded', () => {
    // Add animation delay to project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Add animation delay to tool items
    document.querySelectorAll('.tool-item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.05}s`;
    });
});

// ========== TOOLS CAROUSEL - VERSION CORRIGÉE ==========
class ToolsCarousel {
    constructor() {
        this.carousel = document.getElementById('toolsCarousel');
        this.prevBtn = document.getElementById('toolsPrev');
        this.nextBtn = document.getElementById('toolsNext');
        this.dotsContainer = document.getElementById('toolsDots');
        this.categoryBtns = document.querySelectorAll('.category-btn');
        this.toggleBtn = document.getElementById('toolsToggle');
        this.noResults = document.getElementById('toolsNoResults');
        
        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.allCards = document.querySelectorAll('.tool-card');
        this.visibleCards = Array.from(this.allCards);
        this.totalCards = this.visibleCards.length;
        
        this.autoPlayInterval = null;
        this.flipInterval = null;
        this.isGridView = false;
        this.isAnimating = false;
        this.transitionDuration = 500; // ms
        
        this.init();
    }
    
    init() {
        // S'assurer que le carousel a une largeur définie
        if (this.carousel) {
            this.carousel.style.display = 'flex';
            this.carousel.style.flexWrap = 'nowrap';
        }
        
        this.createDots();
        this.updateCarousel();
        this.bindEvents();
        this.startAutoPlay();
        this.startAutoFlip();
        
        // Initialiser les indices pour l'animation
        document.querySelectorAll('.tool-card').forEach((card, index) => {
            card.style.setProperty('--card-index', index);
        });

        // Optimisation des performances
        if (this.carousel) {
            this.carousel.style.willChange = 'transform';
        }
    }
    
    getCardsPerView() {
        if (this.isGridView) return this.totalCards;
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        if (window.innerWidth <= 1200) return 3;
        return 4;
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        if (this.isGridView || this.totalCards === 0) {
            this.dotsContainer.innerHTML = '';
            return;
        }
        
        const totalSlides = Math.ceil(this.totalCards / this.cardsPerView);
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.dataset.index = i;
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    updateCarousel() {
        if (!this.carousel) return;
        
        if (this.isGridView) {
            // Mode grille
            this.carousel.classList.add('grid-view');
            this.carousel.style.transform = 'none';
            if (this.prevBtn) this.prevBtn.style.display = 'none';
            if (this.nextBtn) this.nextBtn.style.display = 'none';
            if (this.dotsContainer) this.dotsContainer.style.display = 'none';
            if (this.toggleBtn) {
                this.toggleBtn.innerHTML = '<i class="fas fa-undo"></i> Revenir au défilement';
                this.toggleBtn.classList.add('grid-mode');
            }
            
            this.stopAutoPlay();
            this.stopAutoFlip();
            
            document.querySelectorAll('.tool-card-inner').forEach(card => {
                card.classList.remove('flipped');
            });
        } else {
            // Mode carousel
            this.carousel.classList.remove('grid-view');
            if (this.prevBtn) this.prevBtn.style.display = 'flex';
            if (this.nextBtn) this.nextBtn.style.display = 'flex';
            if (this.dotsContainer) this.dotsContainer.style.display = 'flex';
            if (this.toggleBtn) {
                this.toggleBtn.innerHTML = '<i class="fas fa-th-large"></i> Afficher tout';
                this.toggleBtn.classList.remove('grid-mode');
            }
            
            const maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
            this.currentIndex = Math.min(this.currentIndex, maxIndex);
            
            // Calcul de la largeur d'une carte en pourcentage
            const cardWidth = 100 / this.cardsPerView;
            const translateX = - (this.currentIndex * cardWidth);
            
            // Appliquer la transformation avec transition
            this.carousel.style.transition = `transform ${this.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            this.carousel.style.transform = `translateX(${translateX}%)`;
            
            // Update dots
            if (this.dotsContainer) {
                const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
                const currentDotIndex = Math.floor(this.currentIndex / this.cardsPerView);
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentDotIndex);
                });
            }
            
            this.startAutoPlay();
            this.startAutoFlip();
        }
    }
    
    toggleView() {
        this.isGridView = !this.isGridView;
        this.cardsPerView = this.getCardsPerView();
        this.createDots();
        this.updateCarousel();
    }
    
    startAutoFlip() {
        // SUPPRESSION DU FLIP AUTOMATIQUE AU SURVOL
        // Cette fonction ne fait plus rien pour désactiver le flip automatique
        return;
    }
    
    goToSlide(index) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        this.currentIndex = index * this.cardsPerView;
        this.updateCarousel();
        this.resetAutoPlay();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, this.transitionDuration);
    }
    
    nextSlide() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        const maxIndex = this.totalCards - this.cardsPerView;
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.updateCarousel();
        
        this.resetAutoPlay();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, this.transitionDuration);
    }
    
    prevSlide() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.totalCards - this.cardsPerView;
        }
        this.updateCarousel();
        
        this.resetAutoPlay();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, this.transitionDuration);
    }
    
    filterByCategory(category) {
        const cards = document.querySelectorAll('.tool-card');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const cardCategory = card.dataset.category;
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        this.visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');
        this.totalCards = this.visibleCards.length;
        
        if (this.totalCards === 0) {
            if (this.noResults) this.noResults.style.display = 'block';
            if (this.carousel) this.carousel.style.display = 'none';
            if (this.dotsContainer) this.dotsContainer.style.display = 'none';
            if (this.prevBtn) this.prevBtn.style.display = 'none';
            if (this.nextBtn) this.nextBtn.style.display = 'none';
        } else {
            if (this.noResults) this.noResults.style.display = 'none';
            if (this.carousel) this.carousel.style.display = 'flex';
            this.currentIndex = 0;
            this.cardsPerView = this.getCardsPerView();
            this.createDots();
            this.updateCarousel();
        }
    }
    
    bindEvents() {
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());
        if (this.toggleBtn) this.toggleBtn.addEventListener('click', () => this.toggleView());
        
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterByCategory(btn.dataset.category);
            });
        });
        
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.cardsPerView = this.getCardsPerView();
                this.createDots();
                this.updateCarousel();
            }, 150);
        });
        
        // Pause auto-play on hover - mais sans affecter le flip
        if (this.carousel) {
            this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        if (!this.isGridView && this.totalCards > 0) {
            this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
        }
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    stopAutoFlip() {
        if (this.flipInterval) {
            clearInterval(this.flipInterval);
            this.flipInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// ========== SKILLS CAROUSEL WITH SIMPLE SCROLL ==========
class SkillsCarousel {
    constructor() {
        this.carousel = document.getElementById('skillsCarousel');
        this.prevBtn = document.getElementById('skillsPrev');
        this.nextBtn = document.getElementById('skillsNext');
        this.dotsContainer = document.getElementById('skillsDots');
        this.categoryBtns = document.querySelectorAll('.skill-cat-btn');
        this.toggleBtn = document.getElementById('skillsToggle');
        this.noResults = document.getElementById('skillsNoResults');
        
        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.allCards = document.querySelectorAll('.skill-card-modern');
        this.visibleCards = Array.from(this.allCards);
        this.totalCards = this.visibleCards.length;
        
        this.autoPlayInterval = null;
        this.isGridView = false;
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.updateCarousel();
        this.bindEvents();
        this.startAutoPlay();
        
        // Initialiser les indices pour l'animation
        document.querySelectorAll('.skill-card-modern').forEach((card, index) => {
            card.style.setProperty('--card-index', index);
        });
    }
    
    getCardsPerView() {
        if (this.isGridView) return this.totalCards;
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1200) return 2;
        return 3;
    }
    
    createDots() {
        if (this.isGridView || this.totalCards === 0) {
            this.dotsContainer.innerHTML = '';
            return;
        }
        
        const totalSlides = Math.ceil(this.totalCards / this.cardsPerView);
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.dataset.index = i;
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    updateCarousel() {
        if (this.isGridView) {
            // Mode grille
            this.carousel.classList.add('grid-view');
            this.carousel.style.transform = 'none';
            this.prevBtn.style.display = 'none';
            this.nextBtn.style.display = 'none';
            this.dotsContainer.style.display = 'none';
            this.toggleBtn.innerHTML = '<i class="fas fa-undo"></i> Revenir au défilement';
            this.toggleBtn.classList.add('grid-mode');
            
            // Arrêter le défilement automatique
            this.stopAutoPlay();
        } else {
            // Mode carousel
            this.carousel.classList.remove('grid-view');
            this.prevBtn.style.display = 'flex';
            this.nextBtn.style.display = 'flex';
            this.dotsContainer.style.display = 'flex';
            this.toggleBtn.innerHTML = '<i class="fas fa-th-large"></i> Afficher tout';
            this.toggleBtn.classList.remove('grid-mode');
            
            const maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
            this.currentIndex = Math.min(this.currentIndex, maxIndex);
            
            const translateX = - (this.currentIndex * (100 / this.cardsPerView));
            this.carousel.style.transform = `translateX(${translateX}%)`;
            
            // Update dots
            const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
            const currentDotIndex = Math.floor(this.currentIndex / this.cardsPerView);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentDotIndex);
            });
            
            // Redémarrer le défilement automatique
            this.startAutoPlay();
        }
    }
    
    toggleView() {
        this.isGridView = !this.isGridView;
        this.cardsPerView = this.getCardsPerView();
        this.createDots();
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = index * this.cardsPerView;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    nextSlide() {
        const maxIndex = this.totalCards - this.cardsPerView;
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.totalCards - this.cardsPerView;
        }
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    filterByCategory(category) {
        const cards = document.querySelectorAll('.skill-card-modern');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const cardCategory = card.dataset.skillCat;
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        this.visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');
        this.totalCards = this.visibleCards.length;
        
        if (this.totalCards === 0) {
            this.noResults.style.display = 'block';
            this.carousel.style.display = 'none';
            this.dotsContainer.style.display = 'none';
            this.prevBtn.style.display = 'none';
            this.nextBtn.style.display = 'none';
        } else {
            this.noResults.style.display = 'none';
            this.carousel.style.display = 'flex';
            this.currentIndex = 0;
            this.cardsPerView = this.getCardsPerView();
            this.createDots();
            this.updateCarousel();
        }
    }
    
    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.toggleBtn.addEventListener('click', () => this.toggleView());
        
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterByCategory(btn.dataset.skillCat);
            });
        });
        
        window.addEventListener('resize', () => {
            this.cardsPerView = this.getCardsPerView();
            this.createDots();
            this.updateCarousel();
        });
        
        // Pause auto-play on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        if (!this.isGridView && this.totalCards > 0) {
            this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
        }
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// Initialize carousels
document.addEventListener('DOMContentLoaded', () => {
    // Supprimer les anciens gestionnaires d'événements des tabs
    const oldTabButtons = document.querySelectorAll('.tab-btn');
    oldTabButtons.forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });
    
    // Initialiser les nouveaux carrousels
    if (document.getElementById('toolsCarousel')) {
        new ToolsCarousel();
    }
    if (document.getElementById('skillsCarousel')) {
        new SkillsCarousel();
    }
});

