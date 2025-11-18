// ===================================
// Navigation Component
// ===================================
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.header = document.querySelector('.header');
        
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveLink();
        this.setupScrollEffect();
    }
    
    setupMobileMenu() {
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => {
                this.menuToggle.classList.toggle('active');
                this.navMenu.classList.toggle('active');
                document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
            });
            
            // Close menu when clicking on a link
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.menuToggle.classList.remove('active');
                    this.navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    }
    
    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = this.header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    setupActiveLink() {
        const updateActiveLink = () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };
        
        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();
    }
    
    setupScrollEffect() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add shadow on scroll
            if (currentScroll > 0) {
                this.header.style.boxShadow = 'var(--shadow-md)';
            } else {
                this.header.style.boxShadow = 'var(--shadow-sm)';
            }
            
            lastScroll = currentScroll;
        });
    }
}

// ===================================
// Form Validation Component
// ===================================
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.validators = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
                message: {
                    required: 'Por favor, insira seu nome',
                    minLength: 'Nome deve ter pelo menos 2 caracteres',
                    pattern: 'Nome deve conter apenas letras'
                }
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: {
                    required: 'Por favor, insira seu email',
                    pattern: 'Por favor, insira um email válido'
                }
            },
            subject: {
                required: true,
                minLength: 3,
                message: {
                    required: 'Por favor, insira o assunto',
                    minLength: 'Assunto deve ter pelo menos 3 caracteres'
                }
            },
            message: {
                required: true,
                minLength: 10,
                message: {
                    required: 'Por favor, insira uma mensagem',
                    minLength: 'Mensagem deve ter pelo menos 10 caracteres'
                }
            }
        };
        
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Real-time validation
            Object.keys(this.validators).forEach(fieldName => {
                const field = this.form.querySelector(`#${fieldName}`);
                if (field) {
                    field.addEventListener('blur', () => this.validateField(fieldName));
                    field.addEventListener('input', () => this.clearError(fieldName));
                }
            });
        }
    }
    
    validateField(fieldName) {
        const field = this.form.querySelector(`#${fieldName}`);
        const value = field.value.trim();
        const rules = this.validators[fieldName];
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        
        // Required validation
        if (rules.required && !value) {
            this.showError(formGroup, errorElement, rules.message.required);
            return false;
        }
        
        // Min length validation
        if (rules.minLength && value.length < rules.minLength) {
            this.showError(formGroup, errorElement, rules.message.minLength);
            return false;
        }
        
        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            this.showError(formGroup, errorElement, rules.message.pattern);
            return false;
        }
        
        this.clearError(fieldName);
        return true;
    }
    
    showError(formGroup, errorElement, message) {
        formGroup.classList.add('error');
        errorElement.textContent = message;
    }
    
    clearError(fieldName) {
        const field = this.form.querySelector(`#${fieldName}`);
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        
        formGroup.classList.remove('error');
        errorElement.textContent = '';
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate all fields
        Object.keys(this.validators).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            this.submitForm();
        }
    }
    
    submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show success message
        this.showSuccessMessage();
        
        // Reset form
        this.form.reset();
        
        // In a real application, you would send the data to a server
        console.log('Form submitted with data:', data);
    }
    
    showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: var(--secondary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            animation: slideInRight 0.3s ease-out;
        `;
        successMessage.textContent = '✓ Mensagem enviada com sucesso!';
        
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
            successMessage.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 300);
        }, 3000);
    }
}

// ===================================
// Scroll Animations Component
// ===================================
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        // Observe elements
        const animatedElements = document.querySelectorAll('.tech-card, .project-card, .contact-item');
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ===================================
// Project Cards Hover Effect
// ===================================
class ProjectCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.cards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.style.opacity = '0.7';
                    }
                });
            });
            
            card.addEventListener('mouseleave', () => {
                this.cards.forEach(otherCard => {
                    otherCard.style.opacity = '1';
                });
            });
        });
    }
}

// ===================================
// Dynamic Year in Footer
// ===================================
class Footer {
    constructor() {
        this.updateYear();
    }
    
    updateYear() {
        const yearElements = document.querySelectorAll('.footer-content p');
        if (yearElements.length > 0) {
            const currentYear = new Date().getFullYear();
            const text = yearElements[0].textContent;
            yearElements[0].textContent = text.replace('2024', currentYear);
        }
    }
}

// ===================================
// Utility Functions
// ===================================
const utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// ===================================
// CSS Animations for Success Message
// ===================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Initialize Application
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Navigation();
    new FormValidator('contactForm');
    new ScrollAnimations();
    new ProjectCards();
    new Footer();
    
    // Add loaded class to body for any CSS animations
    document.body.classList.add('loaded');
    
    console.log('Portfolio initialized successfully! 🚀');
});

// ===================================
// Performance Monitoring (optional)
// ===================================
if ('PerformanceObserver' in window) {
    // Monitor page load performance
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    });
}
