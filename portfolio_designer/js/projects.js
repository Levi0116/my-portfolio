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

// ========== PROJECT MODAL ==========
function openProjectModal(projectId) {
    const projects = {
        1: {
            title: "Application Web de Gestion d'Hôtel",
            description: "Application web complète développée avec Python, HTML, CSS et JavaScript pour la gestion efficace d'un établissement hôtelier.",
            details: "<p>Cette application comprend :</p><ul><li>Système de réservation en ligne</li><li>Gestion des chambres et des tarifs</li><li>Tableau de bord administratif</li><li>Gestion des clients et des paiements</li><li>Interface utilisateur responsive et intuitive</li></ul>",
            technologies: ["Python", "HTML5", "CSS3", "JavaScript", "UI/UX Design"],
            tools: ["Figma", "VS Code", "Git"]
        },
        2: {
            title: "Collection d'Affiches Événementielles",
            description: "Série d'affiches créatives pour différents événements culturels et promotionnels.",
            details: "<p>Cette collection met en valeur :</p><ul><li>Typographies créatives et expressives</li><li>Palettes de couleurs audacieuses</li><li>Compositions équilibrées et impactantes</li><li>Adaptation aux différents supports print</li></ul>",
            technologies: ["Adobe Illustrator", "Photoshop", "Typographie", "Théorie des couleurs"],
            tools: ["Creative Suite", "Procreate"]
        },
        3: {
            title: "Logos & Identité de Marque",
            description: "Création de logos modernes et de systèmes d'identité visuelle complète.",
            details: "<p>Ce projet comprend :</p><ul><li>Recherche et conceptualisation</li><li>Création de logotypes uniques</li><li>Développement de guides de style</li><li>Adaptation aux différents supports</li><li>Documentation complète de la marque</li></ul>",
            technologies: ["Logo Design", "Branding", "Identité Visuelle", "Vectoriel"],
            tools: ["Illustrator", "Figma", "InDesign"]
        },
        4: {
            title: "Site E-commerce Moderne",
            description: "Design d'une boutique en ligne avec focus sur l'expérience utilisateur et la conversion.",
            details: "<p>Cette interface inclut :</p><ul><li>Navigation intuitive et fluide</li><li>Panier d'achat optimisé</li><li>Processus de paiement simplifié</li><li>Design responsive pour tous devices</li><li>Système de filtrage avancé</li></ul>",
            technologies: ["UI Design", "E-commerce", "Responsive Design", "Prototypage"],
            tools: ["Figma", "Adobe XD", "Sketch"]
        },
        5: {
            title: "Portfolio Artistique",
            description: "Design d'un portfolio en ligne mettant en valeur des œuvres artistiques de manière élégante.",
            details: "<p>Ce portfolio présente :</p><ul><li>Galerie d'images optimisée</li><li>Navigation fluide et immersive</li><li>Animations subtiles et élégantes</li><li>Mise en page mettant en valeur le contenu</li><li>Design épuré et moderne</li></ul>",
            technologies: ["Web Design", "Portfolio", "Animation CSS", "UI/UX"],
            tools: ["Figma", "HTML/CSS", "JavaScript"]
        }
    };
    
    const project = projects[projectId];
    if (!project) return;
    
    const modal = document.getElementById('projectModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <h2 style="color: var(--text-dark); margin-bottom: 1rem;">${project.title}</h2>
        <p style="color: var(--text-light); margin-bottom: 2rem;">${project.description}</p>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="color: var(--text-dark); margin-bottom: 1rem;">Détails du projet</h3>
            <div style="color: var(--text-light); line-height: 1.8;">
                ${project.details}
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="color: var(--text-dark); margin-bottom: 1rem;">Technologies & Compétences</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${project.technologies.map(tech => `
                    <span style="background: rgba(var(--primary), 0.1); color: var(--primary); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem;">
                        ${tech}
                    </span>
                `).join('')}
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="color: var(--text-dark); margin-bottom: 1rem;">Outils utilisés</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${project.tools.map(tool => `
                    <span style="background: rgba(var(--secondary), 0.1); color: var(--secondary); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem;">
                        ${tool}
                    </span>
                `).join('')}
            </div>
        </div>
        
        <button onclick="closeProjectModal()" class="btn btn-primary">
            <i class="fas fa-times"></i>
            Fermer
        </button>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}