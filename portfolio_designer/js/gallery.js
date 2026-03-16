// ========== GALLERY MANAGEMENT - VERSION AGRANDIE ==========
class GalleryManager {
    constructor() {
        this.galleries = {};
        this.currentGallery = null;
        this.currentSlide = 0;
        this.modal = null;
        this.slideInterval = null;
        this.autoSlideSpeed = 4500; // Plus lent pour mieux voir les grandes images
        this.animationDirection = 'right';
        this.imageZoom = 1; // Niveau de zoom actuel
        this.maxZoom = 3; // Zoom maximum
        this.minZoom = 0.5; // Zoom minimum
        this.isFullscreen = false;
        this.imageLoadStates = new Map(); // Suivi du chargement des images
        this.init();
    }

    init() {
        this.createModal();
        this.loadGalleries();
        this.bindEvents();
        this.createGalleryElements();
    }

    // Créer la modale AGRANDIE
    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'gallery-modal';
        this.modal.innerHTML = `
            <div class="gallery-modal-content">
                <button class="gallery-close" title="Fermer (Échap)">
                    <i class="fas fa-times"></i>
                </button>
                
                <button class="gallery-fullscreen-btn" title="Plein écran (F)">
                    <i class="fas fa-expand"></i>
                </button>
                
                <div class="slide-counter" id="slideCounter"></div>
                
                <div class="gallery-header">
                    <h2 class="gallery-title"></h2>
                    <p class="gallery-description"></p>
                </div>
                
                <div class="gallery-main">
                    <div class="gallery-slider-container">
                        <div class="slide-progress" id="slideProgress"></div>
                        <div class="gallery-slider"></div>
                        
                        <button class="gallery-nav gallery-prev" title="Précédent (←)">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="gallery-nav gallery-next" title="Suivant (→)">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        
                        <div class="gallery-zoom-controls">
                            <button class="gallery-zoom-btn" title="Zoom + (+)" data-action="zoom-in">
                                <i class="fas fa-search-plus"></i>
                            </button>
                            <button class="gallery-zoom-btn" title="Zoom - (-)" data-action="zoom-out">
                                <i class="fas fa-search-minus"></i>
                            </button>
                            <button class="gallery-zoom-btn" title="Réinitialiser zoom (0)" data-action="zoom-reset">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                            <button class="gallery-zoom-btn" title="Ajuster à l'écran (A)" data-action="zoom-fit">
                                <i class="fas fa-expand-arrows-alt"></i>
                            </button>
                        </div>
                        
                        <div class="gallery-image-info">
                            <span class="image-counter"></span>
                            <span class="image-alt"></span>
                        </div>
                        
                        <div class="zoom-indicator" id="zoomIndicator">100%</div>
                    </div>
                    
                    <div class="gallery-details">
                        <h3>Détails du projet</h3>
                        <div class="project-info-content"></div>
                        
                        <div class="project-technologies">
                            <h4>Technologies utilisées</h4>
                            <div class="tech-tags"></div>
                        </div>
                        
                        <div class="project-tools">
                            <h4>Outils</h4>
                            <div class="tool-tags"></div>
                        </div>
                        
                        <div class="gallery-controls-info">
                            <p><small><i class="fas fa-info-circle"></i> Utilisez les flèches ←→, la molette, ou swipez pour naviguer</small></p>
                        </div>
                    </div>
                </div>
                
                <div class="gallery-controls">
                    <div class="gallery-indicators"></div>
                    <div class="gallery-thumbnails"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.modal);
        
        // Événements de la modale
        this.setupModalEvents();
    }

    setupModalEvents() {
        // Fermeture
        this.modal.querySelector('.gallery-close').addEventListener('click', () => this.close());
        
        // Plein écran
        this.modal.querySelector('.gallery-fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());
        
        // Navigation
        this.modal.querySelector('.gallery-prev').addEventListener('click', () => {
            this.stopAutoSlide();
            this.prevSlide();
        });
        
        this.modal.querySelector('.gallery-next').addEventListener('click', () => {
            this.stopAutoSlide();
            this.nextSlide();
        });
        
        // Contrôles de zoom
        this.modal.querySelectorAll('.gallery-zoom-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleZoom(action);
            });
        });
        
        // Navigation clavier améliorée
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;
            
            e.preventDefault();
            
            switch(e.key) {
                case 'Escape':
                    if (this.isFullscreen) {
                        this.toggleFullscreen();
                    } else {
                        this.close();
                    }
                    break;
                    
                case 'ArrowLeft':
                    this.stopAutoSlide();
                    this.prevSlide();
                    break;
                    
                case 'ArrowRight':
                    this.stopAutoSlide();
                    this.nextSlide();
                    break;
                    
                case ' ':
                    e.preventDefault();
                    this.toggleAutoSlide();
                    break;
                    
                case 'f':
                case 'F':
                    this.toggleFullscreen();
                    break;
                    
                case '+':
                case '=':
                    e.preventDefault();
                    this.handleZoom('zoom-in');
                    break;
                    
                case '-':
                case '_':
                    e.preventDefault();
                    this.handleZoom('zoom-out');
                    break;
                    
                case '0':
                    this.handleZoom('zoom-reset');
                    break;
                    
                case 'a':
                case 'A':
                    this.handleZoom('zoom-fit');
                    break;
                    
                case 'Home':
                    this.goToSlide(0);
                    break;
                    
                case 'End':
                    if (this.currentGallery) {
                        this.goToSlide(this.currentGallery.images.length - 1);
                    }
                    break;
            }
        });
        
        // Molette de la souris pour navigation
        this.modal.querySelector('.gallery-slider').addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }, { passive: false });
        
        // Molette de la souris pour zoom
        this.modal.querySelector('.gallery-slider').addEventListener('wheel', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                if (e.deltaY < 0) {
                    this.handleZoom('zoom-in');
                } else {
                    this.handleZoom('zoom-out');
                }
            }
        }, { passive: false });
        
        // Plein écran events
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
            this.adjustImageSizes();
        });
    }

    // Charger les galeries avec détails des projets
    loadGalleries() {
        this.galleries = {
            1: {
                id: 1,
                title: "Application Web de Gestion d'Hôtel",
                description: "Application web complète de gestion d'hôtel avec réservation en ligne, gestion des chambres et tableau de bord administratif.",
                images: [
                    { src: 'images/projets/projet1/1.jpg', alt: 'Interface principale du système' },
                    { src: 'images/projets/projet1/2.jpg', alt: 'Tableau de bord administratif' },
                    { src: 'images/projets/projet1/3.jpg', alt: 'Gestion des réservations' },
                    { src: 'images/projets/projet1/4.jpg', alt: 'Interface client' }
                ],
                details: `<p>Cette application web complète permet la gestion efficace d'un établissement hôtelier avec les fonctionnalités suivantes :</p>
                         <ul>
                             <li>Système de réservation en ligne 24/7</li>
                             <li>Gestion des chambres et des tarifs en temps réel</li>
                             <li>Tableau de bord administratif avec statistiques</li>
                             <li>Gestion des clients et historique des séjours</li>
                             <li>Système de facturation et paiement intégré</li>
                             <li>Notifications automatiques par email</li>
                             <li>Rapports détaillés et analytics</li>
                         </ul>`,
                technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
                tools: ['VS Code', 'Git', 'Postman', 'Figma', 'MongoDB Compass']
            },
            2: {
                id: 2,
                title: "Collection d'Affiches Événementielles",
                description: "Série d'affiches créatives pour différents événements culturels et promotionnels.",
                images: [
                    { src: 'images/projets/projet2/1.jpg', alt: 'affiche' },
                    { src: 'images/projets/projet2/2.jpg', alt: 'affiche' },
                    { src: 'images/projets/projet2/3.jpg', alt: 'affiche' },
                    { src: 'images/projets/projet2/4.jpg', alt: 'affiche' },
                    { src: 'images/projets/projet2/5.jpg', alt: 'affiche' },
                    { src: 'images/projets/projet2/6.jpg', alt: 'affiche' },
                    { src: 'images/projets/projet2/7.jpg', alt: 'affiche' },
                    { src: 'images/projets/projet2/8.jpg', alt: 'affiche' },
                    { src: 'images/projets/projet2/9.jpg', alt: 'affiche' },
                    { src: 'images/projets/projet2/10.jpg', alt: 'affiche' },
                    { src: 'images/projets/projet2/11.jpg', alt: 'affiche' },
                    { src: 'images/projets/projet2/12.jpg', alt: 'affiche' },
                    { src: 'images/projets/projet2/13.jpg', alt: 'affiche' },
                    { src: 'images/projets/projet2/14.jpg', alt: 'affiche' },
                    { src: 'images/projets/projet2/15.jpg', alt: 'affiche' }
                ],
                details: `<p>Collection complète d'affiches événementielles réalisées pour divers clients :</p>
                         <ul>
                             <li>Typographies créatives et expressives</li>
                             <li>Palettes de couleurs audacieuses et contrastées</li>
                             <li>Compositions équilibrées et impactantes</li>
                             <li>Adaptation aux différents supports print</li>
                             <li>Respect des identités visuelles des clients</li>
                         </ul>`,
                technologies: ["Adobe Illustrator", "Photoshop", "Typographie", "Théorie des couleurs"],
                tools: ["Creative Suite", "Procreate", "InDesign"]
            },
            3: {
                id: 3,
                title: "Logos & Identité de Marque",
                description: "Création de logos modernes et de systèmes d'identité visuelle complète.",
                images: [
                    { src: 'images/projets/projet3/1.jpg', alt: 'Logo' },
                    { src: 'images/projets/projet3/2.jpg', alt: 'Logo' },
                    { src: 'images/projets/projet3/3.jpg', alt: 'Logo' },
                    { src: 'images/projets/projet3/4.jpg', alt: 'Logo' },
                    { src: 'images/projets/projet3/5.jpg', alt: 'Logo' },
                    { src: 'images/projets/projet3/6.jpg', alt: 'Logo' },
                    { src: 'images/projets/projet3/7.jpg', alt: 'Logo' },
                    { src: 'images/projets/projet3/8.jpg', alt: 'Logo' },
                    { src: 'images/projets/projet3/9.jpg', alt: 'Logo' },
                    { src: 'images/projets/projet3/10.jpg', alt: 'Logo' },
                    { src: 'images/projets/projet3/11.jpg', alt: 'Logo' },
                    { src: 'images/projets/projet3/12.jpg', alt: 'Logo' },
                    { src: 'images/projets/projet3/13.jpg', alt: 'Logo' }
                ],
                details: `<p>Création complète de systèmes d'identité visuelle pour diverses entreprises :</p>
                         <ul>
                             <li>Recherche et conceptualisation approfondie</li>
                             <li>Création de logotypes uniques et mémorables</li>
                             <li>Développement de guides de style complets</li>
                             <li>Adaptation aux différents supports (print, web, social)</li>
                             <li>Documentation complète de la marque</li>
                         </ul>`,
                technologies: ["Logo Design", "Branding", "Identité Visuelle", "Vectoriel"],
                tools: ["Illustrator", "Figma", "InDesign"]
            },
            
        };
    }

    // Créer les éléments de galerie
    createGalleryElements() {
        document.querySelectorAll('.project-card').forEach((card, index) => {
            const projectId = index + 1;
            const gallery = this.galleries[projectId];
            
            if (gallery) {
                const galleryContainer = card.querySelector('.gallery-container');
                if (galleryContainer) {
                    this.createCollage(galleryContainer, gallery);
                }
                
                // Mettre à jour le bouton "Voir détails"
                const overlayBtn = card.querySelector('.project-overlay .btn');
                if (overlayBtn) {
                    overlayBtn.addEventListener('click', () => this.openGallery(projectId));
                }
            }
        });
    }

    // Créer le collage pour une galerie
    createCollage(container, gallery) {
        const collage = document.createElement('div');
        collage.className = 'gallery-collage';
        collage.dataset.count = Math.min(gallery.images.length, 5);
        
        // Limiter à 5 images maximum pour le collage
        const imagesToShow = gallery.images.slice(0, 5);
        
        imagesToShow.forEach((img, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.index = index;
            
            const imgElement = document.createElement('img');
            imgElement.src = img.src;
            imgElement.alt = img.alt;
            imgElement.loading = 'lazy';
            
            item.appendChild(imgElement);
            collage.appendChild(item);
        });
        
        // Compteur d'images
        if (gallery.images.length > 5) {
            const countBadge = document.createElement('div');
            countBadge.className = 'image-count';
            countBadge.innerHTML = `<i class="fas fa-images"></i> +${gallery.images.length - 5}`;
            collage.appendChild(countBadge);
        }
        
        // Overlay avec bouton
        const overlay = document.createElement('div');
        overlay.className = 'gallery-overlay';
        
        const moreBtn = document.createElement('button');
        moreBtn.className = 'gallery-more-btn';
        moreBtn.innerHTML = '<i class="fas fa-expand"></i> Voir les détails';
        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openGallery(gallery.id);
        });
        
        overlay.appendChild(moreBtn);
        
        container.innerHTML = '';
        container.appendChild(collage);
        container.appendChild(overlay);
        
        // Animation auto slide
        this.setupAutoSlide(collage, imagesToShow);
    }

    // Configuration de l'animation auto slide
    setupAutoSlide(collage, images) {
        let currentIndex = 0;
        
        const autoSlide = () => {
            collage.classList.add('auto-slide');
            
            const items = collage.querySelectorAll('.gallery-item');
            items.forEach((item, index) => {
                item.style.opacity = index === currentIndex ? '1' : '0.3';
                item.style.transform = index === currentIndex ? 'scale(1.05)' : 'scale(1)';
            });
            
            currentIndex = (currentIndex + 1) % items.length;
        };
        
        // Démarrer l'animation
        autoSlide();
        const interval = setInterval(autoSlide, 3000);
        
        // Arrêter au hover
        collage.addEventListener('mouseenter', () => {
            clearInterval(interval);
            const items = collage.querySelectorAll('.gallery-item');
            items.forEach(item => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            });
        });
        
        collage.addEventListener('mouseleave', () => {
            this.setupAutoSlide(collage, images);
        });
    }

    // Événements globaux
    bindEvents() {
        // Swipe pour mobile
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.modal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        });
        
        this.modal.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY);
        });
        
        // Click sur le collage pour ouvrir la galerie
        document.addEventListener('click', (e) => {
            const galleryContainer = e.target.closest('[data-gallery]') || 
                                   e.target.closest('.gallery-container');
            if (galleryContainer && !e.target.closest('.gallery-more-btn')) {
                // Trouver l'ID de la galerie
                const projectCard = galleryContainer.closest('.project-card');
                if (projectCard) {
                    const projectId = Array.from(document.querySelectorAll('.project-card')).indexOf(projectCard) + 1;
                    this.openGallery(projectId);
                }
            }
        });
    }

    handleSwipe(startX, endX, startY, endY) {
        const swipeThreshold = 50;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Vérifier que c'est un swipe horizontal et pas vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                this.stopAutoSlide();
                this.nextSlide();
            } else {
                this.stopAutoSlide();
                this.prevSlide();
            }
        }
    }

    // Ouvrir une galerie
    openGallery(galleryId) {
        const gallery = this.galleries[galleryId];
        if (!gallery) return;
        
        this.currentGallery = gallery;
        this.currentSlide = 0;
        this.imageZoom = 1;
        this.stopAutoSlide();
        
        // Mettre à jour le contenu de la modale
        this.updateModalContent();
        
        // Afficher la modale
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Précharger les images
        this.preloadImages();
        
        // Démarrer le diaporama
        this.startAutoSlide();
        
        // Focus sur la modale pour navigation clavier
        this.modal.focus();
    }

    // Mettre à jour le contenu de la modale
    updateModalContent() {
        // Titre et description
        this.modal.querySelector('.gallery-title').textContent = this.currentGallery.title;
        this.modal.querySelector('.gallery-description').textContent = this.currentGallery.description;
        
        // Slider
        const slider = this.modal.querySelector('.gallery-slider');
        slider.innerHTML = '';
        
        this.currentGallery.images.forEach((img, index) => {
            const slide = document.createElement('div');
            slide.className = 'gallery-slide';
            slide.dataset.index = index;
            
            const imgElement = document.createElement('img');
            imgElement.src = img.src;
            imgElement.alt = img.alt;
            imgElement.className = 'loading';
            imgElement.dataset.originalSrc = img.src;
            
            imgElement.addEventListener('load', () => {
                imgElement.classList.remove('loading');
                imgElement.classList.add('loaded');
                this.imageLoadStates.set(img.src, true);
            });
            
            imgElement.addEventListener('error', () => {
                console.error(`Erreur de chargement: ${img.src}`);
                imgElement.classList.remove('loading');
                imgElement.alt = 'Image non disponible';
            });
            
            slide.appendChild(imgElement);
            slider.appendChild(slide);
        });
        
        // Détails du projet
        this.modal.querySelector('.project-info-content').innerHTML = this.currentGallery.details;
        
        // Technologies
        const techTags = this.modal.querySelector('.tech-tags');
        techTags.innerHTML = '';
        this.currentGallery.technologies.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tech-tag';
            tag.textContent = tech;
            techTags.appendChild(tag);
        });
        
        // Outils
        const toolTags = this.modal.querySelector('.tool-tags');
        toolTags.innerHTML = '';
        this.currentGallery.tools.forEach(tool => {
            const tag = document.createElement('span');
            tag.className = 'tool-tag';
            tag.textContent = tool;
            toolTags.appendChild(tag);
        });
        
        // Mise à jour des contrôles
        this.updateControls();
        
        // Afficher le premier slide
        this.showSlide(this.currentSlide);
    }

    // Mettre à jour les contrôles
    updateControls() {
        // Indicateurs
        const indicators = this.modal.querySelector('.gallery-indicators');
        indicators.innerHTML = '';
        
        this.currentGallery.images.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `gallery-indicator ${index === this.currentSlide ? 'active' : ''}`;
            indicator.dataset.index = index;
            indicator.addEventListener('click', () => {
                this.stopAutoSlide();
                this.goToSlide(index);
            });
            indicators.appendChild(indicator);
        });
        
        // Miniatures
        const thumbnails = this.modal.querySelector('.gallery-thumbnails');
        thumbnails.innerHTML = '';
        
        this.currentGallery.images.forEach((img, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `gallery-thumbnail ${index === this.currentSlide ? 'active' : ''}`;
            thumbnail.dataset.index = index;
            
            const thumbImg = document.createElement('img');
            thumbImg.src = img.src;
            thumbImg.alt = `Miniature ${index + 1}`;
            thumbImg.loading = 'lazy';
            
            thumbnail.appendChild(thumbImg);
            thumbnail.addEventListener('click', () => {
                this.stopAutoSlide();
                this.goToSlide(index);
            });
            
            thumbnails.appendChild(thumbnail);
        });
        
        // Mise à jour du compteur
        this.updateCounter();
    }

    // Afficher un slide spécifique
    showSlide(index) {
        const slides = this.modal.querySelectorAll('.gallery-slide');
        const indicators = this.modal.querySelectorAll('.gallery-indicator');
        const thumbnails = this.modal.querySelectorAll('.gallery-thumbnail');
        
        // Retirer la classe active de tous les slides
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.removeAttribute('data-animation');
        });
        
        // Retirer la classe active de tous les indicateurs
        indicators.forEach(indicator => indicator.classList.remove('active'));
        thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));
        
        // Déterminer la direction de l'animation
        const direction = index > this.currentSlide ? 'right' : 'left';
        this.animationDirection = direction;
        
        // Ajouter la classe active au slide courant
        if (slides[index]) {
            slides[index].classList.add('active');
            slides[index].dataset.animation = direction;
            
            // Réinitialiser le zoom pour le nouveau slide
            this.resetZoomForSlide(slides[index]);
            
            // Mettre à jour les informations de l'image
            this.updateImageInfo(index);
        }
        
        // Mettre à jour les indicateurs actifs
        if (indicators[index]) indicators[index].classList.add('active');
        if (thumbnails[index]) thumbnails[index].classList.add('active');
        
        // Centrer la miniature active
        this.scrollToActiveThumbnail();
        
        // Mettre à jour le compteur
        this.updateCounter();
        
        // Mettre à jour la progression
        this.updateProgress();
        
        // Mettre à jour l'index courant
        this.currentSlide = index;
    }

    // Réinitialiser le zoom pour un slide
    resetZoomForSlide(slide) {
        const img = slide.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1)';
            img.style.transformOrigin = 'center center';
            this.imageZoom = 1;
            this.updateZoomIndicator();
        }
    }

    // Mettre à jour les informations de l'image
    updateImageInfo(index) {
        const imageCounter = this.modal.querySelector('.image-counter');
        const imageAlt = this.modal.querySelector('.image-alt');
        
        if (imageCounter) {
            imageCounter.textContent = `${index + 1} / ${this.currentGallery.images.length}`;
        }
        
        if (imageAlt && this.currentGallery.images[index]) {
            imageAlt.textContent = this.currentGallery.images[index].alt;
        }
    }

    // Mettre à jour le compteur
    updateCounter() {
        const slideCounter = this.modal.querySelector('#slideCounter');
        if (slideCounter) {
            slideCounter.textContent = `${this.currentSlide + 1}/${this.currentGallery.images.length}`;
        }
    }

    // Mettre à jour la barre de progression
    updateProgress() {
        const progress = this.modal.querySelector('#slideProgress');
        if (progress) {
            progress.style.width = '0%';
            
            // Animation de progression
            let width = 0;
            const interval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(interval);
                } else {
                    width += 100 / (this.autoSlideSpeed / 100);
                    progress.style.width = `${width}%`;
                }
            }, 100);
        }
    }

    // Faire défiler vers la miniature active
    scrollToActiveThumbnail() {
        const thumbnails = this.modal.querySelector('.gallery-thumbnails');
        const activeThumb = thumbnails.querySelector('.gallery-thumbnail.active');
        
        if (activeThumb) {
            const containerWidth = thumbnails.offsetWidth;
            const thumbLeft = activeThumb.offsetLeft;
            const thumbWidth = activeThumb.offsetWidth;
            
            thumbnails.scrollTo({
                left: thumbLeft - (containerWidth / 2) + (thumbWidth / 2),
                behavior: 'smooth'
            });
        }
    }

    // Slide suivant
    nextSlide() {
        if (!this.currentGallery) return;
        
        const nextIndex = (this.currentSlide + 1) % this.currentGallery.images.length;
        this.showSlide(nextIndex);
    }

    // Slide précédent
    prevSlide() {
        if (!this.currentGallery) return;
        
        const prevIndex = this.currentSlide === 0 ? 
            this.currentGallery.images.length - 1 : 
            this.currentSlide - 1;
        this.showSlide(prevIndex);
    }

    // Aller à un slide spécifique
    goToSlide(index) {
        if (!this.currentGallery || index < 0 || index >= this.currentGallery.images.length) return;
        
        this.showSlide(index);
    }

    // Gérer le zoom
    handleZoom(action) {
        const activeSlide = this.modal.querySelector('.gallery-slide.active');
        if (!activeSlide) return;
        
        const img = activeSlide.querySelector('img');
        if (!img) return;
        
        let newZoom = this.imageZoom;
        
        switch(action) {
            case 'zoom-in':
                newZoom = Math.min(this.imageZoom * 1.2, this.maxZoom);
                break;
                
            case 'zoom-out':
                newZoom = Math.max(this.imageZoom / 1.2, this.minZoom);
                break;
                
            case 'zoom-reset':
                newZoom = 1;
                break;
                
            case 'zoom-fit':
                // Calculer le zoom optimal pour ajuster l'image à l'écran
                const container = this.modal.querySelector('.gallery-slider');
                const containerRect = container.getBoundingClientRect();
                const imgRect = img.getBoundingClientRect();
                
                const scaleX = containerRect.width / imgRect.width;
                const scaleY = containerRect.height / imgRect.height;
                newZoom = Math.min(scaleX, scaleY) * 0.95; // 5% de marge
                break;
        }
        
        // Appliquer le zoom
        this.imageZoom = newZoom;
        img.style.transform = `scale(${this.imageZoom})`;
        
        // Ajuster l'origine de transformation pour le zoom centré
        img.style.transformOrigin = 'center center';
        
        // Mettre à jour l'indicateur de zoom
        this.updateZoomIndicator();
    }

    // Mettre à jour l'indicateur de zoom
    updateZoomIndicator() {
        const indicator = this.modal.querySelector('#zoomIndicator');
        if (indicator) {
            const percentage = Math.round(this.imageZoom * 100);
            indicator.textContent = `${percentage}%`;
            
            // Afficher/masquer l'indicateur
            if (Math.abs(this.imageZoom - 1) > 0.01) {
                indicator.style.display = 'block';
                
                // Masquer après 2 secondes si le zoom est stable
                clearTimeout(this.zoomIndicatorTimeout);
                this.zoomIndicatorTimeout = setTimeout(() => {
                    indicator.style.display = 'none';
                }, 2000);
            } else {
                indicator.style.display = 'none';
            }
        }
    }

    // Basculer le plein écran
    toggleFullscreen() {
        const content = this.modal.querySelector('.gallery-modal-content');
        
        if (!document.fullscreenElement) {
            if (content.requestFullscreen) {
                content.requestFullscreen();
            } else if (content.webkitRequestFullscreen) {
                content.webkitRequestFullscreen();
            } else if (content.msRequestFullscreen) {
                content.msRequestFullscreen();
            }
            this.isFullscreen = true;
            
            // Changer l'icône
            const fullscreenBtn = this.modal.querySelector('.gallery-fullscreen-btn');
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            fullscreenBtn.title = 'Quitter le plein écran (F)';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            this.isFullscreen = false;
            
            // Changer l'icône
            const fullscreenBtn = this.modal.querySelector('.gallery-fullscreen-btn');
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            fullscreenBtn.title = 'Plein écran (F)';
        }
    }

    // Ajuster la taille des images pour le plein écran
    adjustImageSizes() {
        const activeSlide = this.modal.querySelector('.gallery-slide.active');
        if (activeSlide) {
            const img = activeSlide.querySelector('img');
            if (img && this.isFullscreen) {
                // Réinitialiser le zoom pour le plein écran
                this.imageZoom = 1;
                img.style.transform = 'scale(1)';
                this.updateZoomIndicator();
            }
        }
    }

    // Démarrer le diaporama automatique
    startAutoSlide() {
        this.stopAutoSlide(); // S'assurer qu'aucun intervalle n'est déjà en cours
        
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoSlideSpeed);
    }

    // Arrêter le diaporama automatique
    stopAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }

    // Basculer le diaporama automatique
    toggleAutoSlide() {
        if (this.slideInterval) {
            this.stopAutoSlide();
        } else {
            this.startAutoSlide();
        }
    }

    // Précharger les images
    preloadImages() {
        if (!this.currentGallery) return;
        
        this.currentGallery.images.forEach(img => {
            if (!this.imageLoadStates.has(img.src)) {
                const preload = new Image();
                preload.src = img.src;
                this.imageLoadStates.set(img.src, false);
                
                preload.onload = () => {
                    this.imageLoadStates.set(img.src, true);
                };
                
                preload.onerror = () => {
                    console.error(`Erreur de préchargement: ${img.src}`);
                };
            }
        });
    }

    // Fermer la galerie
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.stopAutoSlide();
        this.currentGallery = null;
        this.currentSlide = 0;
        this.imageZoom = 1;
        
        // Réinitialiser le plein écran si actif
        if (this.isFullscreen && document.fullscreenElement) {
            this.toggleFullscreen();
        }
    }
}

// ========== INITIALIZATION ==========
let galleryManager;

document.addEventListener('DOMContentLoaded', () => {
    galleryManager = new GalleryManager();
});

// Fonctions globales pour ouvrir les galeries
function openProjectGallery(projectId) {
    if (galleryManager) {
        galleryManager.openGallery(projectId);
    }
}

function closeGallery() {
    if (galleryManager) {
        galleryManager.close();
    }
}