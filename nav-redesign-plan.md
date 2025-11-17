# Navigation Redesign Implementation Plan

## Current Navigation Style
- Navigation links have circular/pill backgrounds when active
- Uses `border-radius: 1em` and solid background color
- Located in `public/index.html` lines 160-181

## New Navigation Style: Underline with Animation

### CSS Changes Required

#### 1. Update nav a base styles (lines 160-167)
Current:
```css
nav a {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  padding: 0.2em 0.7em;
  border-radius: 1em;
  transition: background 0.2s, color 0.2s;
}
```

New:
```css
nav a {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  padding: 0.2em 0.7em;
  position: relative;
  transition: color 0.2s ease;
}
```

#### 2. Add underline animation for nav a (new CSS after line 167)
```css
nav a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width 0.3s ease;
}

nav a:hover::after {
  width: 100%;
}
```

#### 3. Update nav a.active styles (lines 169-172)
Current:
```css
nav a.active {
  background: var(--accent);
  color: #fff;
}
```

New:
```css
nav a.active {
  color: var(--accent);
  font-weight: 600;
}

nav a.active::after {
  width: 100%;
}
```

#### 4. Update nav a.active:focus-visible (lines 179-181)
Current:
```css
nav a.active:focus-visible {
  outline-color: #fff;
}
```

New:
```css
nav a.active:focus-visible {
  outline-color: var(--accent);
}
```

### Benefits of This Design
1. Clean, modern appearance
2. Smooth animation enhances user experience
3. Maintains accessibility with clear active states
4. Works well with existing color scheme
5. No background clutter, keeps focus on content
6. Responsive-friendly design

### Testing Checklist
- [ ] Verify underline appears on hover
- [ ] Verify active state shows persistent underline
- [ ] Test animation smoothness
- [ ] Check mobile navigation still works
- [ ] Verify focus states remain accessible
- [ ] Test with different screen sizes