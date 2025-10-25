# Implementation Plan - Cookie Consent & Privacy Compliance

- [x] 1. Remove Non-Essential Scripts from HTML Head (CRITICAL)
  - Remove Netlify Identity script from public/index.html line 33
  - Replace Spotify iframe with placeholder div in public/index.html line 1338
  - Ensure no third-party scripts load before consent check
  - Add data-src attributes to store original URLs for later loading
  - Verify no cookies are set on initial page load without consent
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [x] 2. Cookie Consent Banner HTML & CSS
  - Add cookie banner HTML structure to index.html before closing body tag
  - Create CSS styles with equal prominence for Accept/Decline buttons (same size, weight, styling)
  - Add accessibility attributes (aria-modal="true", aria-describedby, role="dialog")
  - Implement smooth slide-up animation and responsive design
  - Update banner text to be specific: "We use cookies for Spotify embeds and optional Netlify login"
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 9.4, 9.5_

- [x] 3. Consent Management JavaScript with Accessibility
  - Implement CookieConsent object with 6-month expiry (not 365 days)
  - Add focus trap functionality when banner is displayed
  - Implement ESC key to close banner and return focus to triggering element
  - Add keyboard navigation support (Tab, Enter, Space keys)
  - Handle localStorage unavailability by defaulting to decline and re-showing banner
  - _Requirements: 2.4, 2.5, 3.1, 3.2, 3.3, 3.5, 3.6, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [x] 4. Dynamic Script Loading System
  - Implement conditional loading of Netlify Identity script only after consent
  - Create Spotify iframe replacement system using placeholder div
  - Add "Enable Cookies" button in blocked content areas
  - Ensure scripts load immediately when consent is given
  - Test that declined consent prevents all non-essential requests
  - _Requirements: 2.6, 2.7, 2.8, 7.1, 7.2, 7.3, 7.4, 7.5, 12.1, 12.2, 12.3, 12.4_

- [x] 5. Privacy Policy Page with Legal Compliance
  - Create privacy.html with comprehensive cookie list table (name, provider, purpose, duration, type)
  - Document lawful basis: "legitimate interests" for contact enquiries, "consent" for cookies
  - Add data retention periods for contact form submissions
  - Include international transfer information (Netlify hosting locations, UK-US Data Bridge)
  - Add ICO contact information and data subject rights under UK GDPR
  - Include controller identity and contact details
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 9.1, 9.2, 9.3, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [x] 6. Privacy Links and Contact Form Updates
  - Add Privacy Policy and Cookie Settings links to website footer
  - Update contact form notice to use "legitimate interests" (not consent language)
  - Change text to: "We use your information to respond to your enquiry. See our Privacy Policy."
  - Add privacy policy link to cookie consent banner
  - Ensure all links open in same tab and are properly styled
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 7. Cookie Settings Management with Re-prompting
  - Implement cookie settings functionality in footer
  - Add 6-month re-prompting system (not 365 days)
  - Ensure banner reappears when cookie settings is clicked or consent expires
  - Apply new preferences immediately without page refresh
  - Test preference changes work correctly and update script loading
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 3.3_

- [ ]* 8. Accessibility and Keyboard Testing
  - Test focus trap behavior when banner is open
  - Verify ESC key closes banner and returns focus properly
  - Test keyboard navigation through all banner elements
  - Validate screen reader compatibility and ARIA attributes
  - Test with various assistive technologies
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ]* 9. Cross-Browser and Compliance Testing
  - Test cookie consent functionality on Chrome, Firefox, Safari, Edge
  - Test on mobile browsers (iOS Safari, Chrome Mobile)
  - Verify localStorage handling in private browsing mode
  - Validate that consent expires correctly after 6 months
  - Test that NO non-essential cookies are set when declined
  - Use browser dev tools to verify no Spotify/Netlify requests when declined
  - _Requirements: All requirements validation_

- [ ]* 10. Legal Compliance Audit
  - Review privacy policy for UK GDPR and PECR compliance
  - Verify cookie list is comprehensive and up-to-date
  - Test that lawful basis is correctly documented for each purpose
  - Ensure contact form uses legitimate interests (not consent)
  - Validate equal prominence of Accept/Decline buttons
  - Document cookie audit and data processing activities
  - _Requirements: All legal compliance requirements_