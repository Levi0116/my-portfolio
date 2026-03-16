// ========== CONTACT FORM HANDLER ==========
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Initialisation des liens de contact
    initContactLinks();
});

// ========== FORM SUBMISSION ==========
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Désactiver le bouton
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;
    
    // Récupérer les données du formulaire
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Simuler l'envoi (remplacer par un vrai fetch API)
    setTimeout(() => {
        showNotification('Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.', 'success');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
    
    // Version avec fetch API (à décommenter pour utilisation réelle)
    /*
    fetch('votre-endpoint-api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        showNotification('Message envoyé avec succès !', 'success');
        form.reset();
    })
    .catch(error => {
        showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
    */
}

// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'success') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Styles de la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 0.8rem;
        z-index: 2000;
        animation: slideInRight 0.3s ease forwards;
    `;
    
    document.body.appendChild(notification);
    
    // Animation keyframes
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ========== CONTACT LINKS ==========
function initContactLinks() {
    // Téléchargement CV
    const cvButtons = document.querySelectorAll('.btn-outline[download]');
    cvButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (!button.getAttribute('href') || button.getAttribute('href') === '#') {
                e.preventDefault();
                showNotification('CV disponible prochainement', 'info');
            }
        });
    });
    
    // Copie d'email au clic
    const emailChip = document.querySelector('.contact-chip[href^="mailto:"]');
    if (emailChip) {
        emailChip.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailChip.getAttribute('href').replace('mailto:', '');
            
            navigator.clipboard.writeText(email).then(() => {
                showNotification('Email copié dans le presse-papier !', 'success');
            }).catch(() => {
                window.location.href = `mailto:${email}`;
            });
        });
    }
    
    // Téléphone
    const phoneChip = document.querySelector('.contact-chip[href^="tel:"]');
    if (phoneChip) {
        phoneChip.addEventListener('click', (e) => {
            // Pas de comportement spécial, laisse le lien par défaut
        });
    }
}

// ========== FORM VALIDATION ==========
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.length < 2) {
        errors.push('Le nom doit contenir au moins 2 caractères');
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
        errors.push('Email invalide');
    }
    
    if (!formData.subject || formData.subject.length < 3) {
        errors.push('Le sujet doit contenir au moins 3 caractères');
    }
    
    if (!formData.message || formData.message.length < 10) {
        errors.push('Le message doit contenir au moins 10 caractères');
    }
    
    return errors;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}