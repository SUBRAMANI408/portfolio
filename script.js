// Main Portfolio JavaScript Logic

// 1. Mobile Navigation & Shrink Navbar on Scroll
const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.querySelector('.nav-links');
const navbar = document.getElementById('floating-navbar');

// Toggle Hamburger Menu
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Animate hamburger lines
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close Mobile Nav Menu on Link Click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Navbar background shrink effect on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


// 2. HTML5 Canvas Stardust Particle System
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null, radius: 100 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.4 + 0.2;
        
        // Dynamic colors: 65% teal, 25% purple, 10% white
        const rand = Math.random();
        if (rand < 0.65) this.color = `rgba(0, 242, 254, ${this.opacity})`;
        else if (rand < 0.9) this.color = `rgba(168, 85, 247, ${this.opacity})`;
        else this.color = `rgba(255, 255, 255, ${this.opacity})`;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Screen wraps
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Push away from mouse cursor
        if (mouse.x !== null && mouse.y !== null) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let dist = Math.hypot(dx, dy);
            if (dist < mouse.radius) {
                let force = (mouse.radius - dist) / mouse.radius;
                let angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * force * 1.2;
                this.y += Math.sin(angle) * force * 1.2;
            }
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const densityCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < densityCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    // Draw constellation lines
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let dist = Math.hypot(dx, dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 242, 254, ${(1 - dist/100) * 0.08})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();


// 3. Typewriter Typing Effect in Hero
const typewriterElement = document.getElementById('typewriter');
if (typewriterElement) {
    const words = JSON.parse(typewriterElement.getAttribute('data-words'));
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typingSpeed = isDeleting ? 30 : 60;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2200; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 400; // Pause before typing new word
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    // Trigger typewriter on load
    setTimeout(typeEffect, 800);
}


// 4. Interactive Terminal Emulator
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

if (terminalInput && terminalOutput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();
            handleTerminalCommand(command);
            terminalInput.value = '';
        }
    });

    function appendTerminalLine(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.innerHTML = text;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function handleTerminalCommand(cmd) {
        const cleanCmd = cmd.toLowerCase().trim();
        
        // Output prompt echo first
        appendTerminalLine(`<span class="terminal-prompt">guest@subramani:~$</span> ${cmd}`);
        
        if (cleanCmd === '') {
            return;
        }

        switch (cleanCmd) {
            case 'help':
                appendTerminalLine('Available commands:', 'text-system');
                appendTerminalLine('  <span class="text-command">neofetch</span> - View system specs and stats summary');
                appendTerminalLine('  <span class="text-command">about</span>    - Venkata\'s developer background info');
                appendTerminalLine('  <span class="text-command">skills</span>   - List of technical stacks & expertise');
                appendTerminalLine('  <span class="text-command">projects</span> - Showcase of engineered code repositories');
                appendTerminalLine('  <span class="text-command">contact</span>  - Direct phone & email metadata');
                appendTerminalLine('  <span class="text-command">socials</span>  - Online repository and profile links');
                appendTerminalLine('  <span class="text-command">clear</span>    - Wipes terminal logs clean');
                break;
                
            case 'neofetch':
                appendTerminalLine(`
 <span class="text-command">    _   _  ____  </span>       guest@subramani-developer
 <span class="text-command">    | \\ | |/ ___| </span>       -------------------------
 <span class="text-command">    |  \\| | |     </span>       <span class="text-gradient">OS</span>: VenkataOS v1.0.0
 <span class="text-command">    | |\\  | |___  </span>       <span class="text-gradient">Host</span>: Venkata Subramani S
 <span class="text-command">    |_| \\_|\\____| </span>       <span class="text-gradient">Core</span>: Computer Science B.E.
------------------       <span class="text-gradient">Uptime</span>: 2023 - 2027 (Learning Mode)
                         <span class="text-gradient">CGPA</span>: 6.7 / 10.0
                         <span class="text-gradient">SkillRack Problems</span>: 1000+ Solved
                         <span class="text-gradient">LeetCode Problems</span>: 25+ Solved
                         <span class="text-gradient">Shell</span>: guest-bash v4.4
                `.replace(/\n/g, '<br>'));
                break;
                
            case 'about':
                appendTerminalLine('Venkata Subramani S: A goal-oriented Computer Science Engineer who engineers rich frontend UI layouts and backend web platforms. Open to opportunities where coding skill and innovative approach contribute high business value.', 'text-success');
                break;
                
            case 'skills':
                appendTerminalLine('--- TECHNOLOGY STACK ---', 'text-system');
                appendTerminalLine('  <span class="text-command">[Languages]</span>: Java, C, C++, SQL');
                appendTerminalLine('  <span class="text-command">[Web Core]</span>: React JS, HTML5, CSS3, JavaScript');
                appendTerminalLine('  <span class="text-command">[Aventive]</span>: UI/UX Architecture, Responsive layouts');
                appendTerminalLine('  <span class="text-command">[Soft Core]</span>: Problem Solving, Critical Thinking, Time Management');
                break;
                
            case 'projects':
                appendTerminalLine('--- FEATURED PROJECT METADATA ---', 'text-system');
                appendTerminalLine('  1. <span class="text-command">AI interview behaviour analyzer</span>: React, Python, Flask, ML authentic score. <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Repo: github.com/SUBRAMANI408/AI-Based-Coding-Behavior-Analysis-System-for-technical-assessment');
                appendTerminalLine('  2. <span class="text-command">Supermarket billing system</span>: Java inventory billing checkout application.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Repo: github.com/SUBRAMANI408/java_Supermarket-Billing-System.git');
                appendTerminalLine('  3. <span class="text-command">Recipe recom finder</span>: JS pantry food index searcher.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Repo: github.com/SUBRAMANI408/recipe_finder.git');
                appendTerminalLine('  4. <span class="text-command">Healthcare system portal</span>: Web frontend directory reservation scheduler.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Repo: github.com/SUBRAMANI408/MWT-PROJECT-FINAL.git');
                appendTerminalLine('  5. <span class="text-command">Ground booking platform</span>: Flutter mobile field scheduling client.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Repo: github.com/SUBRAMANI408/flutter-project.git');
                break;
                
            case 'contact':
                appendTerminalLine('Phone Direct: +91 9585899506', 'text-success');
                appendTerminalLine('Email Portal: subramani08012004@gmail.com', 'text-success');
                appendTerminalLine('HQ Base: Tirunelveli, Tamil Nadu, India', 'text-success');
                break;
                
            case 'socials':
                appendTerminalLine('  <span class="text-command">GitHub</span>: <a href="https://github.com/SUBRAMANI408" target="_blank" style="color:var(--accent-teal)">github.com/SUBRAMANI408</a>');
                appendTerminalLine('  <span class="text-command">LinkedIn</span>: <a href="#" style="color:var(--accent-teal)">Profile Link</a>');
                break;
                
            case 'clear':
                terminalOutput.innerHTML = '';
                break;
                
            default:
                appendTerminalLine(`Bash command not found: <span class="text-command">${cmd}</span>. Type <span class="text-success">help</span> to view available operations.`, 'text-system');
        }
    }
}


// 5. Scroll Reveal Engine
const revealElements = document.querySelectorAll('.bento-card, .project-box, .hero-glow-card, .contact-layout-box, .section-header');

function revealOnScroll() {
    const windowHeight = window.innerHeight;
    const revealPoint = 75; // px from bottom of screen

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

// Attach event and run initially
window.addEventListener('scroll', revealOnScroll);
// Add class initially to reveal elements
revealElements.forEach(el => el.classList.add('reveal'));
revealOnScroll();
