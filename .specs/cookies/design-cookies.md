# Design Document - Cookie Consent & Privacy Compliance

## Overview

This design implements a lightweight, UK GDPR-compliant cookie consent system for the Reever band website. The solution uses vanilla JavaScript with localStorage for preference management, conditional loading of third-party services, and a comprehensive privacy policy page. The design prioritizes simplicity, user experience, and legal compliance without requiring external libraries or services.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    Website Load                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Consent Manager JS   │
         │  (checks localStorage) │
         └───────────┬───────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   [Has Consent?]            [No Consent?]
        │                         │
        ▼                         ▼
   Load Services          Show Banner
   - Spotify              - Accept Button
   - Netlify Identity     - Decline Button
                          - Privacy Link
```

### Data Flow

1. **Page Load** → Check localStorage for `cookieConsent` key
2. **If consent exists** → Load third-party services immediately
3. **If no consent** → Show banner, block third-party services
4. **User accepts** → Store preference, load services, hide banner
5. **User declines** → Store preference, keep services blocked, hide banner
6. **User changes mind** → Click "Cookie Settings" in footer, show banner again

## Components and Interfaces

### 1. Cookie Consent Banner (HTML/CSS)

**Location:** Fixed position at bottom of viewport  
**Styling:** Matches existing site design (accent color, fonts, shadows)

**HTML Structure:**
```html
<div id="cookie-banner" class="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
  <div class="cookie-banner-content">
    <p class="cookie-banner-text">
      We use cookies to provide essential features and improve your experience. 
      <a href="/privacy.html">Learn more</a>
    </p>
    <div class="cookie-banner-actions">
      <button id="cookie-accept" class="cookie-btn cookie-btn-accept">Accept All</button>
      <button id="cookie-decline" class="cookie-btn cookie-btn-decline">Decline Non-Essential</button>
    </div>
  </div>
</div>
```

**CSS Styling:**
- Fixed bottom position with z-index above content
- Responsive: stacks buttons on mobile
- Smooth slide-up animation on show/hide
- Uses existing CSS variables for colors
- Accessible focus states

### 2. Consent Manager (JavaScript)

**File:** Inline in `index.html` (before closing `</body>`)

**Core Functions:**

```javascript
const CookieConsent = {
  STORAGE_KEY: 'reeverCookieConsent',
  EXPIRY_DAYS: 365,
  
  // Check if user has made a choice
  hasConsent() {
    const consent = localStorage.getItem(this.STORAGE_KEY);
    return consent !== null;
  },
  
  // Get user's consent status
  getConsent() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    // Check if expired
    if (Date.now() > parsed.expiry) {
      this.clearConsent();
      return null;
    }
    return parsed.accepted;
  },
  
  // Store user's choice
  setConsent(accepted) {
    const data = {
      accepted: accepted,
      timestamp: Date.now(),
      expiry: Date.now() + (this.EXPIRY_DAYS * 24 * 60 * 60 * 1000)
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },
  
  // Clear consent (for testing or user request)
  clearConsent() {
    localStorage.removeItem(this.STORAGE_KEY);
  },
  
  // Initialize on page load
  init() {
    if (!this.hasConsent()) {
      this.showBanner();
    } else if (this.getConsent()) {
      this.loadThirdPartyServices();
    } else {
      this.blockThirdPartyServices();
    }
  },
  
  // Show the banner
  showBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.style.display = 'block';
      setTimeout(() => banner.classList.add('visible'), 10);
    }
  },
  
  // Hide the banner
  hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.remove('visible');
      setTimeout(() => banner.style.display = 'none', 300);
    }
  },
  
  // Handle accept
  accept() {
    this.setConsent(true);
    this.hideBanner();
    this.loadThirdPartyServices();
  },
  
  // Handle decline
  decline() {
    this.setConsent(false);
    this.hideBanner();
    this.blockThirdPartyServices();
  },
  
  // Load third-party services
  loadThirdPartyServices() {
    // Load Spotify iframe if placeholder exists
    const spotifyPlaceholder = document.getElementById('spotify-placeholder');
    if (spotifyPlaceholder) {
      const iframe = document.createElement('iframe');
      iframe.src = spotifyPlaceholder.dataset.src;
      iframe.width = '100%';
      iframe.height = '352';
      iframe.frameBorder = '0';
      iframe.allowFullscreen = true;
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      iframe.loading = 'lazy';
      iframe.style.borderRadius = '12px';
      spotifyPlaceholder.replaceWith(iframe);
    }
    
    // Netlify Identity is already loaded in <head>, no action needed
  },
  
  // Block third-party services
  blockThirdPartyServices() {
    // Replace Spotify iframe with message
    const spotifyEmbed = document.querySelector('.spotify-embed iframe');
    if (spotifyEmbed) {
      const placeholder = document.createElement('div');
      placeholder.id = 'spotify-placeholder';
      placeholder.className = 'spotify-blocked';
      placeholder.dataset.src = spotifyEmbed.src;
      placeholder.innerHTML = `
        <p>🍪 Cookie consent required to view Spotify content</p>
        <button onclick="CookieConsent.showBanner()" class="cta-btn">Enable Cookies</button>
      `;
      spotifyEmbed.replaceWith(placeholder);
    }
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  CookieConsent.init();
  
  // Attach event listeners
  document.getElementById('cookie-accept')?.addEventListener('click', () => CookieConsent.accept());
  document.getElementById('cookie-decline')?.addEventListener('click', () => CookieConsent.decline());
  document.getElementById('cookie-settings')?.addEventListener('click', (e) => {
    e.preventDefault();
    CookieConsent.showBanner();
  });
});
```

### 3. Privacy Policy Page

**File:** `public/privacy.html`

**Structure:**
- Same header/footer as main site
- Clear sections with headings
- Plain English explanations
- Contact information
- Last updated date

**Key Sections:**
1. Introduction
2. What Data We Collect
3. How We Use Your Data
4. Cookies We Use
5. Third-Party Services (Netlify, Spotify)
6. Your Rights Under UK GDPR
7. Data Retention
8. Contact Information

### 4. Privacy Links Integration

**Footer Addition:**
```html
<div class="footer-links">
  <a href="/privacy.html">Privacy Policy</a>
  <span>•</span>
  <a href="#" id="cookie-settings">Cookie Settings</a>
</div>
```

**Contact Form Addition:**
```html
<p class="form-privacy-notice">
  By submitting this form, you consent to us processing your data. 
  See our <a href="/privacy.html">Privacy Policy</a> for details.
</p>
```

## Data Models

### Consent Record (localStorage)

```javascript
{
  "accepted": true,           // boolean: user's choice
  "timestamp": 1704067200000, // number: when choice was made
  "expiry": 1719619200000     // number: when consent expires (6 months)
}
```

**Storage Key:** `reeverCookieConsent`  
**Storage Location:** Browser localStorage  
**Expiry:** 6 months from consent date (ICO recommended)

## Error Handling

### localStorage Not Available

```javascript
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
} catch (e) {
  // localStorage not available (private browsing, etc.)
  // Default to declining cookies
  console.warn('localStorage not available, defaulting to declined cookies');
  CookieConsent.blockThirdPartyServices();
  // Don't show banner if localStorage doesn't work
}
```

### Expired Consent

- Check expiry timestamp on every page load
- If expired, clear consent and show banner again
- User must make a new choice

### Missing Banner Element

- Check if banner exists before trying to show/hide
- Fail gracefully if element not found
- Log warning to console for debugging

## Styling Guidelines

### Cookie Banner Styles

```css
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(120deg, var(--bg-alt) 0%, var(--bg-alt-dark) 100%);
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  z-index: 1000;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  display: none;
}

.cookie-banner.visible {
  transform: translateY(0);
}

.cookie-banner-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.cookie-banner-text {
  margin: 0;
  flex: 1;
}

.cookie-banner-actions {
  display: flex;
  gap: 1rem;
}

.cookie-btn {
  padding: 0.7em 1.5em;
  border-radius: 2em;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, filter 0.2s;
}

.cookie-btn-accept {
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  color: #fff;
}

.cookie-btn-decline {
  background: #fff;
  color: var(--text);
  border: 2px solid var(--divider);
}

.spotify-blocked {
  text-align: center;
  padding: 3rem 2rem;
  background: var(--bg-alt);
  border-radius: var(--radius);
  border: 2px dashed var(--divider);
}

@media (max-width: 768px) {
  .cookie-banner-content {
    flex-direction: column;
    text-align: center;
  }
  
  .cookie-banner-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .cookie-btn {
    width: 100%;
  }
}
```

## Testing Strategy

### Manual Testing Checklist

1. **First Visit**
   - [ ] Banner appears on page load
   - [ ] Spotify embed is blocked
   - [ ] Banner is accessible via keyboard
   - [ ] Privacy Policy link works

2. **Accept Cookies**
   - [ ] Banner disappears
   - [ ] Spotify embed loads
   - [ ] Preference stored in localStorage
   - [ ] Banner doesn't show on refresh

3. **Decline Cookies**
   - [ ] Banner disappears
   - [ ] Spotify stays blocked with message
   - [ ] Preference stored in localStorage
   - [ ] Banner doesn't show on refresh

4. **Cookie Settings**
   - [ ] Footer link shows banner again
   - [ ] Can change preference
   - [ ] New preference takes effect immediately

5. **Privacy Policy**
   - [ ] Page loads correctly
   - [ ] All sections present
   - [ ] Links work
   - [ ] Matches site styling

6. **Edge Cases**
   - [ ] Works in private browsing mode
   - [ ] Works with JavaScript disabled (graceful degradation)
   - [ ] Works on mobile devices
   - [ ] Consent expires after 365 days

### Browser Testing

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Implementation Notes

### Netlify Identity Handling

Netlify Identity script is loaded in the `<head>`. Since it's already loaded before our consent check, we can't conditionally load it. However:
- If user declines cookies, we can hide the login UI
- Most users won't use login functionality anyway
- Consider moving the script to load conditionally in future iteration

### Spotify Embed Strategy

- Initially render a placeholder `<div>` instead of `<iframe>`
- Store the Spotify URL in a `data-src` attribute
- If user accepts, replace placeholder with actual iframe
- If user declines, show blocked message with "Enable Cookies" button

### Performance Considerations

- Consent check happens synchronously on page load (fast, uses localStorage)
- Banner CSS is inline to avoid flash of unstyled content
- Third-party services only load after consent (improves initial page load)
- No external libraries required (keeps bundle size small)

## Future Enhancements

1. **Granular Cookie Control** - Let users choose specific cookie categories
2. **Analytics Integration** - Add Google Analytics with consent gating
3. **Cookie Audit** - Automatically detect and list all cookies
4. **Multi-language Support** - Translate banner and policy for international visitors
5. **Consent API** - Use browser's Consent API when widely supported