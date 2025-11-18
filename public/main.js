    // Mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      const newExpanded = !expanded;
      navToggle.setAttribute('aria-expanded', newExpanded);
      navToggle.setAttribute('aria-label', newExpanded ? 'Close navigation menu' : 'Open navigation menu');
      navMenu.classList.toggle('open');

      // Focus management for accessibility
      if (newExpanded) {
        // Focus first menu item when opening
        const firstMenuItem = navMenu.querySelector('a');
        if (firstMenuItem) {
          setTimeout(() => firstMenuItem.focus(), 100);
        }
      }
    });
    // Smooth scroll and active link highlighting
    const navLinks = [...document.querySelectorAll('.nav-link')];
    const sections = [...document.querySelectorAll('main section')];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function activateNav(idx) { navLinks.forEach((a, i) => a.classList.toggle('active', idx === i)); }
    function scrollToSection(target) {
      if (!target) return;
      const offset = target.offsetTop - 61;
      if (prefersReducedMotion.matches) {
        window.scrollTo(0, offset);
      } else {
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
      try {
        target.focus({ preventScroll: true });
      } catch (_) {
        target.focus();
      }
    }
    window.addEventListener('scroll', () => {
      let idx = 0, from = window.scrollY + 82;
      sections.forEach((sec, i) => { if (sec.offsetTop - 60 < from) idx = i; });
      activateNav(idx);
    });
    navLinks.forEach((link, idx) => {
      link.addEventListener('click', e => {
        e.preventDefault();
        if (window.innerWidth < 769) {
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Open navigation menu');
        }
        const targetId = link.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          if (!target.hasAttribute('tabindex')) { target.setAttribute('tabindex', '-1'); }
          scrollToSection(target);
          activateNav(idx);
        }
      });

      // Enhanced keyboard navigation for menu items
      link.addEventListener('keydown', (e) => {
        if (window.innerWidth < 769 && navMenu.classList.contains('open')) {
          switch (e.key) {
            case 'Escape':
              e.preventDefault();
              navMenu.classList.remove('open');
              navToggle.setAttribute('aria-expanded', 'false');
              navToggle.setAttribute('aria-label', 'Open navigation menu');
              navToggle.focus();
              break;
            case 'ArrowDown':
              e.preventDefault();
              const nextLink = navLinks[idx + 1] || navLinks[0];
              nextLink.focus();
              break;
            case 'ArrowUp':
              e.preventDefault();
              const prevLink = navLinks[idx - 1] || navLinks[navLinks.length - 1];
              prevLink.focus();
              break;
          }
        }
      });
    });
    // Song list modal
    const songOverlay = document.querySelector('.songlist-overlay');
    const openSongBtn = document.querySelector('.songlist-open');
    const closeSongBtn = document.querySelector('.songlist-overlay .modal-close');
    const downloadSongBtn = document.querySelector('.songlist-download');
    const songListText = `
<div style="font-family:system-ui,sans-serif;font-size:1rem;padding:24px;">
  <h2 style="text-align:center;margin-bottom:1.4em;">Setlist</h2>
  <div class="songlist-columns" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1.4rem;max-width:750px;margin:0 auto;">
    <ul style="list-style:none;margin:0;padding:0;">
      <li>Alive – Pearl Jam</li>
      <li>All That I Have – Snow Patrol</li>
      <li>All The Small Things – Blink 182</li>
      <li>American Idiot – Green Day</li>
      <li>Beds Are Burning – Midnight Oil</li>
      <li>Boys Don’t Cry – The Cure</li>
      <li>Chelsea Dagger – The Fratellis</li>
      <li>Closing Time – Semisonic</li>
      <li>Creep – Radiohead</li>
      <li>Dakota – Stereophonics</li>
      <li>Dani California – Red Hot Chili Peppers</li>
      <li>Don’t Look Back In Anger – Oasis</li>
      <li>Don’t You (Forget About Me) – Simple Minds</li>
      <li>Every You Every Me – Placebo</li>
      <li>Everlong – Foo Fighters</li>
      <li>Getting Started – Sam Fender</li>
      <li>Hate To Say I Told You So – The Hives</li>
      <li>Here I Go Again - Whitesnake</li>
      <li>Holiday – Green Day</li>
      <li>I Bet You Look Good On The Dancefloor – The Arctic Monkeys</li>
    </ul>
    <ul style="list-style:none;margin:0;padding:0;">
      <li>I Predict a Riot – Kaiser Chiefs</li>
      <li>Just Like Heaven – The Cure</li>
      <li>Learn to Fly – Foo Fighters</li>
      <li>Lonely Boy – The Black Keys</li>
      <li>Molly’s Chambers – Kings of Leon</li>
      <li>Mr. Brightside – The Killers</li>
      <li>Psycho Killer – Talking Heads</li>
      <li>Rebel Yell – Billy Idol</li>
      <li>Rock n Roll Star – Oasis</li>
      <li>Sex On Fire – Kings of Leon</li>
      <li>Shotgun – George Ezra</li>
      <li>Song 2 – Blur</li>
      <li>Summer of 69 – Bryan Adams</li>
      <li>Take Me Out – Franz Ferdinand</li>
      <li>The One I Love - REM</li>
      <li>Vertigo – U2</li>
      <li>When The Sun Goes Down – Arctic Monkeys</li>
      <li>With or Without You – U2</li>
      <li>You’re All I Have – Snow Patrol</li>
    </ul>
  </div>
</div>`;
    function openSonglist() {
      songOverlay.classList.add('open');
      songOverlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
      openSongBtn && openSongBtn.setAttribute('aria-expanded', 'true');

      // Focus management for accessibility
      const modal = songOverlay.querySelector('.songlist-modal');
      if (modal) {
        modal.focus();
      }

      // Trap focus within modal
      trapFocusInModal(songOverlay);
    }

    function closeSonglist() {
      songOverlay.classList.remove('open');
      songOverlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
      openSongBtn && openSongBtn.setAttribute('aria-expanded', 'false');
      openSongBtn && openSongBtn.focus();

      // Remove focus trap
      removeFocusTrap();
    }

    // Focus trap functionality for modal accessibility
    let focusableElements = [];
    let firstFocusableElement = null;
    let lastFocusableElement = null;

    function trapFocusInModal(modal) {
      focusableElements = modal.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
      firstFocusableElement = focusableElements[0];
      lastFocusableElement = focusableElements[focusableElements.length - 1];

      modal.addEventListener('keydown', handleModalKeydown);
    }

    function removeFocusTrap() {
      if (songOverlay) {
        songOverlay.removeEventListener('keydown', handleModalKeydown);
      }
    }

    function handleModalKeydown(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }
    }
    openSongBtn && openSongBtn.addEventListener('click', () => {
      if (window.innerWidth < 640) {
        const win = window.open('', 'reever-setlist', 'width=520,height=680');
        if (win) {
          win.document.write(`<!DOCTYPE html><html><head><title>Song List</title><meta charset='UTF-8'><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style='margin:0;background:#fff;'>${songListText}</body></html>`);
          win.document.close();
          win.focus();
        } else {
          openSonglist();
        }
      } else {
        openSonglist();
      }
    });
    closeSongBtn && closeSongBtn.addEventListener('click', closeSonglist);
    songOverlay && songOverlay.addEventListener('click', e => {
      if (e.target === songOverlay) { closeSonglist(); }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && songOverlay.classList.contains('open')) { closeSonglist(); }
    });
    downloadSongBtn && downloadSongBtn.addEventListener('click', () => {
      const blob = new Blob([songListText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'reever-song-list.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
    // Media carousel
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselSlides = [...document.querySelectorAll('.carousel-slide')];
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const carouselDots = [...document.querySelectorAll('.carousel-dots .dot')];
    let carouselIndex = 0;
    function updateCarousel(idx) {
      if (!carouselTrack) return;
      carouselIndex = (idx + carouselSlides.length) % carouselSlides.length;
      carouselTrack.style.transform = `translateX(-${carouselIndex * 100}%)`;
      carouselDots.forEach((dot, i) => {
        const active = i === carouselIndex;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      // Announce carousel change to screen readers
      const carouselContainer = document.querySelector('.media-carousel');
      if (carouselContainer) {
        carouselContainer.setAttribute('aria-label', `Band photo carousel, showing photo ${carouselIndex + 1} of ${carouselSlides.length}`);
      }
    }
    prevBtn && prevBtn.addEventListener('click', () => updateCarousel(carouselIndex - 1));
    nextBtn && nextBtn.addEventListener('click', () => updateCarousel(carouselIndex + 1));
    carouselDots.forEach((dot, i) => dot.addEventListener('click', () => updateCarousel(i)));

    // Enhanced keyboard navigation for carousel
    const carouselContainer = document.querySelector('.media-carousel');
    if (carouselContainer) {
      carouselContainer.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('carousel-control') || e.target.classList.contains('dot')) {
          switch (e.key) {
            case 'ArrowLeft':
              e.preventDefault();
              updateCarousel(carouselIndex - 1);
              break;
            case 'ArrowRight':
              e.preventDefault();
              updateCarousel(carouselIndex + 1);
              break;
            case 'Home':
              e.preventDefault();
              updateCarousel(0);
              break;
            case 'End':
              e.preventDefault();
              updateCarousel(carouselSlides.length - 1);
              break;
          }
        }
      });
    }
    let pointerStartX = null, pointerId = null;
    const carouselWindow = document.querySelector('.carousel-window');
    if (carouselWindow) {
      carouselWindow.addEventListener('pointerdown', e => {
        pointerStartX = e.clientX;
        pointerId = e.pointerId;
        carouselWindow.setPointerCapture(pointerId);
      });
      carouselWindow.addEventListener('pointerup', e => {
        if (pointerStartX === null) return;
        const delta = e.clientX - pointerStartX;
        if (Math.abs(delta) > 50) {
          if (delta > 0) { updateCarousel(carouselIndex - 1); } else { updateCarousel(carouselIndex + 1); }
        }
        if (pointerId !== null) { carouselWindow.releasePointerCapture(pointerId); }
        pointerStartX = null;
        pointerId = null;
      });
      carouselWindow.addEventListener('pointercancel', () => {
        if (pointerId !== null) { carouselWindow.releasePointerCapture(pointerId); }
        pointerStartX = null;
        pointerId = null;
      });
    }
    updateCarousel(0);
    // Add to Calendar (ICS)
    function makeICS(title, date, venue, town) {
      const dtStart = date.replace(/[-:]/g, "").slice(0, 15) + "Z";
      return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${title}\nDTSTART:${dtStart}\nLOCATION:${venue}, ${town}\nDESCRIPTION=Reever live\nEND:VEVENT\nEND:VCALENDAR`;
    }
    [...document.querySelectorAll('.gig-addcal')].forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const { title, date, venue, town } = btn.dataset;
        const ics = makeICS(title, date, venue, town);
        const blob = new Blob([ics], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url; link.download = `${title.replace(/\s/g, '_')}.ics`;
        document.body.appendChild(link); link.click(); setTimeout(() => { document.body.removeChild(link); URL.revokeObjectURL(url) }, 300);
      });
    });

    // Booking Form Validation and Secure Submission
    const form = document.getElementById('bookForm'), msg = document.getElementById('formMsg');
    let isSubmitting = false;



    // Enhanced validation
    function validateForm() {
      let valid = true, first = null;
      const errors = [];

      [...form.elements].forEach((el) => {
        if (el.tagName === 'BUTTON') return;
        el.style.borderColor = '';
        el.removeAttribute('aria-invalid');
        el.removeAttribute('aria-describedby');

        if (el.required && !el.value.trim()) {
          el.style.borderColor = '#e52560';
          el.setAttribute('aria-invalid', 'true');
          valid = false;
          first = first || el;
          const fieldName = el.labels?.[0]?.textContent || el.name || el.id;
          errors.push(`${fieldName} is required`);
        }

        if (el.type === 'email' && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
          el.style.borderColor = '#e52560';
          el.setAttribute('aria-invalid', 'true');
          valid = false;
          first = first || el;
          errors.push('Please enter a valid email address');
        }

        if (el.type === 'tel' && el.value && !/^[\d\s\-\+\(\)]+$/.test(el.value)) {
          el.style.borderColor = '#e52560';
          el.setAttribute('aria-invalid', 'true');
          valid = false;
          first = first || el;
          errors.push('Please enter a valid phone number');
        }

        if (el.type === 'date' && el.value) {
          const selectedDate = new Date(el.value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            el.style.borderColor = '#e52560';
            el.setAttribute('aria-invalid', 'true');
            valid = false;
            first = first || el;
            errors.push('Event date must be in the future');
          }
        }
      });

      return { valid, first, errors };
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (isSubmitting) return;

      const validation = validateForm();
      if (!validation.valid) {
        msg.textContent = validation.errors[0] || 'Please fill in all required fields correctly!';
        msg.style.display = 'block';
        msg.className = 'form-msg';
        validation.first && validation.first.focus();
        return;
      }

      // Show privacy notice before submitting
      const privacyNotice = document.getElementById('form-privacy-notice');
      if (privacyNotice) {
        privacyNotice.style.display = 'block';
      }

      isSubmitting = true;
      msg.textContent = 'Sending your message...';
      msg.style.display = 'block';
      msg.className = 'form-msg';

      try {
        // Submit form using Netlify Forms
        const formData = new FormData(form);

        const response = await fetch('/', {
          method: 'POST',
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData).toString()
        });

        if (response.ok) {
          msg.textContent = 'Thank you! We have received your enquiry and will be in touch soon.';
          msg.className = 'form-msg msg-success';
          form.reset();
          setTimeout(() => { msg.style.display = 'none'; }, 8000);
        } else {
          throw new Error('Network response was not ok');
        }

      } catch (error) {
        msg.textContent = 'Sorry, there was an error sending your message. Please try again.';
        msg.className = 'form-msg';
      } finally {
        isSubmitting = false;
      }
    });

    // Instagram Feed with Local Images
    // INSTRUCTIONS: 
    // 1. Go to each Instagram post URL below
    // 2. Right-click the image and "Save image as..."
    // 3. Save to public/media/ folder as instagram-1.jpg, instagram-2.jpg, instagram-3.jpg
    // 4. The images will show up and link to Instagram when clicked
    const instagramPosts = [
      {
        url: 'https://www.instagram.com/p/DQFUhsUDciC/',
        image: 'media/instagram-1.jpg',
        alt: 'Reever band live performance'
      },
      {
        url: 'https://www.instagram.com/p/DPwQyVTDGOf/',
        image: 'media/instagram-2.jpg',
        alt: 'Reever band photo'
      },
      {
        url: 'https://www.instagram.com/p/DMc6NR9Nskw/',
        image: 'media/instagram-3.jpg',
        alt: 'Reever band on stage'
      }
    ];

    function loadInstagramFeed() {
      const feedContainer = document.getElementById('instagram-feed');
      if (!feedContainer) return;

      feedContainer.innerHTML = '';

      instagramPosts.forEach((post) => {
        const postDiv = document.createElement('div');
        postDiv.className = 'instagram-post';

        const link = document.createElement('a');
        link.href = post.url;
        link.target = '_blank';
        link.rel = 'noopener';
        link.setAttribute('aria-label', `View this post on Instagram: ${post.alt}`);

        const img = document.createElement('img');
        img.src = post.image;
        img.alt = post.alt;
        img.loading = 'lazy';

        link.appendChild(img);
        postDiv.appendChild(link);
        feedContainer.appendChild(postDiv);
      });
    }

    // Load Instagram feed when page loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadInstagramFeed);
    } else {
      loadInstagramFeed();
    }

    // Cookie Consent Management System
    const CookieConsent = {
      STORAGE_KEY: 'reeverCookieConsent',
      EXPIRY_MONTHS: 6,
      boundHandleModalKeydown: null,
      focusableElements: [],
      firstFocusableElement: null,
      lastFocusableElement: null,

      // Check if user has made a choice
      hasConsent() {
        try {
          const consent = localStorage.getItem(this.STORAGE_KEY);
          return consent !== null;
        } catch (e) {
          console.warn('localStorage not available');
          return false;
        }
      },

      // Get user's consent level
      getConsent() {
        try {
          const data = localStorage.getItem(this.STORAGE_KEY);
          if (!data) return null;

          const parsed = JSON.parse(data);
          // Check if expired (6 months)
          if (Date.now() > parsed.expiry) {
            this.clearConsent();
            return null;
          }

          // Handle legacy format (accepted: true/false)
          if (parsed.accepted !== undefined) {
            return parsed.accepted ? 'all' : 'essential';
          }

          return parsed.level || 'essential';
        } catch (e) {
          console.warn('Error reading consent:', e);
          return null;
        }
      },

      // Store user's choice (now supports granular consent)
      setConsent(level) {
        try {
          const data = {
            level: level, // 'essential', 'spotify', or 'all'
            timestamp: Date.now(),
            expiry: Date.now() + (this.EXPIRY_MONTHS * 30 * 24 * 60 * 60 * 1000) // 6 months
          };
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));

        } catch (e) {
          console.warn('Error saving consent:', e);
        }
      },

      // Clear consent
      clearConsent() {
        try {
          localStorage.removeItem(this.STORAGE_KEY);
        } catch (e) {
          console.warn('Error clearing consent:', e);
        }
      },

      // Initialize on page load
      init() {
        if (!this.hasConsent()) {
          this.showBanner();
        } else {
          const consentLevel = this.getConsent();
          this.applyConsentLevel(consentLevel);
        }
      },

      // Show the banner with focus management
      showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
          banner.style.display = 'block';
          const animate = window.requestAnimationFrame
            ? window.requestAnimationFrame.bind(window)
            : (cb) => setTimeout(cb, 16);
          animate(() => {
            banner.classList.add('visible');
            const firstButton = banner.querySelector('.cookie-btn');
            if (firstButton) {
              firstButton.focus();
            }
          });
          this.trapFocus(banner);
        }
      },

      // Hide the banner
      hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
          banner.classList.remove('visible');
          setTimeout(() => {
            banner.style.display = 'none';
            this.removeFocusTrap();
          }, 300);
        }
      },

      // Handle essential only
      acceptEssential() {
        this.setConsent('essential');
        this.hideBanner();
        this.applyConsentLevel('essential');
      },

      // Handle accept all
      acceptAll() {
        this.setConsent('all');
        this.hideBanner();
        this.applyConsentLevel('all');
      },

      // Apply consent level
      applyConsentLevel(level) {
        switch (level) {
          case 'essential':
            this.blockThirdPartyServices();
            break;
          case 'all':
            this.loadAllServices();
            break;
          default:
            this.blockThirdPartyServices();
        }
      },

      // Toggle preferences panel visibility

      // Load all services (now only Netlify Identity)
      loadAllServices() {
        this.loadNetlifyIdentity();
      },

      // Load Netlify Identity script
      loadNetlifyIdentity() {
        if (!window.netlifyIdentity) {
          const script = document.createElement('script');
          script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
          script.async = true;
          document.head.appendChild(script);
        }
      },

      // Block third-party services (essential only) - simplified for new approach
      blockThirdPartyServices() {
        // No blocking needed since we use a simple link
      },

      // Focus trap for accessibility
      trapFocus(element) {
        if (!element) return;

        const focusable = Array.from(
          element.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])')
        ).filter((el) => !el.hasAttribute('disabled') && !el.closest('[hidden]'));

        if (!focusable.length) {
          this.focusableElements = [];
          this.firstFocusableElement = null;
          this.lastFocusableElement = null;
          return;
        }

        this.focusableElements = focusable;
        this.firstFocusableElement = focusable[0];
        this.lastFocusableElement = focusable[focusable.length - 1];

        if (!this.boundHandleModalKeydown) {
          this.boundHandleModalKeydown = this.handleModalKeydown.bind(this);
        }

        element.removeEventListener('keydown', this.boundHandleModalKeydown);
        element.addEventListener('keydown', this.boundHandleModalKeydown);
      },

      // Remove focus trap
      removeFocusTrap() {
        const banner = document.getElementById('cookie-banner');
        if (banner && this.boundHandleModalKeydown) {
          banner.removeEventListener('keydown', this.boundHandleModalKeydown);
        }
        this.focusableElements = [];
        this.firstFocusableElement = null;
        this.lastFocusableElement = null;
      },

      // Handle keyboard navigation in modal
      handleModalKeydown(e) {
        if (e.key === 'Tab' && this.focusableElements && this.focusableElements.length) {
          if (e.shiftKey) {
            if (document.activeElement === this.firstFocusableElement) {
              e.preventDefault();
              this.lastFocusableElement.focus();
            }
          } else if (document.activeElement === this.lastFocusableElement) {
            e.preventDefault();
            this.firstFocusableElement.focus();
          }
        }
      }
    };

    // Global function for "Enable Cookies" buttons
    function showCookieBanner() {
      CookieConsent.showBanner();
    }

    // Initialize consent system when page loads
    document.addEventListener('DOMContentLoaded', () => {
      const acceptAllBtn = document.getElementById('cookie-accept-all');
      const rejectBtn = document.getElementById('cookie-reject');

      if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', () => CookieConsent.acceptAll());
      }

      if (rejectBtn) {
        rejectBtn.addEventListener('click', () => CookieConsent.acceptEssential());
      }

      // ESC key to close banner (disabled on first visit to ensure consent capture)
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const banner = document.getElementById('cookie-banner');
          if (banner && banner.classList.contains('visible')) {
            // Only allow ESC if user has previously made a consent choice
            if (CookieConsent.hasConsent()) {
              CookieConsent.hideBanner();
            }
            // On first visit, ESC is disabled to ensure consent is captured
          }
        }
      });

      // Footer Cookie Settings link
      const footerCookieSettings = document.getElementById('footer-cookie-settings');
      if (footerCookieSettings) {
        footerCookieSettings.addEventListener('click', (e) => {
          e.preventDefault();
          CookieConsent.showBanner();
        });
      }



      // Initialize the consent system
      CookieConsent.init();
    });
