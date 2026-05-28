/* ============================================================
   DEVELOPER PORTFOLIO — Complete Interactive JavaScript
   Pure Vanilla JS · ES6+ · No External Dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     UTILITY HELPERS
  ---------------------------------------------------------- */

  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const isTouchDevice = () =>
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

  const throttleRAF = (fn) => {
    let ticking = false;
    return (...args) => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          fn(...args);
          ticking = false;
        });
      }
    };
  };

  const debounce = (fn, ms = 250) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  };

  /* ----------------------------------------------------------
     1. CUSTOM CURSOR
  ---------------------------------------------------------- */

  const initCustomCursor = () => {
    if (isTouchDevice()) return;

    const cursorDot = qs('.custom-cursor');
    const cursorRing = qs('.cursor-follower');
    if (!cursorDot || !cursorRing) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    const lerpFactor = 0.15;

    const interactiveSelectors =
      'a, button, .project-card, .skill-category, .social-link, .contact-card, .certification-card, .achievement-card';

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * lerpFactor;
      ringY += (mouseY - ringY) * lerpFactor;
      cursorRing.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
      requestAnimationFrame(animateRing);
    };
    requestAnimationFrame(animateRing);

    const interactiveEls = qsa(interactiveSelectors);
    interactiveEls.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hover');
        cursorRing.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hover');
        cursorRing.classList.remove('hover');
      });
    });

    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
  };

  /* ----------------------------------------------------------
     2. THEME TOGGLE
  ---------------------------------------------------------- */

  const initThemeToggle = () => {
    const toggleBtn = qs('.theme-toggle');
    if (!toggleBtn) return;

    const htmlEl = document.documentElement;
    const stored = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', stored);
    updateThemeIcon(toggleBtn, stored);

    toggleBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(toggleBtn, next);
    });
  };

  function updateThemeIcon(btn, theme) {
    if (theme === 'dark') {
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>`;
    } else {
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>`;
    }
  }

  /* ----------------------------------------------------------
     3. NAVBAR SCROLL EFFECT
  ---------------------------------------------------------- */

  const initNavbarScroll = () => {
    const navbar = qs('.navbar');
    if (!navbar) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', throttleRAF(handleScroll), { passive: true });
    handleScroll();
  };

  /* ----------------------------------------------------------
     4. ACTIVE SECTION HIGHLIGHTING
  ---------------------------------------------------------- */

  const initActiveSectionHighlighting = () => {
    const sections = qsa('section');
    const navLinks = qsa('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -40% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  };

  /* ----------------------------------------------------------
     5. MOBILE MENU
  ---------------------------------------------------------- */

  const initMobileMenu = () => {
    const hamburger = qs('.hamburger');
    const mobileMenu = qs('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    const toggleMenu = () => {
      const isActive = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMenu);

    qsa('.mobile-nav-link', mobileMenu).forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  };

  /* ----------------------------------------------------------
     6. SMOOTH SCROLLING (shared utility)
  ---------------------------------------------------------- */

  const smoothScrollTo = (targetId, offset = 70) => {
    const target = qs(targetId);
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  /* ----------------------------------------------------------
     7. TYPEWRITER EFFECT
  ---------------------------------------------------------- */

  const initTypewriter = () => {
    const el = qs('.typewriter');
    if (!el) return;

    const strings = [
      'Java Full Stack Developer',
      'Spring Boot Developer',
      'React JS Developer',
      'Problem Solver',
      'Tech Enthusiast',
    ];

    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const current = strings[stringIndex];

      if (!isDeleting) {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(type, 2000);
          return;
        }
        setTimeout(type, 80);
      } else {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          stringIndex = (stringIndex + 1) % strings.length;
          setTimeout(type, 500);
          return;
        }
        setTimeout(type, 40);
      }
    };

    type();
  };

  /* ----------------------------------------------------------
     8. PARTICLE BACKGROUND
  ---------------------------------------------------------- */

  const initParticles = () => {
    const canvas = qs('#particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    const PARTICLE_COUNT = 80;
    const CONNECTION_DISTANCE = 120;
    const particles = [];

    const resize = () => {
      const parent = canvas.parentElement || document.body;
      width = canvas.width = parent.offsetWidth;
      height = canvas.height = parent.offsetHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 1.2;
        this.speedY = (Math.random() - 0.5) * 1.2;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color =
          Math.random() > 0.5
            ? `rgba(108, 99, 255, ${this.opacity})`
            : `rgba(0, 210, 255, ${this.opacity})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > width) this.x = 0;
        else if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        else if (this.y < 0) this.y = height;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const createParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    };

    const connectParticles = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const opacity = 1 - dist / CONNECTION_DISTANCE;
            ctx.strokeStyle = `rgba(108, 99, 255, ${opacity * 0.25})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener(
      'resize',
      debounce(() => {
        resize();
        createParticles();
      }, 300)
    );
  };

  /* ----------------------------------------------------------
     9. SCROLL REVEAL ANIMATIONS
  ---------------------------------------------------------- */

  const initScrollReveal = () => {
    const reveals = qsa('.reveal-left, .reveal-right, .reveal-up, .reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
            setTimeout(() => el.classList.add('revealed'), delay);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  };

  /* ----------------------------------------------------------
     10. ANIMATED COUNTERS
  ---------------------------------------------------------- */

  const initCounters = () => {
    const counters = qsa('.stat-number[data-target]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 2000;
      const startTime = performance.now();

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.textContent = value + '+';

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + '+';
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => observer.observe(c));
  };

  /* ----------------------------------------------------------
     11. SKILL BAR ANIMATIONS
  ---------------------------------------------------------- */

  const initSkillBars = () => {
    const bars = qsa('.skill-progress');
    if (!bars.length) return;

    let animated = false;

    const animateBars = () => {
      if (animated) return;
      animated = true;

      bars.forEach((bar, i) => {
        const targetWidth = bar.getAttribute('data-width') || '0';
        setTimeout(() => {
          bar.style.width = targetWidth + '%';
        }, i * 100);
      });
    };

    const skillSection =
      qs('#skills') ||
      (bars[0] && bars[0].closest('section'));

    if (!skillSection) {
      animateBars();
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateBars();
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(skillSection);
  };

  /* ----------------------------------------------------------
     12. PROJECT CARD INTERACTIONS
  ---------------------------------------------------------- */

  const initProjectCards = () => {
    const cards = qsa('.project-card');
    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;

        const details = qs('.project-details-expanded', card);
        if (details) {
          card.classList.toggle('expanded');
        }
      });
    });
  };

  /* ----------------------------------------------------------
     13. CONTACT FORM VALIDATION
  ---------------------------------------------------------- */

  const initContactForm = () => {
    const form = qs('#contact-form');
    if (!form) return;

    const successMsg = qs('.form-success');

    const showError = (group, msg) => {
      group.classList.add('error');
      let errEl = qs('.error-message', group);
      if (!errEl) {
        errEl = document.createElement('span');
        errEl.classList.add('error-message');
        group.appendChild(errEl);
      }
      errEl.textContent = msg;
    };

    const clearErrors = () => {
      qsa('.form-group', form).forEach((g) => {
        g.classList.remove('error');
        const errEl = qs('.error-message', g);
        if (errEl) errEl.textContent = '';
      });
    };

    const validateEmail = (email) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      const nameInput = qs('[name="name"], #name', form);
      const emailInput = qs('[name="email"], #email', form);
      const messageInput = qs('[name="message"], #message', form);

      let valid = true;

      if (nameInput) {
        const val = nameInput.value.trim();
        if (!val) {
          showError(nameInput.closest('.form-group'), 'Name is required');
          valid = false;
        }
      }

      if (emailInput) {
        const val = emailInput.value.trim();
        if (!val) {
          showError(emailInput.closest('.form-group'), 'Email is required');
          valid = false;
        } else if (!validateEmail(val)) {
          showError(emailInput.closest('.form-group'), 'Please enter a valid email');
          valid = false;
        }
      }

      if (messageInput) {
        const val = messageInput.value.trim();
        if (!val) {
          showError(messageInput.closest('.form-group'), 'Message is required');
          valid = false;
        } else if (val.length < 10) {
          showError(
            messageInput.closest('.form-group'),
            'Message must be at least 10 characters'
          );
          valid = false;
        }
      }

      if (!valid) return;

      form.style.display = 'none';
      if (successMsg) successMsg.classList.add('show');

      setTimeout(() => {
        if (successMsg) successMsg.classList.remove('show');
        form.reset();
        form.style.display = '';
      }, 3000);
    });
  };

  /* ----------------------------------------------------------
     14. COPY TO CLIPBOARD
  ---------------------------------------------------------- */

  const initCopyToClipboard = () => {
    const copyBtns = qsa('.copy-btn');
    if (!copyBtns.length) return;

    copyBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();

        const parent = btn.closest('.contact-card') || btn.parentElement;
        const valueEl = parent ? qs('.contact-value', parent) : null;
        const text =
          (valueEl && (valueEl.textContent || valueEl.innerText).trim()) || '';

        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
          showCopiedToast(btn);
        }).catch(() => {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showCopiedToast(btn);
        });

        createRipple(e, btn);
      });
    });
  };

  function showCopiedToast(anchorEl) {
    const toast = document.createElement('div');
    toast.classList.add('copied-toast');
    toast.textContent = 'Copied!';
    toast.style.cssText = `
      position: absolute;
      top: -35px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-color, #6c63ff);
      color: #fff;
      padding: 4px 14px;
      border-radius: 6px;
      font-size: 0.8rem;
      pointer-events: none;
      opacity: 1;
      transition: opacity 0.4s ease, transform 0.4s ease;
      z-index: 9999;
      white-space: nowrap;
    `;

    const wrapper = anchorEl.parentElement;
    if (wrapper) {
      wrapper.style.position = wrapper.style.position || 'relative';
      wrapper.appendChild(toast);
    } else {
      document.body.appendChild(toast);
    }

    requestAnimationFrame(() => {
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-8px)';
        setTimeout(() => toast.remove(), 400);
      }, 1500);
    });
  }

  /* ----------------------------------------------------------
     15. SCROLL-TO-TOP BUTTON
  ---------------------------------------------------------- */

  const initScrollToTop = () => {
    const btn = qs('.scroll-top');
    if (!btn) return;

    const toggle = () => {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', throttleRAF(toggle), { passive: true });
    toggle();

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  /* ----------------------------------------------------------
     16. BUTTON RIPPLE EFFECT
  ---------------------------------------------------------- */

  function createRipple(e, button) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.35);
      transform: scale(0);
      animation: rippleAnim 600ms ease-out forwards;
      pointer-events: none;
    `;

    button.style.position = button.style.position || 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  const initRippleEffect = () => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rippleAnim {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-primary, .btn-secondary, .submit-btn');
      if (btn) createRipple(e, btn);
    });
  };

  /* ----------------------------------------------------------
     17. MOUSE TRACKING PARALLAX IN HERO
  ---------------------------------------------------------- */

  const initHeroParallax = () => {
    const hero = qs('#hero') || qs('.hero');
    if (!hero) return;

    const floatingIcons = qsa('.floating-icon', hero);
    const imageContainer = qs('.image-container', hero);

    if (!floatingIcons.length && !imageContainer) return;

    const MAX_SHIFT = 15;

    hero.addEventListener(
      'mousemove',
      throttleRAF((e) => {
        const rect = hero.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;

        floatingIcons.forEach((icon, i) => {
          const factor = (i % 3 + 1) * 0.5;
          const tx = cx * MAX_SHIFT * factor;
          const ty = cy * MAX_SHIFT * factor;
          icon.style.transform = `translate(${tx}px, ${ty}px)`;
        });

        if (imageContainer) {
          const tx = cx * MAX_SHIFT * 0.4;
          const ty = cy * MAX_SHIFT * 0.4;
          imageContainer.style.transform = `translate(${tx}px, ${ty}px)`;
        }
      })
    );
  };

  /* ----------------------------------------------------------
     18. NAVBAR LINK SMOOTH SCROLL
  ---------------------------------------------------------- */

  const initNavLinkScroll = () => {
    const allLinks = qsa('.nav-link, .mobile-nav-link');
    if (!allLinks.length) return;

    allLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        e.preventDefault();
        smoothScrollTo(href, 70);
        history.pushState(null, '', href);
      });
    });
  };

  /* ----------------------------------------------------------
     19. HERO IDE CARD TABS & TERMINAL TELEMETRY
  ---------------------------------------------------------- */

  const initHeroIdeCard = () => {
    const tabs = qsa('.ide-tab');
    const contents = qsa('.ide-code-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const file = tab.getAttribute('data-file');
        
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        contents.forEach(content => {
          content.classList.remove('active');
          if (content.id === `code-${file.split('.')[1]}`) {
            content.classList.add('active');
          }
        });
      });
    });

    const logBox = qs('#terminal-logs');
    if (!logBox) return;

    const newLogs = [
      '[INFO] Connection established to MySQL database on port 3306',
      '[INFO] GET /api/v1/employees - 200 OK (22ms)',
      '[INFO] POST /api/v1/messages - Created (15ms)',
      '[INFO] HikariPool-1 - Connection active...',
      '[INFO] Rendered dashboard client-side using React in 8.4ms',
      '[INFO] GET /api/v1/skills - 200 OK (11ms)'
    ];

    let logIdx = 0;
    setInterval(() => {
      const p = document.createElement('div');
      p.className = 'log-line info';
      p.textContent = newLogs[logIdx];
      logBox.appendChild(p);
      logBox.scrollTop = logBox.scrollHeight;
      logIdx = (logIdx + 1) % newLogs.length;

      if (logBox.children.length > 8) {
        logBox.removeChild(logBox.children[0]);
      }
    }, 4000);
  };

  /* ----------------------------------------------------------
     20. LOADING / INIT
  ---------------------------------------------------------- */

  const init = () => {
    initCustomCursor();
    initThemeToggle();
    initNavbarScroll();
    initActiveSectionHighlighting();
    initMobileMenu();
    initTypewriter();
    initParticles();
    initScrollReveal();
    initCounters();
    initSkillBars();
    initProjectCards();
    initContactForm();
    initCopyToClipboard();
    initScrollToTop();
    initRippleEffect();
    initHeroParallax();
    initNavLinkScroll();
    initHeroIdeCard();

    setTimeout(() => document.body.classList.add('loaded'), 200);
  };

  init();
});
