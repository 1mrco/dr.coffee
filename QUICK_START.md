# Quick Start Guide

## 🚀 Getting Your Website Running

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Visit [http://localhost:3000](http://localhost:3000)

## 📝 Before Going Live

### Update Contact Information

1. **Phone Number**: Update in:
   - `app/contact/page.tsx`
   - `app/how-to-order/page.tsx`
   - `app/page.tsx` (Order Section)
   - `components/Footer.tsx`

2. **WhatsApp Link**: Update `https://wa.me` with your actual WhatsApp number
   - Format: `https://wa.me/964XXXXXXXXX`

3. **Instagram Link**: Update `https://instagram.com` with your Instagram handle
   - Format: `https://instagram.com/yourhandle`

4. **Social Media**: Update all social media links in `components/Footer.tsx`

### Update Products

Edit product information in:
- `app/page.tsx` (Featured Products section)
- `app/menu/page.tsx` (All products list)

### Customize Content

- **About Page**: Edit `app/about/page.tsx` to add your story
- **Copywriting**: All text content can be customized in respective page files

## 🎨 Design Customization

### Colors
Edit `tailwind.config.js` to change brand colors:
- Primary: `#1F3D2B`
- Cream: `#F5F3EE`
- Coffee: `#6F4E37`
- Accent colors: Orange, Pink, Yellow

### Fonts
Fonts are loaded from Google Fonts in `app/globals.css`:
- Headings: Poppins
- Body: Inter

## 📱 Features Included

✅ Mobile-first responsive design
✅ 3D interactive product cards
✅ Smooth animations
✅ Sticky navigation header
✅ Mobile bottom CTA button
✅ Product filtering on menu page
✅ Contact forms and links
✅ SEO optimized

## 🚢 Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Deploy to Netlify
1. Build: `npm run build`
2. Publish directory: `.next`
3. Deploy

## 📞 Support

For questions or issues, refer to the main README.md file.

