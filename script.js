/* ==========================================================================
   SIVAKUMAR DHANUSHKA - PORTFOLIO INTERACTIVE SCRIPT
   Features: Typewriter, Canvas Particle Engine, Project Modal, WhatsApp Chat,
             GitHub DP Fetcher, Contact Form, Scroll Spy, Toast Notifications
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Ambient Particle Canvas
    initParticleCanvas();

    // 2. Initialize Hero Dynamic Typing
    initTypewriter();

    // 3. Initialize Navbar & Scroll Spy
    initNavigation();

    // 4. Initialize Project Filtering & Modals
    initProjectsSystem();

    // 5. Initialize Interactive WhatsApp Live Chat Widget
    initWhatsAppWidget();

    // 6. Initialize Contact Form & Clipboard Toasts
    initContactAndCopy();

    // 7. Initialize 3D Card Tilt Effects
    initTiltEffects();

    // 8. Re-render icons if needed
    if (window.lucide) {
        window.lucide.createIcons();
    }
});

/* ==========================================================================
   1. LIVE GLOBAL CYBER-NETWORK BACKGROUND ENGINE
   Layers: Radial Glow + Hex Grid (bg), Dynamic Mesh Network, 3D Dotted Globe
   ========================================================================== */
function initParticleCanvas() {
    const bgCanvas = document.getElementById('bg');
    const meshCanvas = document.getElementById('mesh');
    const globeCanvas = document.getElementById('globe');

    if (!bgCanvas || !meshCanvas || !globeCanvas) return;

    const bgCtx = bgCanvas.getContext('2d');
    const meshCtx = meshCanvas.getContext('2d');
    const globeCtx = globeCanvas.getContext('2d');

    let width, height;

    // ---- EXACT USER CONFIGURATION ----
    const CONFIG = {
        bgCenter: '#1c3fa0',       // bright blue glow, center-left
        bgEdge: '#060a24',         // near-black navy edges
        nodeColor: '#e9edf6',      // mesh node/line color
        lineOpacity: 0.35,
        nodeRadius: 3,
        meshNodeCount: 40,
        meshRegionX: [0.05, 0.65], // fraction of width the mesh occupies
        meshRegionY: [0.05, 0.75],
        connectDistance: 130,
        hexColor: 'rgba(255,255,255,0.05)',
        hexSize: 44,
        globeDotColor: 'rgba(255,255,255,0.85)',
        globeDotSize: 3,
        globeRadius: 0.30          // fraction of min(width,height)
    };

    const mouse = {
        x: null,
        y: null,
        targetX: null,
        targetY: null,
        isHovering: false,
        radius: 140
    };

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        [bgCanvas, meshCanvas, globeCanvas].forEach(c => {
            c.width = width;
            c.height = height;
        });

        drawBackground();
        drawHexGrid();
        buildMesh();
        buildGlobe();
    }

    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
        if (mouse.x === null) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }
        mouse.isHovering = true;
    });

    window.addEventListener('mouseleave', () => {
        mouse.isHovering = false;
    });

    // --- 1. Background Illumination Gradient ---
    function drawBackground() {
        const grad = bgCtx.createRadialGradient(
            width * 0.32, height * 0.35, 0,
            width * 0.32, height * 0.35, Math.max(width, height) * 0.8
        );
        grad.addColorStop(0, CONFIG.bgCenter);
        grad.addColorStop(1, CONFIG.bgEdge);
        bgCtx.fillStyle = grad;
        bgCtx.fillRect(0, 0, width, height);
    }

    // --- 2. Hexagonal Grid Pattern ---
    function drawHexGrid() {
        const ctx = bgCtx;
        const size = CONFIG.hexSize;
        const hexH = size * Math.sqrt(3);
        ctx.strokeStyle = CONFIG.hexColor;
        ctx.lineWidth = 1;

        for (let row = -1; row * hexH * 0.75 < height + hexH; row++) {
            for (let col = -1; col * size * 1.5 < width + size * 2; col++) {
                const x = col * size * 1.5 + width * 0.45;
                const y = row * hexH * 0.75 + (col % 2 ? hexH / 2 : 0);
                if (x < width * 0.4) continue;
                drawHex(ctx, x, y, size * 0.6);
            }
        }
    }

    function drawHex(ctx, cx, cy, r) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    // --- 3. Dynamic Connected Mesh Network ---
    let meshNodes = [];

    function buildMesh() {
        meshNodes = [];
        const x0 = width * CONFIG.meshRegionX[0], x1 = width * CONFIG.meshRegionX[1];
        const y0 = height * CONFIG.meshRegionY[0], y1 = height * CONFIG.meshRegionY[1];

        for (let i = 0; i < CONFIG.meshNodeCount; i++) {
            meshNodes.push({
                x: x0 + Math.random() * (x1 - x0),
                y: y0 + Math.random() * (y1 - y0),
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                minX: x0 - 40,
                maxX: x1 + 40,
                minY: y0 - 40,
                maxY: y1 + 40
            });
        }
    }

    function drawMesh() {
        meshCtx.clearRect(0, 0, width, height);

        // Smooth mouse position interpolation
        if (mouse.targetX !== null) {
            mouse.x += (mouse.targetX - mouse.x) * 0.08;
            mouse.y += (mouse.targetY - mouse.y) * 0.08;
        }

        // Update node positions and apply gentle boundaries & mouse repulsion
        for (let i = 0; i < meshNodes.length; i++) {
            const n = meshNodes[i];
            n.x += n.vx;
            n.y += n.vy;

            if (n.x < n.minX || n.x > n.maxX) n.vx *= -1;
            if (n.y < n.minY || n.y > n.maxY) n.vy *= -1;

            if (mouse.isHovering && mouse.x !== null) {
                const dx = mouse.x - n.x;
                const dy = mouse.y - n.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const force = (1 - dist / mouse.radius) * 1.2;
                    const angle = Math.atan2(dy, dx);
                    n.x -= Math.cos(angle) * force;
                    n.y -= Math.sin(angle) * force;
                }
            }
        }

        // Draw connecting lines
        for (let i = 0; i < meshNodes.length; i++) {
            for (let j = i + 1; j < meshNodes.length; j++) {
                const a = meshNodes[i], b = meshNodes[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < CONFIG.connectDistance) {
                    const alpha = CONFIG.lineOpacity * (1 - dist / CONFIG.connectDistance);
                    meshCtx.strokeStyle = `rgba(233,237,246,${alpha})`;
                    meshCtx.lineWidth = 0.7;
                    meshCtx.beginPath();
                    meshCtx.moveTo(a.x, a.y);
                    meshCtx.lineTo(b.x, b.y);
                    meshCtx.stroke();
                }
            }
        }

        // Draw nodes
        meshCtx.fillStyle = CONFIG.nodeColor;
        for (const n of meshNodes) {
            meshCtx.beginPath();
            meshCtx.arc(n.x, n.y, CONFIG.nodeRadius, 0, Math.PI * 2);
            meshCtx.fill();
        }
    }

    // --- 4. 3D Rotating Dotted Globe ---
    let globeDots = [];
    let globeAngle = 0;

    function buildGlobe() {
        globeDots = [];
        const cx = width >= 992 ? width * 0.82 : width * 0.5;
        const cy = width >= 992 ? height * 0.62 : height * 0.38;
        const r = Math.min(width, height) * CONFIG.globeRadius;
        const spacing = 11;

        for (let y = -r; y <= r; y += spacing) {
            for (let x = -r; x <= r; x += spacing) {
                const distFromCenter = Math.sqrt(x * x + y * y);
                if (distFromCenter <= r) {
                    const edgeFactor = distFromCenter / r;
                    if (Math.random() < 0.85 || edgeFactor < 0.6) {
                        const z = Math.sqrt(Math.max(0, r * r - x * x - y * y));
                        globeDots.push({
                            relX: x,
                            relY: y,
                            relZ: z,
                            cx,
                            cy,
                            r,
                            baseOpacity: 1 - edgeFactor * 0.5
                        });
                    }
                }
            }
        }
    }

    function drawGlobe() {
        globeCtx.clearRect(0, 0, width, height);

        globeAngle += 0.004;
        const cosA = Math.cos(globeAngle);
        const sinA = Math.sin(globeAngle);

        for (const d of globeDots) {
            // Rotate around Y axis
            const rotX = d.relX * cosA - d.relZ * sinA;
            const rotZ = d.relX * sinA + d.relZ * cosA;

            const posX = d.cx + rotX;
            const posY = d.cy + d.relY;

            // Depth calculation (-r to +r)
            const depthFactor = (rotZ + d.r) / (2 * d.r);
            const currentOpacity = Math.max(0.12, d.baseOpacity * (0.3 + depthFactor * 0.7));
            const size = Math.max(1.2, CONFIG.globeDotSize * (0.6 + depthFactor * 0.5));

            globeCtx.beginPath();
            globeCtx.arc(posX, posY, size, 0, Math.PI * 2);
            globeCtx.fillStyle = `rgba(255,255,255,${currentOpacity})`;
            globeCtx.fill();
        }
    }

    // --- Animation Loop ---
    function animate() {
        drawMesh();
        drawGlobe();
        requestAnimationFrame(animate);
    }

    resize();
    animate();
}

/* ==========================================================================
   2. TYPEWRITER DYNAMIC TEXT
   ========================================================================== */
function initTypewriter() {
    const textElement = document.getElementById('typewriter-text');
    if (!textElement) return;

    const words = [
        'Full-Stack MERN Developer',
        'IT Infrastructure Specialist',
        'ERP & SAP Support Engineer',
        'Network & Systems Enthusiast',
        'React & Node.js Creator'
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 110;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1800; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 400; // Pause before new word
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ==========================================================================
   3. NAVIGATION & SCROLL SPY
   ========================================================================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('section[id]');
    const navToggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileClose = document.getElementById('mobile-close');
    const mobileBackdrop = document.getElementById('mobile-backdrop');

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Section Scroll Spy
        let currentSection = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Drawer Handlers
    function openMobileNav() {
        mobileNav.classList.add('open');
        mobileBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        mobileNav.classList.remove('open');
        mobileBackdrop.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (navToggle) navToggle.addEventListener('click', openMobileNav);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
    if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileNav);

    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
        link.addEventListener('click', closeMobileNav);
    });
}

/* ==========================================================================
   4. PROJECTS SYSTEM & DETAILED MODAL VIEWER
   ========================================================================== */
const projectsData = {
    yoyo: {
        title: 'YoYo - MERN Stack E-Commerce Platform',
        category: 'Full-Stack MERN Application',
        image: 'assets/ecommerce-websites.jpg',
        description: 'A comprehensive, feature-rich electronic commerce application engineered with MongoDB, Express, React, and Node.js. It delivers seamless user catalog browsing, state-managed shopping carts, dynamic inventory filtering, user profile authentication with JWT tokens, order management, and secure Stripe payment gateway integration.',
        features: [
            'End-to-End RESTful API architecture with Express and MongoDB / Mongoose',
            'State management using Redux Toolkit for cart state and user session persistence',
            'Full Admin Dashboard for product creation, image uploading, and inventory editing',
            'Integrated Stripe payment checkout with webhook verification',
            'Open-source repository with full source code available on GitHub'
        ],
        techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redux', 'Stripe API', 'JWT', 'Tailwind CSS'],
        githubLink: 'https://github.com/sivakumardhanushka/Yoyo-Ecommerce',
        whatsappMsg: "Hi Sivakumar, I'm interested in discussing your YoYo MERN E-Commerce platform on GitHub!"
    },
    realestate: {
        title: 'Dude Estates - Luxury Real Estate Platform',
        category: 'Modern Web Application',
        image: 'assets/house - 07.jpg',
        description: 'A high-converting, design-forward real estate portal built with modern semantic HTML5, custom CSS styling with glassmorphism, and vanilla JavaScript. Features dynamic property search filters, interactive cards with 3D tilt micro-interactions, modal specifications, virtual tour previews, and client inquiry forms.',
        features: [
            'Responsive property search engine filtering by location, price, and property type',
            'Engaging visual aesthetics with 3D tilt cards and smooth entrance animations',
            'Interactive modal property specifications with high-resolution image galleries',
            'Integrated customer inquiry form and booking appointment triggers',
            'Clean GitHub repository with modern responsive frontend implementation'
        ],
        techStack: ['HTML5', 'Modern CSS3', 'JavaScript ES6+', 'UI/UX Design', 'Responsive Grid'],
        githubLink: 'https://github.com/sivakumardhanushka/Real-Estate-website',
        whatsappMsg: "Hi Sivakumar, I checked out your Real-Estate-website GitHub repository!"
    },
    jaffna: {
        title: 'Tourism in Jaffna - Cultural Heritage Portal',
        category: 'Cultural & Tourism Web Platform',
        image: 'assets/sa-rapita- 20.jpg',
        description: 'A dedicated cultural tourism and travel exploration website showcasing the historical monuments, temples, coastal landscapes, and cultural heritage of Jaffna and the Northern Province of Sri Lanka. Built with rich multimedia galleries, video sections, and travel route highlights.',
        features: [
            'Comprehensive cultural landmark directory with historical context and photography',
            'Interactive multimedia video and photography gallery components',
            'Travel itinerary suggestions and destination navigation guides',
            'Public open-source repository available on GitHub with full assets and layouts'
        ],
        techStack: ['HTML5', 'CSS3', 'JavaScript', 'Multimedia Integration', 'Responsive Design'],
        githubLink: 'https://github.com/sivakumardhanushka/Tourisum-in-Jaffna',
        whatsappMsg: "Hi Sivakumar, I enjoyed your Tourisum-in-Jaffna GitHub project and want to connect!"
    },
    employee: {
        title: 'Enterprise Employee Management Desktop Suite',
        category: 'Enterprise Java Application',
        image: 'assets/food-ecommerce.jpg',
        description: 'A comprehensive Java desktop enterprise management solution designed for corporate personnel administration. Connected to a MySQL relational database via JDBC, the system handles employee records, department structures, leave/attendance tracking, role-based access control, and salary slip generation.',
        features: [
            'Robust Java Swing desktop GUI with form validation and dynamic table models',
            'Secure MySQL relational database schema with ACID-compliant transactions via JDBC',
            'Role-based access control (Admin vs. HR vs. Department Staff)',
            'Comprehensive search, filter, update, and deletion operations for employee profiles',
            'Published Java repository on GitHub with complete database drivers and Swing UI'
        ],
        techStack: ['Java', 'MySQL Database', 'JDBC Driver', 'Swing UI', 'Enterprise Security'],
        githubLink: 'https://github.com/sivakumardhanushka/Employe-Management-system',
        whatsappMsg: "Hi Sivakumar, let's discuss your Employe-Management-system GitHub project!"
    },
    calculator: {
        title: 'Advanced Scientific Calculator Suite',
        category: 'Desktop Software Suite',
        image: 'assets/architecture - 02.jpg',
        description: 'A high-precision desktop mathematical calculator built with C# .NET. Capable of handling complex multi-variable equations, trigonometric operations (sin, cos, tan, radians/degrees), logarithmic and exponential functions, memory registers, and custom mathematical expression parsing.',
        features: [
            'Full suite of basic arithmetic and advanced scientific mathematical operations',
            'Trigonometric functions (standard and inverse) with angle mode conversion',
            'Memory management registers (M+, M-, MR, MC) for multi-step calculations',
            'Clean dark desktop interface with keyboard shortcuts and history tracking',
            'Complete C# .NET source code published in public GitHub repository'
        ],
        techStack: ['C# .NET', 'Windows Forms / WPF', 'Mathematical Algorithms', 'Expression Parser'],
        githubLink: 'https://github.com/sivakumardhanushka/Scientific-Calculator',
        whatsappMsg: "Hi Sivakumar, I saw your Scientific-Calculator GitHub repository!"
    }
};

function initProjectsSystem() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close-btn');

    // Filter Logic
    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach((card) => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    // Open Modal
    document.querySelectorAll('.open-project-modal').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const projectId = btn.getAttribute('data-project-id');
            const data = projectsData[projectId];
            if (!data) return;

            modalContent.innerHTML = `
                <img src="${data.image}" alt="${data.title}" class="modal-thumb">
                <span class="section-tag" style="margin-bottom:0.75rem;">${data.category}</span>
                <h2 style="font-size:1.85rem; font-weight:800; margin-bottom:1rem;">${data.title}</h2>
                <p style="color:var(--text-secondary); line-height:1.75; font-size:1rem; margin-bottom:1.5rem;">${data.description}</p>
                
                <h4 style="font-size:1.15rem; font-weight:700; margin-bottom:0.75rem; color:#ffffff;">Key Architecture & Features</h4>
                <ul style="list-style:none; display:flex; flex-direction:column; gap:0.65rem; margin-bottom:1.75rem;">
                    ${data.features.map(f => `
                        <li style="display:flex; align-items:flex-start; gap:0.6rem; color:var(--text-secondary); font-size:0.95rem;">
                            <i data-lucide="check-circle-2" style="width:18px; height:18px; color:var(--accent-secondary); flex-shrink:0; margin-top:2px;"></i>
                            <span>${f}</span>
                        </li>
                    `).join('')}
                </ul>

                <h4 style="font-size:1.15rem; font-weight:700; margin-bottom:0.75rem; color:#ffffff;">Technologies Used</h4>
                <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:2rem;">
                    ${data.techStack.map(t => `<span class="tech-tag" style="padding:0.4rem 0.85rem; font-size:0.85rem;">${t}</span>`).join('')}
                </div>

                <div style="display:flex; flex-wrap:wrap; gap:1rem; border-top:1px solid var(--border-glass); padding-top:1.5rem;">
                    <a href="${data.githubLink}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="flex:1;">
                        <i data-lucide="github" style="width:18px;"></i>
                        <span>View on GitHub</span>
                    </a>
                    <a href="https://wa.me/94777683147?text=${encodeURIComponent(data.whatsappMsg)}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="flex:1;">
                        <i data-lucide="message-circle" style="width:18px;"></i>
                        <span>Discuss via WhatsApp</span>
                    </a>
                </div>
            `;

            if (window.lucide) window.lucide.createIcons();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close Modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   5. FLOATING WHATSAPP QUICK CHAT WIDGET
   ========================================================================== */
function initWhatsAppWidget() {
    const trigger = document.getElementById('whatsapp-trigger');
    const popup = document.getElementById('whatsapp-popup');
    const popupClose = document.getElementById('whatsapp-popup-close');
    const quickInput = document.getElementById('whatsapp-quick-input');
    const sendBtn = document.getElementById('whatsapp-send-btn');
    const promptButtons = document.querySelectorAll('.quick-prompt-btn');

    const whatsappPhone = '94777683147';

    function togglePopup() {
        popup.classList.toggle('active');
    }

    function closePopup() {
        popup.classList.remove('active');
    }

    if (trigger) trigger.addEventListener('click', togglePopup);
    if (popupClose) popupClose.addEventListener('click', closePopup);

    function sendToWhatsApp(message) {
        if (!message || message.trim() === '') {
            message = "Hi Sivakumar, I saw your portfolio and would like to connect!";
        }
        const encoded = encodeURIComponent(message);
        const url = `https://wa.me/${whatsappPhone}?text=${encoded}`;
        window.open(url, '_blank');
        closePopup();
        if (quickInput) quickInput.value = '';
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const msg = quickInput ? quickInput.value : '';
            sendToWhatsApp(msg);
        });
    }

    if (quickInput) {
        quickInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendToWhatsApp(quickInput.value);
            }
        });
    }

    promptButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const promptText = btn.getAttribute('data-text');
            sendToWhatsApp(promptText);
        });
    });
}

/* ==========================================================================
   6. CONTACT FORM & CLIPBOARD TOASTS
   ========================================================================== */
function initContactAndCopy() {
    const contactForm = document.getElementById('portfolio-contact-form');
    const btnSubmitWhatsapp = document.getElementById('btn-submit-whatsapp');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const whatsappPhone = '94777683147';

    // WhatsApp Submit from Contact Form
    if (btnSubmitWhatsapp) {
        btnSubmitWhatsapp.addEventListener('click', () => {
            const name = document.getElementById('contact-name')?.value || 'Prospective Client';
            const subject = document.getElementById('contact-subject')?.value || 'Project Inquiry';
            const message = document.getElementById('contact-message')?.value || 'I would like to discuss a project with you.';

            const formattedMsg = `*New Portfolio Inquiry*\n\n👤 *Name:* ${name}\n📌 *Subject:* ${subject}\n💬 *Message:* ${message}`;
            const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(formattedMsg)}`;
            window.open(url, '_blank');
            showToast('Opening WhatsApp with your inquiry message...');
        });
    }

    // Email Submit
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name')?.value || '';
            const subject = document.getElementById('contact-subject')?.value || '';
            const message = document.getElementById('contact-message')?.value || '';

            const mailtoUrl = `mailto:Sivakumardhanushk@gmail.com?subject=${encodeURIComponent(`[Portfolio] ${subject} - ${name}`)}&body=${encodeURIComponent(`Hi Sivakumar,\n\n${message}\n\nBest regards,\n${name}`)}`;
            window.location.href = mailtoUrl;
            showToast('Opening email client...');
        });
    }

    // Copy to Clipboard Buttons
    copyButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(`Copied to clipboard: ${textToCopy}`);
                });
            } else {
                showToast(`Address: ${textToCopy}`);
            }
        });
    });
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i data-lucide="check" style="width:18px;height:18px;color:#34d399;"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

/* ==========================================================================
   7. 3D CARD TILT EFFECT ON HOVER
   ========================================================================== */
function initTiltEffects() {
    const tiltCards = document.querySelectorAll('.glass-card, .project-card');

    tiltCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}
