# Dr.Coffee Website

A modern, high-end website for Dr.Coffee built with Next.js, React, and Tailwind CSS.

## Features

- 🎨 **Modern UI/UX**: Clean, premium design with 3D interactive elements
- 📱 **Mobile First**: Fully responsive design optimized for mobile devices
- ⚡ **Performance**: Fast loading with optimized images and lazy loading
- 🎭 **Animations**: Smooth animations using Framer Motion
- 🎯 **3D Effects**: Interactive product cards with 3D hover effects
- 🌐 **Multi-page**: Complete website with Home, Menu, About, How to Order, and Contact pages

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── about/          # About page
│   ├── contact/        # Contact page
│   ├── how-to-order/   # How to Order page
│   ├── menu/           # Menu page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Footer component
│   └── ProductCard.tsx # Product card with 3D effects
├── public/             # Public assets (images, logos, stickers)
└── package.json        # Dependencies
```

## Brand Colors

- **Primary**: `#1F3D2B` (Dark Green)
- **Cream**: `#F5F3EE` (Cream White)
- **Coffee**: `#6F4E37` (Coffee Brown)
- **Accent Orange**: `#FF8C42`
- **Accent Pink**: `#F4A3B4`
- **Accent Yellow**: `#FFD166`

## Image Setup

All images are stored in the `public/` directory and can be accessed directly:
- Drink images: `public/image/drinks images/`
- Model images: `public/image/model images/`
- Stickers: `public/stickers/`
- Logo: `public/logo/`

## Customization

### Update Contact Information

Edit the contact links in:
- `components/Footer.tsx`
- `app/contact/page.tsx`
- `app/how-to-order/page.tsx`
- `app/page.tsx` (Order Section)

### Update Products

Edit the product list in:
- `app/page.tsx` (Featured Products)
- `app/menu/page.tsx` (All Products)

### Update Social Media Links

Update Instagram, WhatsApp, and phone links throughout the site.

## Build for Production

```bash
npm run build
npm start
```

## Deployment

This website can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any Node.js hosting service**

## Notes

- The website is mobile-first and fully responsive
- All animations are optimized for performance
- Images should be optimized before deployment
- Update contact information and social media links before going live

## License

© 2025 Dr.Coffee. All rights reserved.

