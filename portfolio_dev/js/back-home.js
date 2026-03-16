// back-home.js - Gestion du retour à l'accueil
document.addEventListener('DOMContentLoaded', function() {
    // Gestion des liens de retour à l'accueil
    const homeLinks = document.querySelectorAll('a[href="../index.html"], a[href="index.html"], .home-link');
    
    homeLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // Animation de transition
            document.body.style.transition = 'opacity 0.3s ease';
            document.body.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
    
    // Gestion du bouton home flottant
    const homeButton = document.getElementById('homeButton');
    if (homeButton) {
        homeButton.addEventListener('click', function() {
            document.body.style.transition = 'opacity 0.3s ease';
            document.body.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 300);
        });
    }
    
    // Détection si on vient de la page d'accueil (pour les tests)
    if (document.referrer.includes('index.html')) {
        console.log('Retour depuis la page d\'accueil');
        // Vous pouvez ajouter une animation spéciale ici
        document.body.style.animation = 'fadeIn 0.5s ease';
    }
});

// Animation d'entrée
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});