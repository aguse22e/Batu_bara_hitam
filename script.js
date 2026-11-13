/* ═══════════════════════════════════════════
   PT BATU BARA HITAM — INTERACTIONS
   Vanilla JS — no dependencies
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    /* ─── NAVIGATION: shrink + blur on scroll ─── */
    const nav = document.getElementById('mainNav');
    const onScroll = () => {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ─── MOBILE MENU TOGGLE ─── */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const isOpen = navLinks.classList.contains('open');
        navToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // close mobile menu when a link is tapped
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    /* ─── SCROLL REVEAL (IntersectionObserver) ─── */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // trigger counter when stat-item becomes visible
                    if (entry.target.classList.contains('stat-item')) {
                        const counter = entry.target.querySelector('.counter');
                        if (counter) animateCounter(counter);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        // fallback: show everything
        revealEls.forEach(el => el.classList.add('visible'));
    }

    /* ─── ANIMATED COUNTERS ─── */
    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const duration = 1800;
        const start = performance.now();

        function format(n) {
            if (target >= 1000) {
                return new Intl.NumberFormat('id-ID').format(Math.round(n));
            }
            // one decimal place for small numbers like 38.5
            return n.toFixed(1).replace('.', ',');
        }

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutCubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = format(target * eased);
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = format(target);
            }
        }
        requestAnimationFrame(tick);
    }

    /* ─── SMOOTH SCROLL (anchor links) ─── */
    // Native scroll-behavior:smooth handles most cases; this adds offset for fixed nav
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 70;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ─── SUBTLE PARALLAX ON HERO BACKGROUND ─── */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg && window.matchMedia('(min-width: 768px)').matches) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    if (scrolled < window.innerHeight) {
                        heroBg.style.transform = `scale(1.08) translateY(${scrolled * 0.25}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

})();
