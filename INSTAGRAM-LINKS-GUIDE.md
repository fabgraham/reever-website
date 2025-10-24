# How to Add Your Instagram Posts - SUPER EASY! 🎸

## Quick Start (3 Simple Steps)

### 1. Get Your Instagram Post URLs

1. Go to your Instagram profile: https://instagram.com/reever.band
2. Click on a post you want to feature
3. Copy the full URL from your browser's address bar
   - Example: `https://www.instagram.com/p/ABC123xyz/`

### 2. Update the JavaScript Array

Open `public/index.html` and search for `instagramPosts` (around line 2050).

You'll find this array:
```javascript
const instagramPosts = [
  'https://www.instagram.com/p/YOUR_POST_ID_1/',
  'https://www.instagram.com/p/YOUR_POST_ID_2/',
  'https://www.instagram.com/p/YOUR_POST_ID_3/'
];
```

### 3. Replace with Your Real URLs

Just paste your Instagram post URLs:
```javascript
const instagramPosts = [
  'https://www.instagram.com/p/ABC123xyz/',
  'https://www.instagram.com/p/DEF456abc/',
  'https://www.instagram.com/p/GHI789def/'
];
```

**That's it!** The images will load automatically! 🎉

## Adding More Posts

Want to show more than 3 posts? Just add more URLs to the array:

```javascript
const instagramPosts = [
  'https://www.instagram.com/p/POST1/',
  'https://www.instagram.com/p/POST2/',
  'https://www.instagram.com/p/POST3/',
  'https://www.instagram.com/p/POST4/',
  'https://www.instagram.com/p/POST5/',
  'https://www.instagram.com/p/POST6/'
];
```

The grid will automatically adjust!

## How It Works

- ✅ Images load directly from Instagram (no downloads needed)
- ✅ Each image is clickable and opens the post on Instagram
- ✅ No captions shown (clean look)
- ✅ Automatic fallback if an image fails to load
- ✅ Lazy loading for better performance

## Troubleshooting

**Images not showing?**
- Make sure the Instagram posts are public (not private)
- Check that the URLs are complete and correct
- Instagram may block direct image loading in some cases - if this happens, you can save the images locally to the `media` folder instead
