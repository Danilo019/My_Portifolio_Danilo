/**
 * Main application script.
 * Implements clean code principles: modularity, SRP, and robust error handling.
 */

document.addEventListener('DOMContentLoaded', () => {
    initIcons();
    initThemeToggle();
    initTypedEffect();
    initParticlesBackground();
    initContactForm();
    initGitHubStats();
    initScrollSpy();
    initProjectFilters();
});

// GSAP animations must run after all layout is painted to calculate positions correctly
if (document.readyState === 'complete') {
    initAnimations();
} else {
    window.addEventListener('load', () => {
        initAnimations();
    });
}

/**
 * Initializes Lucide icons.
 */
function initIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Handles light/dark theme toggling and local storage.
 */
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        updateThemeIcon('sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        
        const newTheme = isLight ? 'light' : 'dark';
        updateThemeIcon(isLight ? 'sun' : 'moon');
        localStorage.setItem('theme', newTheme);
    });

    function updateThemeIcon(iconName) {
        themeToggleBtn.innerHTML = `<i data-lucide="${iconName}"></i>`;
        initIcons();
    }
}

/**
 * Initializes Typed.js for the hero section typing effect.
 */
function initTypedEffect() {
    const typedElement = document.getElementById('typed-text');
    if (!typedElement || typeof Typed === 'undefined') return;

    new Typed('#typed-text', {
        strings: ["interfaces modernas", "sistemas robustos", "APIs eficientes", "soluções com código"],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 1500,
        loop: true,
        showCursor: true,
        cursorChar: '_'
    });
}

/**
 * Initializes tsparticles for the background effect.
 */
function initParticlesBackground() {
    const particlesContainer = document.getElementById('tsparticles');
    if (!particlesContainer || typeof tsParticles === 'undefined') return;

    tsParticles.load("tsparticles", {
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: { enable: true, mode: "grab" },
            },
            modes: { grab: { distance: 150, links: { opacity: 0.5 } } }
        },
        particles: {
            color: { value: "#378ADD" },
            links: { color: "#378ADD", distance: 150, enable: true, opacity: 0.2, width: 1 },
            move: { enable: true, speed: 0.8 },
            number: { density: { enable: true, area: 800 }, value: 50 },
            opacity: { value: 0.3 },
            size: { value: 2 }
        }
    });
}

/**
 * Initializes all GSAP animations and ScrollTrigger.
 */
function initAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero Parallax effect
    gsap.to(".hero-content", {
        y: 150,
        opacity: 0,
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    // Staggered 3D entrance for cards and grids
    animate3DEntrance(".stat-card", ".hero");
    animate3DEntrance(".skill-tag", ".skills-grid");
    animate3DEntrance(".project-card", ".projects-grid");
    animate3DEntrance(".github-card", ".github-section");

    // Force refresh ScrollTrigger to prevent layout bugs
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
}

/**
 * Helper to create 3D entrance animations.
 */
function animate3DEntrance(targetSelector, triggerSelector) {
    const elements = document.querySelectorAll(targetSelector);
    const trigger = document.querySelector(triggerSelector);
    
    if (elements.length === 0 || !trigger) return;

    gsap.fromTo(elements, 
        {
            y: 120,
            opacity: 0,
            rotationX: 30
        },
        {
            y: 0,
            opacity: 1,
            rotationX: 0,
            transformOrigin: "top center",
            stagger: 0.15,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: trigger,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        }
    );
}

/**
 * Initializes the contact form and EmailJS integration.
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm || typeof emailjs === 'undefined') return;

    emailjs.init("YOUR_PUBLIC_KEY"); // Lembre-se de substituir pela chave real

    contactForm.addEventListener('submit', handleFormSubmit);

    function handleFormSubmit(event) {
        event.preventDefault();
        const btn = event.target.querySelector('.btn-send');
        if (!btn) return;

        updateButtonState(btn, 'ENVIANDO...', true);
        
        emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', event.target)
            .then(() => {
                updateButtonState(btn, 'ENVIADO!', false);
                event.target.reset();
                resetButtonStateAfterDelay(btn, 3000);
            })
            .catch((error) => {
                console.error("Erro ao enviar email:", error);
                updateButtonState(btn, 'ERRO. TENTE NOVAMENTE.', false);
                resetButtonStateAfterDelay(btn, 3000);
            });
    }

    function updateButtonState(btn, text, disabled) {
        btn.textContent = text;
        btn.disabled = disabled;
    }

    function resetButtonStateAfterDelay(btn, delayMs) {
        setTimeout(() => {
            btn.textContent = 'ENVIAR MENSAGEM';
            btn.disabled = false;
        }, delayMs);
    }
}

/**
 * Fetches and displays GitHub statistics.
 */
async function initGitHubStats() {
    const GITHUB_USER = 'Danilo019';
    const elements = {
        name: document.getElementById('gh-name'),
        bio: document.getElementById('gh-bio'),
        repos: document.getElementById('gh-repos'),
        followers: document.getElementById('gh-followers'),
        following: document.getElementById('gh-following'),
        statRepos: document.getElementById('stat-repos')
    };

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const data = await response.json();
        updateGitHubUI(elements, data, GITHUB_USER);

    } catch (error) {
        console.error("Falha ao carregar dados do GitHub:", error);
        handleGitHubError(elements, GITHUB_USER);
    }
}

/**
 * Updates the DOM with GitHub user data.
 */
function updateGitHubUI(elements, data, fallbackUser) {
    if (elements.name) elements.name.textContent = data.name || data.login;
    if (elements.bio) elements.bio.textContent = data.bio || `@${data.login}`;
    if (elements.repos) elements.repos.textContent = data.public_repos || '0';
    if (elements.followers) elements.followers.textContent = data.followers || '0';
    if (elements.following) elements.following.textContent = data.following || '0';
    if (elements.statRepos) elements.statRepos.textContent = data.public_repos || '0';
}

/**
 * Fallback UI for GitHub stats if the fetch fails.
 */
function handleGitHubError(elements, fallbackUser) {
    if (elements.bio) elements.bio.textContent = `@${fallbackUser}`;
    if (elements.statRepos) elements.statRepos.textContent = '0';
    if (elements.repos) elements.repos.textContent = '0';
    if (elements.followers) elements.followers.textContent = '0';
    if (elements.following) elements.following.textContent = '0';
}

/**
 * Highlights the active navigation link based on scroll position.
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-links a');

    if (sections.length === 0 || links.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(link => link.style.color = '');
                const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.style.color = 'var(--blue-light)';
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(section => observer.observe(section));
}

/**
 * Initializes the project filtering logic.
 */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length === 0 || projectCards.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateActiveButton(filterBtns, btn);
            filterProjects(projectCards, btn.getAttribute('data-filter'));
            
            // Re-trigger ScrollTrigger to recalculate heights if needed
            if (typeof ScrollTrigger !== 'undefined') {
                setTimeout(() => ScrollTrigger.refresh(), 100);
            }
        });
    });
}

function updateActiveButton(buttons, activeBtn) {
    buttons.forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
}

function filterProjects(cards, filterValue) {
    cards.forEach(card => {
        if (filterValue === 'all') {
            card.style.display = 'block';
            return;
        }

        const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent);
        if (tags.includes(filterValue)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
