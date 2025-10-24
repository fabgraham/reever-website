# Favicon Setup Guide

## Overview
The website is configured to use multiple favicon sizes for different devices and platforms. You need to generate these favicon files from your logo.

## Required Favicon Files

Place these files in the `public/` directory:

- `favicon.ico` - 16x16 and 32x32 (multi-size ICO file)
- `favicon-16x16.png` - 16x16 PNG
- `favicon-32x32.png` - 32x32 PNG
- `apple-touch-icon.png` - 180x180 PNG (for iOS devices)
- `android-chrome-192x192.png` - 192x192 PNG (for Android)
- `android-chrome-512x512.png` - 512x512 PNG (for Android)

## How to Generate Favicons

### Option 1: Online Favicon Generator (Easiest)

1. Go to https://realfavicongenerator.net/
2. Upload your logo image (preferably `media/reever-logo-black.jpeg` or a square version)
3. Customize the appearance for different platforms if desired
4. Click "Generate your Favicons and HTML code"
5. Download the favicon package
6. Extract all files to the `public/` directory
7. The HTML code is already added to `index.html`, so you're done!

### Option 2: Using ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Navigate to your project directory
cd public

# Create favicons from your logo
convert media/reever-logo-black.jpeg -resize 16x16 favicon-16x16.png
convert media/reever-logo-black.jpeg -resize 32x32 favicon-32x32.png
convert media/reever-logo-black.jpeg -resize 180x180 apple-touch-icon.png
convert media/reever-logo-black.jpeg -resize 192x192 android-chrome-192x192.png
convert media/reever-logo-black.jpeg -resize 512x512 android-chrome-512x512.png

# Create multi-size ICO file
convert favicon-16x16.png favicon-32x32.png favicon.ico
```

### Option 3: Manual Creation

1. Open your logo in an image editor (Photoshop, GIMP, etc.)
2. Create a square version if needed
3. Export at each required size:
   - 16x16, 32x32, 180x180, 192x192, 512x512
4. Save as PNG files with the correct names
5. Use an online ICO converter to create `favicon.ico` from the 16x16 and 32x32 versions

## Verification

After adding the favicon files:

1. Deploy your site to Netlify
2. Visit your website
3. Check the browser tab - you should see your favicon
4. Test on mobile devices - add to home screen to see the app icon

## Files Already Configured

✅ `public/_headers` - Cache headers for favicons
✅ `public/site.webmanifest` - PWA manifest with icon references
✅ `public/index.html` - Favicon links in the `<head>` section

## Recommended Logo

Use a **square version** of your logo for best results across all platforms. If your logo is rectangular, consider:
- Creating a square version with the logo centered
- Using just the "R" from Reever as a simple icon
- Adding a background color that matches your brand

## Theme Color

The theme color is set to `#f05a7e` (your accent pink) in:
- `site.webmanifest`
- `<meta name="theme-color">` tag

This affects the browser UI color on mobile devices.
