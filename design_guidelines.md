# Design Guidelines for AIDevelo.AI Landing Page

## Design Approach
**Reference-Based Approach** - Drawing inspiration from modern SaaS landing pages like Linear, Notion, and Vercel, focusing on clean aesthetics with strategic use of vibrant colors for conversion optimization.

## Core Design Elements

### A. Color Palette
**Dark Mode Primary:**
- Background: 210 15% 6% (deep charcoal)
- Surface: 215 20% 8% (card backgrounds) 
- Text Primary: 210 20% 96% (crisp white)
- Text Secondary: 210 10% 78% (muted gray)

**Brand Colors:**
- Primary: 195 100% 85% (neon cyan #00cfff equivalent)
- Secondary: 270 95% 70% (vibrant purple #a100ff equivalent)
- Accent: Use sparingly for CTAs and highlights only

**Gradients:**
- Hero text gradient combining primary cyan to secondary purple
- Subtle radial gradients in hero background for depth
- CTA button gradients using brand colors

### B. Typography
**Font Family:** Inter (Google Fonts)
**Hierarchy:**
- H1: 48px (desktop) / 34px (mobile), weight 700-800
- H2: 34px (desktop) / 26px (mobile), weight 600-700  
- H3: 18px, weight 600
- Body: 16-18px, weight 400-500
- Small text/meta: 14px, weight 400

### C. Layout System
**Spacing Units:** Tailwind spacing of 4, 8, 16, 24, 32 units (p-4, m-8, gap-16, etc.)
**Container:** Max-width 1200px, centered
**Grid:** CSS Grid for sections, 3-column on desktop, 1-column on mobile

### D. Component Library

**Navigation:**
- Sticky header with backdrop blur
- Logo left, navigation right, prominent CTA button
- Mobile: Hamburger menu

**Cards:**
- Subtle borders with background blur effects
- Rounded corners (16px border-radius)
- Drop shadows for depth

**Buttons:**
- Primary: Gradient background with brand colors
- Secondary: Outline style with border
- Rounded corners, adequate padding for touch targets

**Forms:**
- Dark input fields with subtle borders
- Focus states using brand colors
- Clear validation states

### E. Animations
**Minimal approach:**
- Subtle fade-in animations on scroll
- Smooth hover transitions for interactive elements
- No complex or distracting animations

## Section-Specific Guidelines

### Hero Section
- Large gradient text treatment for headline
- Video placeholder with rounded corners and border
- Pill-shaped feature tags below headline
- Single prominent CTA button

### Features Section  
- Three-column grid on desktop
- Icon badges for each feature category
- Consistent card heights and spacing

### Pricing Section
- Three-tier comparison table
- Popular plan highlighted with border accent
- Clear pricing hierarchy and feature lists

### Testimonials
- Quote-style cards with attribution
- Grid layout maintaining visual balance

### Contact Form
- Two-column layout on desktop
- Lead capture fields as specified
- GDPR compliance notice in footer

## Images
**Hero Section:** Requires a demo video placeholder (16:9 aspect ratio) showing the product interface
**Gallery Section:** Six customer case study images (400x220px) in a three-column grid
**Logo:** Dark theme logo mark for header navigation
**No large hero background image** - using gradient overlays and clean typography instead

## Responsive Behavior
- Mobile-first approach with breakpoints at 768px and 1024px
- Grid layouts collapse to single column on mobile
- Typography scales appropriately across devices
- Touch-friendly button sizes and spacing