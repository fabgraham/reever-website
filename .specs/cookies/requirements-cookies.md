# Requirements Document - Cookie Consent & Privacy Compliance

## Introduction

This document outlines the requirements for implementing UK GDPR-compliant cookie consent and privacy features for the Reever band website. The site currently uses Netlify Identity (authentication cookies) and embeds Spotify content (third-party cookies), and collects personal data through a contact form.

## Glossary

- **Cookie Consent Banner**: A UI component that informs users about cookies and requests their consent before non-essential cookies are set
- **Essential Cookies**: Cookies strictly necessary for the website to function (e.g., form submission, session management)
- **Third-Party Cookies**: Cookies set by external services (Netlify Identity, Spotify embeds)
- **Privacy Policy**: A legal document explaining how personal data is collected, used, stored, and protected
- **UK GDPR**: UK General Data Protection Regulation - the data protection law in the UK
- **Consent System**: The mechanism for storing and respecting user cookie preferences

## Requirements

### Requirement 1: Cookie Consent Banner Display

**User Story:** As a website visitor, I want to be informed about cookies when I first visit the site, so that I can make an informed decision about my privacy

#### Acceptance Criteria

1. WHEN a user visits the website for the first time, THE Cookie Consent Banner SHALL display at the bottom of the viewport
2. WHEN a user has previously accepted or declined cookies, THE Cookie Consent Banner SHALL NOT display
3. THE Cookie Consent Banner SHALL include clear information about what cookies are used and why
4. THE Cookie Consent Banner SHALL include a link to the full Privacy Policy
5. THE Cookie Consent Banner SHALL NOT block access to website content

### Requirement 2: Cookie Consent Actions

**User Story:** As a website visitor, I want to easily accept or decline cookies, so that I can control my privacy preferences

#### Acceptance Criteria

1. THE Cookie Consent Banner SHALL provide an "Accept All" button
2. THE Cookie Consent Banner SHALL provide a "Decline Non-Essential" button
3. THE Accept and Decline buttons SHALL have equal visual prominence (same size, weight, and styling)
4. WHEN a user clicks "Accept All", THE Consent System SHALL store the user's preference in localStorage
5. WHEN a user clicks "Decline Non-Essential", THE Consent System SHALL store the user's preference in localStorage
6. WHEN a user accepts cookies, THE Consent System SHALL dynamically load third-party scripts (Spotify, Netlify Identity)
7. WHEN a user declines cookies, THE Consent System SHALL prevent all non-essential scripts from loading
8. THE Website SHALL NOT load any non-essential third-party scripts before user consent is obtained

### Requirement 3: Cookie Preference Persistence

**User Story:** As a website visitor, I want my cookie preferences to be remembered, so that I don't have to make the same choice on every visit

#### Acceptance Criteria

1. THE Consent System SHALL store user preferences in localStorage for 6 months (ICO recommended duration)
2. WHEN a user returns to the website, THE Consent System SHALL respect their previous choice
3. THE Consent System SHALL re-prompt for consent after 6 months or when services materially change
4. THE Consent System SHALL provide a way for users to change their preferences later
5. IF localStorage is not available, THE Consent System SHALL default to declining non-essential cookies
6. THE Consent System SHALL re-show the banner on each page visit if preferences cannot be stored

### Requirement 4: Privacy Policy Page

**User Story:** As a website visitor, I want to read a clear privacy policy, so that I understand how my personal data is handled

#### Acceptance Criteria

1. THE Website SHALL include a dedicated Privacy Policy page at /privacy.html
2. THE Privacy Policy SHALL explain what personal data is collected (name, email, phone, event details)
3. THE Privacy Policy SHALL explain how contact form data is processed and stored (via Netlify Forms)
4. THE Privacy Policy SHALL explain what cookies are used (Netlify Identity, Spotify embeds)
5. THE Privacy Policy SHALL include contact information for data protection inquiries
6. THE Privacy Policy SHALL explain user rights under UK GDPR (access, deletion, portability)
7. THE Privacy Policy SHALL be written in clear, plain English

### Requirement 5: Privacy Policy Links

**User Story:** As a website visitor, I want easy access to the privacy policy, so that I can review it whenever needed

#### Acceptance Criteria

1. THE Website footer SHALL include a link to the Privacy Policy
2. THE Contact form section SHALL include a note with a link to the Privacy Policy
3. THE Cookie Consent Banner SHALL include a link to the Privacy Policy
4. ALL Privacy Policy links SHALL open in the same tab (not a new window)

### Requirement 6: Contact Form Privacy Notice

**User Story:** As someone filling out the contact form, I want to know how my data will be used, so that I can make an informed decision about submitting it

#### Acceptance Criteria

1. THE Contact form SHALL include a privacy notice above or below the submit button
2. THE Privacy notice SHALL state the lawful basis for processing (legitimate interests for enquiries)
3. THE Privacy notice SHALL NOT request consent for contact form processing
4. THE Privacy notice SHALL link to the full Privacy Policy
5. THE Privacy notice SHALL be clearly visible and readable
6. THE Privacy notice SHALL explain data will be used to respond to the enquiry

### Requirement 7: Non-Essential Cookie Blocking

**User Story:** As a website visitor who declined cookies, I want non-essential cookies to be blocked, so that my privacy choice is respected

#### Acceptance Criteria

1. WHEN a user declines cookies, THE Consent System SHALL prevent Spotify iframe from loading
2. WHEN a user declines cookies, THE Consent System SHALL prevent Netlify Identity widget from loading
3. WHERE Spotify embed is blocked, THE Website SHALL display a message: "Cookie consent required to view Spotify content"
4. WHERE Netlify Identity is blocked, THE Website SHALL not display login functionality
5. THE Website SHALL continue to function normally for all other features when cookies are declined

### Requirement 8: Consent Management Interface

**User Story:** As a website visitor, I want to change my cookie preferences after my initial choice, so that I have ongoing control over my privacy

#### Acceptance Criteria

1. THE Website footer SHALL include a "Cookie Settings" link
2. WHEN a user clicks "Cookie Settings", THE Consent System SHALL display the cookie consent banner again
3. THE User SHALL be able to change their preference from the cookie settings interface
4. WHEN preferences are changed, THE Website SHALL immediately apply the new settings without requiring a page refresh

### Requirement 9: Cookie Transparency and Documentation

**User Story:** As a website visitor, I want detailed information about cookies used, so that I can make an informed decision

#### Acceptance Criteria

1. THE Privacy Policy SHALL include a comprehensive cookie list table
2. THE Cookie list SHALL specify name, provider, purpose, duration, and type for each cookie
3. THE Cookie list SHALL be kept up-to-date when services change
4. THE Cookie Consent Banner SHALL specifically mention Spotify embeds and Netlify Identity
5. THE Banner text SHALL be specific: "We use cookies for Spotify embeds and optional Netlify login"

### Requirement 10: Accessibility Compliance

**User Story:** As a user with accessibility needs, I want the cookie banner to be fully accessible, so that I can navigate it with keyboard or screen reader

#### Acceptance Criteria

1. THE Cookie Consent Banner SHALL use aria-modal="true" when displayed
2. THE Banner SHALL trap focus within the modal when open
3. THE Banner SHALL return focus to the triggering element when closed
4. THE Banner SHALL close when Escape key is pressed
5. THE Banner SHALL be navigable via keyboard (Tab, Enter, Space)
6. THE Banner SHALL use aria-describedby to reference detailed cookie information

### Requirement 11: Legal Basis and Data Protection

**User Story:** As a data subject, I want clear information about legal bases and my rights, so that I understand how my data is processed

#### Acceptance Criteria

1. THE Privacy Policy SHALL document lawful basis for each processing purpose
2. THE Privacy Policy SHALL specify "legitimate interests" for contact form enquiries
3. THE Privacy Policy SHALL specify "consent" for non-essential cookies
4. THE Privacy Policy SHALL include data retention periods for contact form submissions
5. THE Privacy Policy SHALL explain international transfers (Netlify hosting locations)
6. THE Privacy Policy SHALL include ICO contact information for complaints
7. THE Privacy Policy SHALL list all data subject rights under UK GDPR

### Requirement 12: Script Loading Control

**User Story:** As a privacy-conscious visitor, I want non-essential scripts blocked until I consent, so that my privacy is protected from the moment I visit

#### Acceptance Criteria

1. THE Website SHALL NOT load Netlify Identity script in the HTML head
2. THE Website SHALL load Netlify Identity script only after user accepts cookies
3. THE Website SHALL replace Spotify iframe with placeholder div initially
4. THE Website SHALL load Spotify iframe only after user accepts cookies
5. THE Consent System SHALL run before any non-essential third-party scripts
6. THE Website SHALL verify no non-essential cookies are set before consent

### Requirement 13: Cookie Banner Visual Design

**User Story:** As a website visitor, I want the cookie banner to feel consistent with the Reever brand while remaining unobtrusive, so that I trust the site without feeling interrupted

#### Acceptance Criteria

1. THE Cookie Consent Banner SHALL use `position: fixed` with a 24px offset from the bottom edge and 24px horizontal margin, so pages can scroll underneath while the banner appears to float
2. THE Cookie Consent Banner on viewports ≥ 768px SHALL cap its width at 960px, center itself horizontally, and apply a 20px border radius and soft drop shadow to match the floating card look from the reference design
3. THE Banner background SHALL use a soft tint derived from the Reever accent palette (`--accent` / `#f05a7e` family) with a foreground color that meets WCAG AA contrast (≥ 4.5:1)
4. THE Banner heading text SHALL be bold, include the cookie emoji (🍪), and sit above the body copy with 8–12px spacing
5. THE Primary action button ("Accept all cookies") SHALL use a solid `#f05a7e` (or `--accent`) background with white text, 12px border radius, and 16px horizontal padding
6. THE Secondary buttons ("Reject all cookies", "Manage cookies") SHALL be rendered as outline buttons using a 1.5px border in `#f05a7e`, transparent background matching the banner, and the same height, radius, and padding as the primary button
7. THE Action buttons on viewports ≥ 768px SHALL align horizontally to the right with 12px spacing; on smaller viewports, THEY SHALL stack vertically with 8px spacing and full-width layout
8. THE Banner internal padding SHALL be 24px on all sides for desktop and 16px for mobile, ensuring the text never touches the edges of the floating card
