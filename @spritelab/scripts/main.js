// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('nav');

if (navToggle) {
    navToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
    });
}

// Close nav when clicking outside or on overlay
document.addEventListener('click', function(e) {
    if (nav && nav.classList.contains('active')) {
        // Check if click is outside nav (including overlay)
        const navRect = nav.getBoundingClientRect();
        const clickedInsideNav = nav.contains(e.target) && 
                                 e.clientX >= navRect.left && 
                                 e.clientX <= navRect.right;
        
        if (!clickedInsideNav && !navToggle.contains(e.target)) {
            nav.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// Close nav when clicking on overlay (pseudo-element click handled via nav click)
document.addEventListener('touchstart', function(e) {
    if (nav && nav.classList.contains('active')) {
        const navRect = nav.getBoundingClientRect();
        if (e.touches[0].clientX < navRect.left) {
            nav.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// Close nav when clicking on a link
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            nav.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// CTA button handlers
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function() {
        const text = this.textContent.trim();
        
        if (text.includes('Наши приложения') || text.includes('Приложения')) {
            document.querySelector('#apps').scrollIntoView({ behavior: 'smooth' });
        } else if (text.includes('Узнать больше')) {
            document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
        } else if (text.includes('Связаться')) {
            document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe app cards
document.querySelectorAll('.app-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe contact items
document.querySelectorAll('.contact-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

