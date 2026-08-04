// ==========================================================================
// DEVELOPER PORTFOLIO - GOLU KUMAR - INTERACTIVE ENGINE (script.js)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    initTheme();
    initVideoBackground();
    initMobileNav();
    initCanvasParticles();
    initTypingEffect();
    initModals();
    initNavigationScroll();
    initFormHandler();
    initProjectFilters();
    
    // Update Copyright Year
    const copyrightEl = document.getElementById('copyright');
    if (copyrightEl) {
        copyrightEl.textContent = `© ${new Date().getFullYear()} Golu Kumar. All rights reserved.`;
    }
}

/* ==========================================================================
   THEME MANAGER (DARK / LIGHT MODE)
   ========================================================================== */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        document.body.classList.add('light-mode');
        themeIcon.className = 'fas fa-sun';
    } else {
        document.body.classList.remove('light-mode');
        themeIcon.className = 'fas fa-moon';
    }
    
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        
        // Update Icon
        themeIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
        
        // Save user preference
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // Update particles color on theme change
        updateCanvasParticlesTheme();
    });
}

/* ==========================================================================
   VIDEO BACKGROUND TOGGLE (Performance Optimisation)
   ========================================================================== */
function initVideoBackground() {
    const videoToggleBtn = document.getElementById('video-toggle');
    const videoBgContainer = document.getElementById('video-bg-container');
    const videoElement = document.getElementById('bg-video');
    const icon = videoToggleBtn.querySelector('i');
    
    // Default video is paused/muted to save memory
    if (videoElement) {
        videoElement.pause();
    }
    
    videoToggleBtn.addEventListener('click', () => {
        const isActive = videoBgContainer.classList.toggle('active');
        
        if (isActive) {
            videoElement.play().catch(err => console.log("Video play interrupted or unsupported:", err));
            icon.className = 'fas fa-video';
            videoToggleBtn.setAttribute('title', 'Disable Video Background');
        } else {
            videoElement.pause();
            icon.className = 'fas fa-video-slash';
            videoToggleBtn.setAttribute('title', 'Enable Video Background (Heavy)');
        }
    });
}

/* ==========================================================================
   MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileNav() {
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('main-navbar');
    const navLinks = document.querySelectorAll('.navbar a');
    const toggleIcon = menuToggle.querySelector('i');
    
    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
        const isOpen = navbar.classList.contains('active');
        toggleIcon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    });
    
    // Close mobile menu when links are clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            toggleIcon.className = 'fas fa-bars';
        });
    });
    
    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navbar.contains(e.target)) {
            navbar.classList.remove('active');
            toggleIcon.className = 'fas fa-bars';
        }
    });
}

/* ==========================================================================
   CANVAS INTERACTIVE PARTICLES SYSTEM
   ========================================================================== */
let canvas, ctx, particlesArray;
let particleColor = 'rgba(99, 102, 241, 0.4)'; // Indigo by default

function initCanvasParticles() {
    canvas = document.getElementById('background-canvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    
    // Size Canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    updateCanvasParticlesTheme();
    setupParticles();
    animateParticles();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function updateCanvasParticlesTheme() {
    const isLight = document.body.classList.contains('light-mode');
    particleColor = isLight ? 'rgba(79, 70, 229, 0.15)' : 'rgba(99, 102, 241, 0.3)';
    
    // Reinitialize if particles exist to update colors instantly
    if (particlesArray) {
        particlesArray.forEach(p => p.color = particleColor);
    }
}

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
    update() {
        // Boundary Collision
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        
        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function setupParticles() {
    particlesArray = [];
    let numberOfParticles = Math.min((canvas.width * canvas.height) / 9000, 100);
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, particleColor));
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connectParticles();
}

function connectParticles() {
    let opacityValue = 1;
    const maxDistance = 120;
    const isLight = document.body.classList.contains('light-mode');
    
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            if (distance < (maxDistance * maxDistance)) {
                opacityValue = 1 - (distance / (maxDistance * maxDistance));
                const lineColor = isLight 
                    ? `rgba(79, 70, 229, ${opacityValue * 0.08})`
                    : `rgba(99, 102, 241, ${opacityValue * 0.15})`;
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

/* ==========================================================================
   DYNAMIC HERO TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
    const textEl = document.getElementById('typed-text');
    if (!textEl) return;
    
    const words = ["Full Stack MERN Developer", "B.Tech CSE Student", "Problem Solver", "250+ Leetcode Solved"];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentWord = words[wordIdx];
        
        if (isDeleting) {
            textEl.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50;
        } else {
            textEl.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIdx === currentWord.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    type();
}

/* ==========================================================================
   PROJECT CATEGORY FILTERS
   ========================================================================== */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hide');
                    card.classList.add('show');
                } else {
                    card.classList.remove('show');
                    card.classList.add('hide');
                }
            });
        });
    });
}

/* ==========================================================================
   MODAL SYSTEMS (20 PROJECT DETAILS & CERTIFICATIONS)
   ========================================================================== */
const projectData = {
    'Gramhealth': {
        title: "Gramhealth Rural Healthcare Platform",
        image: "ar.png",
        overview: "Gramhealth is a comprehensive full-stack medical consulting system customized for rural areas. It integrates doctor directory filters, appointment booking algorithms, and a Twilio automated phone-call scheduling utility.",
        architecture: "• <strong>Frontend:</strong> React.js, dynamic scheduling modules.<br>• <strong>Backend:</strong> Node.js, Express, REST APIs.<br>• <strong>Database:</strong> MongoDB Atlas.<br>• <strong>Communication:</strong> Twilio API call triggers.",
        code: `// Twilio API integration endpoint snippet (Node.js)
const Twilio = require('twilio');
const client = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const triggerVoiceAlert = async (doctorPhone, patientName) => {
    try {
        const call = await client.calls.create({
            url: 'http://demo.twilio.com/docs/voice.xml',
            to: doctorPhone,
            from: process.env.TWILIO_NUMBER
        });
        console.log(\`Alert Call dispatched: \${call.sid}\`);
    } catch(err) {
        console.error("Twilio Call Dispatch Failed: ", err);
    }
};`
    },
    'documind-ai': {
        title: "DocuMind AI (RAG Document Assistant)",
        image: "ae.png",
        overview: "A production-grade Retrieval-Augmented Generation (RAG) tool built to ingest documents, generate embeddings via OpenAI models, store them inside vector tables, and perform contextual searches.",
        architecture: "• <strong>Frontend:</strong> Next.js, Tailwind CSS.<br>• <strong>AI SDK:</strong> LangChain, OpenAI LLMs.<br>• <strong>Vector DB:</strong> Pinecone / local storage vector indexes.<br>• <strong>Language:</strong> TypeScript.",
        code: `// Pinecone context-query vector search snippet (TypeScript)
import { PineconeClient } from "@pinecone-database/pinecone";

export async function queryRAGContext(queryEmbedding: number[]) {
    const pinecone = new PineconeClient();
    await pinecone.init({ apiKey: process.env.PINECONE_API_KEY });
    const index = pinecone.Index("documind-ai");
    
    const results = await index.query({
        vector: queryEmbedding,
        topK: 3,
        includeMetadata: true
    });
    return results.matches;
}`
    },
    'Agumentik-Project': {
        title: "Agumentik Task SaaS Platform",
        image: "er.png",
        overview: "A MERN stack Software-as-a-Service system that facilitates task management, real-time board updates via socket triggers, and automated task prioritization based on OpenAI prompt algorithms.",
        architecture: "• <strong>State Management:</strong> Redux Toolkit hooks.<br>• <strong>Backend:</strong> Node.js, Socket.io channels.<br>• <strong>Database:</strong> MongoDB.<br>• <strong>AI Engine:</strong> OpenAI API priority parser.",
        code: `// Redux slice task organizer snippet (JavaScript)
import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
    name: 'tasks',
    initialState: { items: [], loading: false },
    reducers: {
        setTasks: (state, action) => { state.items = action.payload; },
        addTask: (state, action) => { state.items.push(action.payload); },
        updatePriority: (state, action) => {
            const index = state.items.findIndex(t => t.id === action.payload.id);
            if (index !== -1) state.items[index].priority = action.payload.priority;
        }
    }
});`
    },
    'Fitness-Hub-Complete': {
        title: "Fitness Hub PWA Portal",
        image: "ae.png",
        overview: "Fitness-Hub is a gym-administrator portal structured as a Progressive Web Application. Features service caching, custom offline member logging, and service-worker checkins.",
        architecture: "• <strong>Front:</strong> HTML5, CSS3, Vanilla JS.<br>• <strong>Engine:</strong> Service Worker lifecycle tools.<br>• <strong>DB:</strong> MongoDB & Local IndexedDB.",
        code: `// PWA Service Worker caching utility (JavaScript)
const CACHE_NAME = 'fitness-hub-cache-v1';
const assets = ['/', '/index.html', '/style.css', '/script.js'];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(assets);
        })
    );
});`
    },
    'Teddy-haven-ecommerce': {
        title: "Teddy Haven 3D E-Commerce",
        image: "re.png",
        overview: "E-Commerce web storefront utilizing Three.js components to render animated 3D toys inside shopping portals. Saves persistent cart variables inside localStorage.",
        architecture: "• <strong>Graphics:</strong> Three.js (WebGL), OrbitControls, glTF loader.<br>• <strong>Frame:</strong> React.js, Vite bundle.",
        code: `// Three.js scene scene loader snippet (React)
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function loadTeddyModel(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(300, 300);
    container.appendChild(renderer.domElement);
    
    const loader = new GLTFLoader();
    loader.load('teddy.gltf', (gltf) => {
        scene.add(gltf.scene);
        renderer.render(scene, camera);
    });
}`
    },
    'Raj-Chess-Game': {
        title: "Interactive 3D Chess Game",
        image: "image.png",
        overview: "Full browser-based chess board implementing two-player interactions, highlighting valid piece movements, checkmate evaluation logic, and responsive 3D board styling.",
        architecture: "• <strong>Core:</strong> Vanilla JavaScript game loop.<br>• <strong>Styling:</strong> CSS 3D perspectives.<br>• <strong>DB:</strong> Session save tables.",
        code: `// Legal rook path finder algorithm snippet (JavaScript)
function checkRookMoves(row, col, board) {
    const validMoves = [];
    const directions = [[1,0], [-1,0], [0,1], [0,-1]];
    
    for (let [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (board[r][c] === null) {
                validMoves.push([r, c]);
            } else {
                if (board[r][c].color !== board[row][col].color) validMoves.push([r, c]);
                break;
            }
            r += dr;
            c += dc;
        }
    }
    return validMoves;
}`
    },
    'Skillswap-main': {
        title: "SkillSwap Skill Exchange Platform",
        image: "p.png",
        overview: "A community skill sharing platform utilizing secure Google OAuth credentials, JWT tokens, and OTP-based verification via Resend APIs.",
        architecture: "• <strong>Stack:</strong> MongoDB, Express, React, Node.js.<br>• <strong>Services:</strong> Resend API, JWT headers.",
        code: `// Resend email verification script (Express Node.js)
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const dispatchVerificationOTP = async (email, otp) => {
    return await resend.emails.send({
        from: 'accounts@skillswap.org',
        to: email,
        subject: 'Verify your email code',
        html: \`<p>Your security OTP is: <strong>\${otp}</strong></p>\`
    });
};`
    },
    'Doctor-Appointment-System': {
        title: "Doctor Appointment System",
        image: "image.png",
        overview: "Medical coordination application facilitating patient records checkins, doctor slot scheduling, and appointment loggers.",
        architecture: "• <strong>Stack:</strong> React, Express, MongoDB.<br>• <strong>Validation:</strong> Role-based admin access.",
        code: `// Doctor scheduling slot verification checks
const verifySlotAvailability = async (doctorId, date, slot) => {
    const existingBooking = await Appointment.findOne({ doctorId, date, slot });
    return existingBooking ? false : true;
};`
    },
    'JARVIS': {
        title: "JARVIS Voice Assistant",
        image: "re.png",
        overview: "Voice recognition desktop assistant that captures mic instructions, parses string actions, and automates OS commands with 90% accuracy.",
        architecture: "• <strong>Engine:</strong> Python 3.x.<br>• <strong>APIs:</strong> SpeechRecognition, OS wrapper APIs.",
        code: `# Python SpeechRecognition parser code snippet
import speech_recognition as sr

def parse_voice_mic():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        audio = r.listen(source)
    try:
        return r.recognize_google(audio).lower()
    except sr.UnknownValueError:
        return "Command unrecognizable"`
    },
    'Worker-attendance-management-': {
        title: "Worker Attendance Management",
        image: "er.png",
        overview: "Workplace log tool documenting employee check-in times, leave days, salary rates, and payroll calculations.",
        architecture: "• <strong>Database:</strong> MongoDB tables.<br>• <strong>Backend:</strong> Node.js endpoints.",
        code: `// Salary rates computation loop (JavaScript)
function calculateMonthlyPayroll(presentDays, absentDays, rate) {
    const allowedAbsents = 2;
    const penaltyRate = rate * 0.5;
    const excessAbsents = Math.max(0, absentDays - allowedAbsents);
    return (presentDays * rate) - (excessAbsents * penaltyRate);
}`
    },
    '3D-Highway-Rush': {
        title: "3D Highway Rush Car Game",
        image: "p.png",
        overview: "A fast browser game with collision checking loops, auto traffic grids, and visual nitro speeds.",
        architecture: "• <strong>Graphics:</strong> HTML5 Canvas, JS engine.<br>• <strong>Loop:</strong> RequestAnimationFrame ticks.",
        code: `// Car boundary collision detection snippet
function checkCarCollision(player, obstacle) {
    return (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
    );
}`
    },
    'Box-Maze-Challenge': {
        title: "Box Maze Challenge (Tilting board)",
        image: "image.png",
        overview: "Interactive canvas board puzzle tilting layout using arrow keys to guide ball vectors to center targets.",
        architecture: "• <strong>Core:</strong> Math vector physics engine.<br>• <strong>Language:</strong> HTML5 Canvas, JavaScript.",
        code: `// Physics vector calculation loop
function applyTiltVelocity(ball, tiltAngleX, tiltAngleY) {
    const gravityForce = 0.5;
    ball.vx += Math.sin(tiltAngleX) * gravityForce;
    ball.vy += Math.sin(tiltAngleY) * gravityForce;
    
    ball.x += ball.vx;
    ball.y += ball.vy;
}`
    },
    'focus_mode_extension': {
        title: "YouTube Focus Mode Chrome Extension",
        image: "ae.png",
        overview: "Chrome browser add-on parsing YouTube DOM layouts to strip feeds, comments, and recommendations to save student learning focus.",
        architecture: "• <strong>SDK:</strong> Chrome Extension V3 APIs.<br>• <strong>Core:</strong> Content DOM scripts.",
        code: `// Chrome Manifest V3 Content Script snippet
const blockRecommendationGrid = () => {
    const sidebar = document.getElementById('related');
    const comments = document.getElementById('comments');
    if (sidebar) sidebar.style.display = 'none';
    if (comments) comments.style.display = 'none';
};

window.addEventListener('load', blockRecommendationGrid);`
    },
    'Weather-Check-App': {
        title: "Weather Forecasting Web App",
        image: "ar.png",
        overview: "Atmospheric location fetcher querying weather APIs to display current temperatures, forecasts, and warning parameters.",
        architecture: "• <strong>API:</strong> OpenWeather API fetch loops.<br>• <strong>Core:</strong> Vanilla JavaScript fetch hooks.",
        code: `// Meteorological fetcher async script
async function fetchCityWeather(city) {
    const apiKey = 'YOUR_WEATHER_API_KEY';
    const apiURL = \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${apiKey}\`;
    
    const response = await fetch(apiURL);
    const data = await response.json();
    return data;
}`
    },
    'Recursive-Fractal-Tree-Generator': {
        title: "Recursive Fractal Tree Generator",
        image: "re.png",
        overview: "Mathematical algorithm plotting recursive tree branching angles onto a Python Turtle canvas wrapper.",
        architecture: "• <strong>Module:</strong> Python Turtle API.<br>• <strong>Core:</strong> Recursion functions.",
        code: `# Python recursive branching function
import turtle

def draw_fractal_branch(branch_len, t):
    if branch_len > 5:
        t.forward(branch_len)
        t.right(20)
        draw_fractal_branch(branch_len - 15, t)
        t.left(40)
        draw_fractal_branch(branch_len - 15, t)
        t.right(20)
        t.backward(branch_len)`
    },
    'Neon-Particle-Heart-Animation': {
        title: "Neon Particle Heart Animation",
        image: "er.png",
        overview: "Polar trigonometric particle simulator plotting pulsating neon hearts onto HTML5 Canvas grids.",
        architecture: "• <strong>Engine:</strong> Canvas API rendering.<br>• <strong>Core:</strong> Polar coordinates math.",
        code: `// Math polar heart coordinate mapper snippet
function getHeartPosition(t) {
    // 16sin^3(t) / 13cos(t)...
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    return { x: x * 10, y: -y * 10 };
}`
    },
    'Eternal-Love-A-Romantic-Proposal': {
        title: "Interactive Proposal Animation",
        image: "p.png",
        overview: "Python script utilizing Turtle graphics to output moonlit background prompts and vector proposal animations.",
        architecture: "• <strong>Graphics:</strong> Python Turtle structures.<br>• <strong>Language:</strong> Python 3.x.",
        code: `# Proposal text rendering snippet
import turtle

def render_proposal_card():
    s = turtle.Screen()
    s.bgcolor("midnightblue")
    t = turtle.Turtle()
    t.color("deeppink")
    t.write("Will you marry me?", font=("Arial", 24, "bold"), align="center")`
    },
    'VividEvents-Studio-Web': {
        title: "VividEvents Studio Web",
        image: "ar.png",
        overview: "Premium landing portal featuring catalogs, price tables, review layouts, and custom form validators.",
        architecture: "• <strong>Layout:</strong> HTML5 semantic tags.<br>• <strong>Styles:</strong> Vanilla CSS variables.",
        code: `// Contact submission verification checks
document.getElementById('leadForm').addEventListener('submit', (e) => {
    const email = document.getElementById('leadEmail').value;
    if (!email.includes('@')) {
        e.preventDefault();
        alert('Invalid email coordinates');
    }
});`
    },
    'Digital-Clock': {
        title: "Sleek Digital Clock Widget",
        image: "ae.png",
        overview: "High precision clock updating digital layouts by fetching OS date ticks.",
        architecture: "• <strong>Language:</strong> JavaScript, CSS flexbox.",
        code: `// Digital numbers updating loop
function refreshClockDigits() {
    const time = new Date();
    document.getElementById('hours').textContent = time.getHours().toString().padStart(2, '0');
    document.getElementById('minutes').textContent = time.getMinutes().toString().padStart(2, '0');
}`
    },
    'Age-Calculator': {
        title: "3D Age & Life Progress Calculator",
        image: "er.png",
        overview: "Life progress calculator mapping years down to millisecond speeds inside a 3D styling structure.",
        architecture: "• <strong>Language:</strong> JavaScript, CSS 3D transforms.",
        code: `// Age millisecond offset parser snippet
function computeMillisecondAge(birthdateStr) {
    const birthday = new Date(birthdateStr).getTime();
    const now = Date.now();
    return (now - birthday) / (1000 * 60 * 60 * 24 * 365.25);
}`
    }
};

const certificateData = {
    'aws': {
        title: "Academy Cloud Foundations",
        issuer: "AWS Academy",
        details: "Covers cloud concepts, architectural design patterns, AWS security protocols, billing models, and core services like EC2, S3, RDS, and VPC setups.",
        image: "logo.jpg",
        url: "https://www.credly.com/"
    },
    'ibm': {
        title: "AI Fundamentals Certificate",
        issuer: "IBM Academy",
        details: "Covers core principles of Artificial Intelligence, Machine Learning, Deep Learning, ethics in AI applications, and Neural Networks.",
        image: "logo.jpg",
        url: "https://www.credly.com/"
    },
    'cdc': {
        title: "Mic Master Certificate",
        issuer: "CDC",
        details: "Credential validating public speaking, group leadership, presentation masteries, and technical product storytelling.",
        image: "logo.jpg",
        url: "#"
    },
    'tcs': {
        title: "TCS iON CHAMPION Training",
        issuer: "TCS iON",
        details: "Completed industry preparation module covering communication, project execution methods, software development lifecycles, and professional agility.",
        image: "logo.jpg",
        url: "#"
    }
};

function initModals() {
    const detailsModal = document.getElementById('detailsModal');
    const certModal = document.getElementById('certModal');
    
    // Close buttons
    const closeDetailsBtn = document.getElementById('closeDetailsModal');
    const closeCertBtn = document.getElementById('closeCertModal');
    
    // ----------------------------------------------------
    // PROJECT DETAILS MODAL ACTION
    // ----------------------------------------------------
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project-id');
            const data = projectData[projectId];
            
            if (!data) return;
            
            // Populate Content
            document.getElementById('modalTitle').textContent = data.title;
            document.getElementById('outputImage').src = data.image;
            document.getElementById('projectOverviewDesc').innerHTML = data.overview;
            document.getElementById('projectArchitecture').innerHTML = data.architecture;
            document.getElementById('projectCode').textContent = data.code;
            
            // Open Modal
            detailsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Reset tab navigation
            resetTabs();
        });
    });
    
    // Tab switching within Details Modal
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Deactivate other tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Activate current
            btn.classList.add('active');
            document.getElementById(tabId + 'Tab').classList.add('active');
        });
    });
    
    function resetTabs() {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        // Activate Overview tab by default
        document.querySelector('.tab-btn[data-tab="overview"]').classList.add('active');
        document.getElementById('overviewTab').classList.add('active');
    }
    
    // ----------------------------------------------------
    // CERTIFICATION MODAL ACTION
    // ----------------------------------------------------
    document.querySelectorAll('.view-cert-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const certId = btn.getAttribute('data-cert-id');
            const data = certificateData[certId];
            
            if (!data) return;
            
            // Populate content
            document.getElementById('certTitle').textContent = data.title;
            document.getElementById('certImage').src = data.image;
            document.getElementById('certDetails').innerHTML = `<strong>Issuer:</strong> ${data.issuer}<br><br>${data.details}`;
            
            const verifyBtn = document.getElementById('downloadCertBtn');
            verifyBtn.href = data.url;
            if (data.url === '#') {
                verifyBtn.style.display = 'none';
            } else {
                verifyBtn.style.display = 'inline-flex';
            }
            
            // Open Modal
            certModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // ----------------------------------------------------
    // CLOSE ACTIONS
    // ----------------------------------------------------
    const closeModalFunc = (modal) => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };
    
    if (closeDetailsBtn) closeDetailsBtn.addEventListener('click', () => closeModalFunc(detailsModal));
    if (closeCertBtn) closeCertBtn.addEventListener('click', () => closeModalFunc(certModal));
    
    window.addEventListener('click', (e) => {
        if (e.target === detailsModal) closeModalFunc(detailsModal);
        if (e.target === certModal) closeModalFunc(certModal);
    });
}

/* ==========================================================================
   SCROLL NAVIGATION OBSERVER
   ========================================================================== */
function initNavigationScroll() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.navbar a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   FORM HANDLING & VALIDATION
   ========================================================================== */
function initFormHandler() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        
        if (!name || !email || !subject) {
            alert("Please fill in all the required fields.");
            return;
        }
        
        alert(`Thank you, ${name}! Your message has been sent. I will get in touch with you at ${email} shortly.`);
        form.reset();
    });
}