# PulseMate Landing Page

A dark-themed Next.js 14 landing page for PulseMate - an AI companion platform with flirty chat features.

## Features

- **Dark Theme**: #121212 background with #FF69B4 pink and #00FFFF cyan accents
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Smooth Animations**: 
  - Heartbeat pulse on logo (using framer-motion)
  - Fade-in sections on scroll
  - Hover glow effects on interactive cards
- **SEO Optimized**: Complete meta tags for search engines and social sharing
- **Waitlist Form**: Email capture with console.log output (ready for API integration)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Navigate to the project directory:
```bash
cd pulsemate
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
pulsemate/
├── app/
│   ├── layout.tsx       # Root layout with SEO metadata
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles and Tailwind directives
├── components/
│   ├── Header.tsx       # Fixed header with animated logo
│   ├── Hero.tsx         # Hero section with image carousel
│   ├── ModelPreviews.tsx # AI companion cards carousel
│   ├── WaitlistForm.tsx # Email waitlist form
│   └── Footer.tsx       # Footer with links
├── public/             # Static assets
├── tailwind.config.js  # Tailwind configuration
└── package.json
```

## Sections

1. **Header**: Fixed navigation with heartbeat logo animation and CTA buttons
2. **Hero**: 90vh section with rotating blurred background images and main CTA
3. **Model Previews**: Horizontal scroll carousel (mobile) / grid (desktop) of 5 AI companions
4. **Waitlist Form**: Email capture with 18+ age verification checkbox
5. **Footer**: Links, social icons, and legal notices

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:
- Background: `#121212`
- Pink accent: `#FF69B4`
- Cyan secondary: `#00FFFF`

### AI Companions

Edit the `companions` array in `components/ModelPreviews.tsx` to add/modify companion cards.

### Images

Replace placeholder image URLs in:
- `components/Hero.tsx` (background carousel)
- `components/ModelPreviews.tsx` (companion cards)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Deploy with one click

### Other Platforms

```bash
npm run build
npm run start
```

## Future Enhancements

- Connect waitlist form to backend API
- Add actual companion preview modals
- Implement authentication flow
- Add more interactive animations
- Integrate with AI chat backend

## License

© 2026 PulseMate. All rights reserved.

---

**Note**: This is an 18+ platform with suggestive content. Ensure compliance with applicable laws and regulations.
