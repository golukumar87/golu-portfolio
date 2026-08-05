// ========== MAIN SCRIPT ==========

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initAll();
});

function initAll() {
    // 1. Mobile Menu Toggle
    document.querySelector('.nav-toggle').addEventListener('click', function() {
        document.querySelector('.navbar').classList.toggle('active');
    });

    // 2. Close mobile menu when clicking links
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelector('.navbar').classList.remove('active');
        });
    });

    // 3. Update Copyright Year
    document.getElementById('copyright').textContent = `© ${new Date().getFullYear()} All rights reserved`;

    // 4. Contact Form Submission
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you! Your message has been sent. I will respond soon.');
        this.reset();
    });

    // 5. Navigation highlighting
    highlightNavigation();

    // 6. Initialize modals
    initModals();

    // 7. Smooth scrolling
    initSmoothScrolling();
}

function highlightNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar a');

    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if(window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Project Data - Matches your HTML data-project values
const projectData = {
    'Amazon-page': {
        title: "Amazon Page Clone",
        html: `<!-- Amazon Clone HTML -->
<header>
    <nav>Amazon Clone Navigation</nav>
</header>
<main>
    <h1>Welcome to Amazon Clone</h1>
</main>`,
        css: `/* Amazon Clone CSS */
header { background: #131921; }
h1 { color: white; }`,
        js: `// Amazon Clone JavaScript
console.log('Amazon Clone loaded');`,
        output: "ae.png",
        demo: "#"
    },
    'Raj Tilting Maze Game': {
        title: "Raj Tilting Maze Game",
        html: `<!-- Maze Game HTML -->
<canvas id="gameCanvas"></canvas>`,
        css: `/* Maze Game CSS */
#gameCanvas { border: 2px solid black; }`,
        js: `// Maze Game JavaScript
console.log('Maze Game loaded');`,
        output: "image.png",
        demo: "#"
    },
    'RAJ SHUKLA Sneakers Shoping': {
        title: "Sneakers Shopping Website",
        html: `<!-- Sneakers Shop HTML -->
<h1>Sneakers Shop</h1>`,
        css: `/* Sneakers Shop CSS */`,
        js: `// Sneakers Shop JavaScript`,
        output: "re.png",
        demo: "#"
    },
    'Raj Shoping': {
        title: "Raj Shopping Website",
        html: `<!-- Shopping Website HTML -->
<h1>Shopping Website</h1>`,
        css: `/* Shopping Website CSS */`,
        js: `// Shopping Website JavaScript`,
        output: "er.png",
        demo: "#"
    },
    'Raj portfolio': {
        title: "Portfolio Website",
        html: `<!-- Portfolio HTML -->
<h1>Portfolio</h1>`,
        css: `/* Portfolio CSS */`,
        js: `// Portfolio JavaScript`,
        output: "p.png",
        demo: "#"
    },
    'Event Organisers': {
        title: "Event Organizers Website",
        html: `<!-- Event Organizers HTML -->
<h1>Event Organizers</h1>`,
        css: `/* Event Organizers CSS */`,
        js: `// Event Organizers JavaScript`,
        output: "ar.png",
        demo: "#"
    }
};

// Certificate Data
const certificateData = {
    html: {
        title: "HTML5 Certificate",
        image: "https://www.mygreatlearning.com/certificate/FBERXEAD?referrer_code=GLOWQAKKR8RCO",
        details: "HTML5 Fundamentals Course"
    },
    css: {
        title: "CSS3 Certificate",
        image: "https://www.mygreatlearning.com/certificate/MCIMUAZJ?referrer_code=GLOWQAKKR8RCO",
        details: "CSS3 and Responsive Design"
    },
    js: {
        title: "JavaScript Certificate",
        image: "https://www.mygreatlearning.com/certificate/FFGFGVMH?referrer_code=GLOWQAKKR8RCO",
        details: "JavaScript Programming"
    },
    python: {
        title: "Python Certificate",
        image: "https://www.mygreatlearning.com/certificate/HYQIUIOP?referrer_code=GLOWQAKKR8RCO",
        details: "Python Programming Basics"
    },
    cpp: {
        title: "C++ Certificate",
        image: "https://www.mygreatlearning.com/certificate/ZEPHPQRP?referrer_code=GLOWQAKKR8RCO",
        details: "C++ Programming Fundamentals"
    },
    mysql: {
        title: "MySQL Certificate",
        image: "https://via.placeholder.com/600x400/3a86ff/ffffff?text=MySQL+Certificate",
        details: "Database Management with MySQL"
    }
};

function initModals() {
    const codeModal = document.getElementById('codeModal');
    const certModal = document.getElementById('certModal');

    // Project Code Modal
    document.querySelectorAll('.view-code-btn').forEach(button => {
        button.addEventListener('click', function() {
            const projectCard = this.closest('.project-card');
            const projectId = projectCard.dataset.project;
            const project = projectData[projectId];
            
            if (!project) {
                alert(`Project "${projectId}" details coming soon!`);
                return;
            }
            
            // Update modal content
            document.getElementById('modalTitle').textContent = project.title;
            document.getElementById('htmlCode').textContent = project.html;
            document.getElementById('cssCode').textContent = project.css;
            document.getElementById('jsCode').textContent = project.js;
            document.getElementById('outputImage').src = project.output;
            document.getElementById('liveDemoBtn').href = project.demo;
            
            // Reset tabs
            resetTabs();
            
            // Show modal
            codeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Certificate Modal
    document.querySelectorAll('.skill-box').forEach(box => {
        box.addEventListener('click', function() {
            const skillId = this.dataset.skill;
            const cert = certificateData[skillId];
            
            if (!cert) {
                alert(`Certificate for ${skillId} coming soon!`);
                return;
            }
            
            // Update certificate modal
            document.getElementById('certTitle').textContent = cert.title;
            document.getElementById('certImage').src = cert.image;
            document.getElementById('certDetails').textContent = cert.details;
            document.getElementById('downloadCertBtn').href = cert.image;
            
            // Show modal
            certModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            document.getElementById(tabId + 'Tab').classList.add('active');
        });
    });

    // Close Modals
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if(e.target === codeModal) closeModal(codeModal);
        if(e.target === certModal) closeModal(certModal);
    });

    function resetTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        document.querySelector('.tab-btn[data-tab="html"]').classList.add('active');
        document.getElementById('htmlTab').classList.add('active');
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}