# Instagram Feed Setup Guide

## Overview
The website displays 3 Instagram posts in the "Follow Us on Instagram" section. Since this is a static website, the posts need to be manually updated.

## How to Update Instagram Posts

### Step 1: Choose Your 3 Latest Posts
1. Go to https://www.instagram.com/reever.band/
2. Select the 3 posts you want to display on the website

### Step 2: Save the Images
For each post:
1. Open the post on Instagram
2. Right-click on the image
3. Select "Save image as..."
4. Save to the `public/media/` folder with names like:
   - `instagram-1.jpg`
   - `instagram-2.jpg`
   - `instagram-3.jpg`

### Step 3: Update the Code
1. Open `public/index.html`
2. Find the `loadInstagramFeed()` function (around line 944)
3. Update the `instagramPosts` array with your data:

```javascript
const instagramPosts = [
  {
    url: 'https://www.instagram.com/p/YOUR_POST_ID/',  // Copy from Instagram post URL
    image: 'media/instagram-1.jpg',                     // Your saved image
    caption: 'Your post caption here! 🎸'              // Copy from Instagram
  },
  {
    url: 'https://www.instagram.com/p/YOUR_POST_ID_2/',
    image: 'media/instagram-2.jpg',
    caption: 'Another great gig! 🎵'
  },
  {
    url: 'https://www.instagram.com/p/YOUR_POST_ID_3/',
    image: 'media/instagram-3.jpg',
    caption: 'Thank you for coming! 🙌'
  }
];
```

### Step 4: Deploy
After updating, commit and push your changes to trigger a new Netlify deployment.

## Responsive Design
- **Desktop (>900px)**: 3 columns
- **Tablet (600-900px)**: 2 columns  
- **Mobile (<600px)**: 1 column (stacked)

## Alternative: Automatic Instagram Feed

If you want automatic updates without manual work, you'll need one of these solutions:

### Option 1: Third-Party Services (Easiest)
- **Juicer.io** - Free tier available, embeddable widget
- **SnapWidget** - Instagram feed widget
- **Behold** - Instagram feed for websites

### Option 2: Instagram Basic Display API (Complex)
Requires:
- Facebook Developer account
- Instagram Business/Creator account
- OAuth authentication setup
- Access token management
- Backend server or serverless function

### Option 3: Serverless Function (Advanced)
- Set up Netlify Function or AWS Lambda
- Fetch from Instagram API
- Cache results
- Requires developer setup

## Recommendation
For a static band website, **manual updates** (current setup) are the simplest and most reliable approach. Update the posts monthly or when you have new content to showcase.
