# Design Document

## Overview

This design document outlines the technical approach for enhancing the Reever band website with performance optimizations, SEO improvements, dark mode functionality, enhanced accessibility, a custom 404 page, and Instagram feed integration. The solution maintains the existing static HTML architecture while adding modern features that improve user experience and discoverability.

## Architecture

### High-Level Architecture

The website will remain a static HTML site with embedded CSS and JavaScript, deployed on Netlify. Enhancements will be implemented as:

1. **Performance Layer**: Image optimization, lazy loading, and resource hints
2. **SEO Layer**: Meta tags, structured data, sitemap, and robots.txt
3. **Theme Layer**: CSS custom properties with dark mode toggle and localStorage persistence
4. **Accessibility Layer**: Enhanced ARIA attributes, keyboard navigation, and focus management
5. **Error Handling Layer**: Custom 404 page with Netlify configuration
6. **Social Integration Layer**: Instagram feed using Instagram Basic Display API or embed approach

### Technology Stack

- **Core**: HTML5, CSS3, Vanilla JavaScript
- **Deployment**: Netlify (static hosting)
- **Instagram Integration**: Instagram oEmbed API (no authentication required)
- **Storage**: localStorage for dark mode preference
- **SEO**: XML sitemap, robots.txt, JSON-LD structured data

## Components and Interfaces

### 1. Performance Optimization Component

**Implementation Approach:**
- Add `loading="lazy"` attribute to all images not in the initial viewport
- Add `loading="lazy"` to Spotify iframe
- Include explicit width/height attributes on images to prevent CLS
- Add `<link rel="preconnect">` for external domains (Spotify, Instagram, Netlify Identity)
- Ensure all images in `/media` folder are optimized (WebP format where supported)

**Code Structure:**
```html
<!-- Preconnect hints in <head> -->
<link rel="preconnect" href="https://open.spotify.com">
<link rel="preconnect" href="https://www.instagram.com">

<!-- Lazy loaded images -->
<img src="media/image.jpg" alt="..." loading="lazy" width="800" height="600">

<!-- Lazy loaded iframe -->
<iframe src="..." loading="lazy"></iframe>
```

### 2. SEO Enhancement Component

**Sitemap Structure:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://reever.band/</loc>
    <lastmod>2025-10-24</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://reever.band/#about</loc>
    <priority>0.8</priority>
  </url>
  <!-- Additional sections -->
</urlset>
```

**Robots.txt Structure:**
```
User-agent: *
Allow: /
Sitemap: https://reever.band/sitemap.xml
```

**Enhanced Meta Tags:**
```html
<!-- Open Graph with absolute URLs -->
<meta property="og:url" content="https://reever.band/">
<meta property="og:image" content="https://reever.band/media/reever-live-photo.jpg">
<link rel="canonical" href="https://reever.band/">

<!-- Additional SEO meta tags -->
<meta name="keywords" content="covers band, Woking, Surrey, wedding band, party band">
<meta name="author" content="Reever">
```

### 3. Dark Mode Component

**CSS Custom Properties Strategy:**
```css
:root {
  /* Light mode (default) */
  --bg: #fff;
  --text: #1a1a1a;
  --accent: #f05a7e;
  /* ... other variables */
}

[data-theme="dark"] {
  /* Dark mode overrides */
  --bg: #1a1a1a;
  --text: #e8e8e8;
  --accent: #ff6b8f;
  --bg-alt: #2a2a2a;
  --bg-alt-dark: #333;
  --hero-text: #e0e0e0;
  --shadow: 0 2px 12px rgba(0,0,0,0.4);
  --divider: rgba(255,255,255,0.15);
}
```

**Toggle Button Design:**
- Position: Header navigation, right side (desktop) or in mobile menu
- Icon: Sun/Moon icon using SVG or emoji
- Visual feedback: Smooth transition animation
- Accessibility: Proper ARIA labels and keyboard support

**JavaScript Implementation:**
```javascript
// Check for saved preference or system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

// Apply theme
document.documentElement.setAttribute('data-theme', initialTheme);

// Toggle function
function toggleDarkMode() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}
```

### 4. Enhanced Accessibility Component

**Skip Link Implementation:**
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

**Focus Indicators:**
```css
*:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 3px;
}
```

**Enhanced ARIA Labels:**
- Add `aria-label` to all icon-only buttons
- Add `aria-live` regions for dynamic content updates
- Ensure form error messages are announced with `aria-describedby`
- Add `role="status"` to loading states

**Keyboard Navigation:**
- Ensure all interactive elements are in tab order
- Implement keyboard shortcuts for carousel (arrow keys)
- Add escape key handler for modals (already implemented)

### 5. Custom 404 Page Component

**File Structure:**
```
public/
├── 404.html          # Custom error page
├── index.html
└── ...
```

**404 Page Design:**
- Maintain same header/footer as main site
- Include hero section with error message
- Provide navigation links to main sections
- Add search suggestions or contact form link
- Use same CSS variables for consistent theming

**Netlify Configuration:**
```toml
# netlify.toml
[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

### 6. Instagram Feed Component

**Integration Approach:**
We'll use Instagram's oEmbed API which doesn't require authentication. This is the simplest approach for a static site.

**Alternative Approaches Considered:**
1. ~~Instagram Basic Display API~~ - Requires OAuth and access tokens (too complex for static site)
2. ~~Third-party services (Juicer, SnapWidget)~~ - Adds external dependencies
3. **Instagram oEmbed API** ✓ - Simple, no auth required, works with public posts
4. **Manual embed codes** ✓ - Fallback option using Instagram's embed feature

**Implementation Strategy:**
```javascript
// Fetch recent posts using oEmbed
async function loadInstagramFeed() {
  const instagramPosts = [
    'https://www.instagram.com/p/POST_ID_1/',
    'https://www.instagram.com/p/POST_ID_2/',
    // ... more post URLs
  ];
  
  const container = document.getElementById('instagram-feed');
  
  for (const postUrl of instagramPosts) {
    try {
      const response = await fetch(
        `https://api.instagram.com/oembed?url=${encodeURIComponent(postUrl)}`
      );
      const data = await response.json();
      container.innerHTML += data.html;
    } catch (error) {
      console.error('Failed to load Instagram post:', error);
    }
  }
  
  // Load Instagram embed script
  if (window.instgrm) {
    window.instgrm.Embeds.process();
  }
}
```

**Fallback Strategy:**
If oEmbed fails or is rate-limited, display:
```html
<div class="instagram-fallback">
  <p>Check out our latest posts on Instagram!</p>
  <a href="https://instagram.com/reever.band" class="cta-btn">
    Visit @reever.band
  </a>
</div>
```

**UI Design:**
- **Placement**: New section between "Gigs" (#gigs) and "Contact" (#contact) sections
- Section ID: `#instagram`
- Section title: "Follow Us on Instagram"
- Grid layout: 2 columns on mobile, 3 columns on tablet, 6 posts maximum for lightweight performance
- Each post: Instagram embed with image and caption preview
- Loading state: Skeleton screens while posts load
- Error state: Fallback message with "Follow us on Instagram" CTA button
- Visual style: Matches existing section styling (even-numbered section with gradient background)
- Navigation: Add "Instagram" link to main navigation menu
- **Strategic Benefits**: 
  - Social proof positioned right before contact form to boost conversions
  - Doesn't compete with curated Media gallery section
  - Heavy embeds placed lower on page for better above-the-fold performance

### 7. Loading Animation Component

**Implementation:**
```html
<div id="page-loader" class="page-loader">
  <div class="loader-content">
    <img src="media/reever-logo-black.jpeg" alt="Reever" class="loader-logo">
    <div class="loader-spinner"></div>
  </div>
</div>
```

```css
.page-loader {
  position: fixed;
  inset: 0;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.3s, visibility 0.3s;
}

.page-loader.hidden {
  opacity: 0;
  visibility: hidden;
}
```

```javascript
window.addEventListener('load', () => {
  document.getElementById('page-loader').classList.add('hidden');
});
```

## Data Models

### Dark Mode Preference
```typescript
interface ThemePreference {
  theme: 'light' | 'dark';
  timestamp: number;
}

// Stored in localStorage as:
// key: 'theme'
// value: 'light' | 'dark'
```

### Instagram Post
```typescript
interface InstagramPost {
  url: string;
  embedHtml: string;
  thumbnailUrl?: string;
  caption?: string;
}
```

## Error Handling

### Instagram Feed Errors
1. **Network Failure**: Display fallback message with Instagram link
2. **Rate Limiting**: Cache responses, implement retry logic
3. **Invalid Post URLs**: Skip failed posts, continue loading others
4. **Script Loading Failure**: Graceful degradation to static links

### Dark Mode Errors
1. **localStorage Unavailable**: Fall back to system preference
2. **Invalid Stored Value**: Reset to default light mode

### Performance Errors
1. **Image Loading Failure**: Use alt text and placeholder
2. **External Resource Timeout**: Continue page load without blocking

## Testing Strategy

### Performance Testing
- Lighthouse audit: Target scores of 90+ for Performance, Accessibility, SEO
- Test lazy loading behavior on slow connections
- Verify no layout shifts (CLS score < 0.1)
- Test preconnect hints reduce connection time

### Dark Mode Testing
- Test toggle functionality in all browsers
- Verify localStorage persistence across sessions
- Test system preference detection
- Verify contrast ratios meet WCAG AA standards
- Test smooth transitions between themes

### Accessibility Testing
- Keyboard navigation through all interactive elements
- Screen reader testing (VoiceOver, NVDA)
- Focus indicator visibility in both themes
- ARIA label verification
- Color contrast validation

### Instagram Feed Testing
- Test with various numbers of posts (0, 1, 6, 12)
- Test error handling when API is unavailable
- Test loading states and animations
- Test responsive layout on different screen sizes
- Test fallback message display

### SEO Testing
- Validate sitemap.xml format
- Test robots.txt accessibility
- Verify Open Graph tags with social media debuggers
- Test structured data with Google Rich Results Test
- Verify canonical URLs

### 404 Page Testing
- Test navigation from 404 page to main sections
- Verify 404 page displays for non-existent URLs
- Test 404 page in both light and dark modes
- Verify consistent styling with main site

### Cross-Browser Testing
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Test dark mode in browsers with/without system preference support

### Responsive Testing
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+
- Test all new features at each breakpoint

## Implementation Notes

### Phase 1: Foundation (Performance & SEO)
- Low risk, high impact
- No visual changes
- Can be deployed independently

### Phase 2: Dark Mode
- Moderate complexity
- Requires careful color selection
- Test thoroughly for contrast

### Phase 3: Accessibility & 404
- Enhances existing features
- 404 page is standalone
- Low risk

### Phase 4: Instagram Feed
- Highest complexity
- Requires external API
- Implement with fallback strategy
- Can be deployed last

### Deployment Strategy
- Each phase can be deployed independently
- Use Netlify deploy previews for testing
- Monitor performance metrics after each deployment
- Gather user feedback on dark mode preference

## Security Considerations

1. **Content Security Policy**: Add CSP headers to allow Instagram embeds
2. **External Resources**: Only load from trusted domains (Instagram, Spotify)
3. **localStorage**: Validate data before use
4. **Instagram API**: No sensitive data exposed, public posts only
5. **Form Validation**: Maintain existing security measures

## Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s
- **Lighthouse Performance Score**: > 90
- **Lighthouse Accessibility Score**: > 95
- **Lighthouse SEO Score**: > 95
