/**
 * Main application script.
 * Implements clean code principles: modularity, SRP, and robust error handling.
 */

document.addEventListener('DOMContentLoaded', () => {
    initIcons();
    initThemeToggle();
    initMobileMenu();
    initTypedEffect();
    initParticlesBackground();
    initContactForm();
    initGitHubStats();
    initScrollSpy();
    initProjectFilters();
});

/**
 * Handles the responsive navigation menu.
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('primary-navigation');
    if (!menuToggle || !navLinks) return;

    const closeMenu = () => {
        navLinks.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
    };

    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', event => {
        if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeMenu();
    });
}

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
    const status = document.getElementById('form-status');
    if (!contactForm) return;

    const emailConfig = {
        publicKey: 'YOUR_PUBLIC_KEY',
        serviceId: 'YOUR_SERVICE_ID',
        templateId: 'YOUR_TEMPLATE_ID'
    };
    const isConfigured = Object.values(emailConfig).every(value => !value.startsWith('YOUR_'));

    contactForm.addEventListener('submit', handleFormSubmit);

    function handleFormSubmit(event) {
        event.preventDefault();
        const btn = event.target.querySelector('.btn-send');
        if (!btn) return;

        if (typeof emailjs === 'undefined' || !isConfigured) {
            setStatus('O formulário ainda não está configurado. Envie sua mensagem pelo e-mail ao lado.', true);
            return;
        }

        updateButtonState(btn, 'ENVIANDO...', true);
        
        emailjs.sendForm(emailConfig.serviceId, emailConfig.templateId, event.target)
            .then(() => {
                updateButtonState(btn, 'ENVIADO!', false);
                event.target.reset();
                setStatus('Mensagem enviada com sucesso!', false);
                resetButtonStateAfterDelay(btn, 3000);
            })
            .catch((error) => {
                console.error("Erro ao enviar email:", error);
                updateButtonState(btn, 'ERRO. TENTE NOVAMENTE.', false);
                setStatus('Não foi possível enviar a mensagem. Tente novamente.', true);
                resetButtonStateAfterDelay(btn, 3000);
            });
    }

    if (typeof emailjs !== 'undefined' && isConfigured) {
        emailjs.init(emailConfig.publicKey);
    }

    function setStatus(message, isError) {
        if (!status) return;
        status.textContent = message;
        status.classList.toggle('is-error', isError);
        status.classList.toggle('is-success', !isError);
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
        const [userResponse, reposResponse] = await Promise.all([
            fetch(`https://api.github.com/users/${GITHUB_USER}`),
            fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`)
        ]);
        if (!userResponse.ok || !reposResponse.ok) {
            throw new Error(`GitHub API error: ${userResponse.status}/${reposResponse.status}`);
        }
        
        const data = await userResponse.json();
        const repositories = await reposResponse.json();
        const stars = repositories.reduce((total, repository) => total + repository.stargazers_count, 0);
        updateGitHubUI(elements, data, stars);

    } catch (error) {
        console.error("Falha ao carregar dados do GitHub:", error);
        handleGitHubError(elements);
    }
}

/**
 * Updates the DOM with GitHub user data.
 */
function updateGitHubUI(elements, data, stars) {
    if (elements.name) elements.name.textContent = data.name || data.login;
    if (elements.bio) elements.bio.textContent = data.bio || `@${data.login}`;
    if (elements.repos) elements.repos.textContent = data.public_repos ?? '–';
    if (elements.followers) elements.followers.textContent = data.followers ?? '–';
    if (elements.following) elements.following.textContent = data.following ?? '–';
    if (elements.statRepos) elements.statRepos.textContent = data.public_repos ?? '–';
    const starsElement = document.getElementById('stat-stars');
    if (starsElement) starsElement.textContent = stars;
}

/**
 * Fallback UI for GitHub stats if the fetch fails.
 */
function handleGitHubError(elements) {
    const unavailable = 'indisponível';
    if (elements.name) elements.name.textContent = 'Danilo Silva';
    if (elements.bio) elements.bio.textContent = '@Danilo019';
    if (elements.statRepos) elements.statRepos.textContent = unavailable;
    if (elements.repos) elements.repos.textContent = unavailable;
    if (elements.followers) elements.followers.textContent = unavailable;
    if (elements.following) elements.following.textContent = unavailable;
    const starsElement = document.getElementById('stat-stars');
    if (starsElement) starsElement.textContent = unavailable;
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
    buttons.forEach(button => {
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
    });
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-pressed', 'true');
}

function filterProjects(cards, filterValue) {
    cards.forEach(card => {
        if (filterValue === 'all') {
            card.style.display = 'block';
            return;
        }

        const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent.trim().toLowerCase());
        if (tags.includes(filterValue.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
