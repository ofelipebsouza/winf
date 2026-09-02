# WINF™ Ecosystem - High-Performance Operating System

A premium digital platform for strategic partners in the high-end window film and architectural surface industry.

## Overview

WINF™ integrates advanced AI, technical precision, and luxury management into a unified digital ecosystem for the window film industry.

- **Design Philosophy:** Minimalist, high-contrast, "Cyber-Luxury" aesthetic.
- **Product Lines:** AeroCore™, NeoSkin™, Ceramic Armoring, Invisible™, Dual Reflect™, BlackPro™

## Tech Stack

- **Frontend:** React 18 + Vite (SPA)
- **Styling:** Tailwind CSS 4 with custom design system
- **Typography:** Gustavo (primary sans), JetBrains Mono (mono)
- **Animations:** Framer Motion for fluid micro-interactions
- **Smooth Scroll:** Lenis engine
- **Icons:** Lucide React
- **Backend:** Express.js server with Google Gemini AI proxy

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env` file with `GEMINI_API_KEY` for AI features.

## Project Structure

```
src/
  components/
    KoenigseggMenu.tsx          # Shared navigation drawer
    LandingWinfSelect.tsx       # Main product selector
    LandingWinfHome.tsx         # Comparison/overview page
    LandingAeroCore.tsx         # AeroCore™ product page
    LandingNeoskin.tsx          # NeoSkin™ product page
    LandingCeramicArmoring.tsx  # Ceramic Armoring page
    LandingInvisible.tsx        # Invisible™ product page
    LandingBlackPro.tsx         # BlackPro™ product page
    LandingDualReflect.tsx      # Dual Reflect™ product page
  App.tsx                       # Router & page navigation
  index.css                     # Global styles & font-face
  main.tsx                      # Entry point
public/
  fonts/                        # Gustavo font files (OTF)
  images/                       # Product hero images
  videos/                       # Product videos
docs/                           # Documentation & brand manuals
```

## Design System

- **Background:** `#131314` (Deep Space)
- **Surfaces:** `#1e1f20` / `#282a2c` for hierarchy
- **Borders:** `#444746`
- **Typography:** Gustavo (sans) + JetBrains Mono (mono)
- **Effects:** Scanlines, glow shadows, infinite ticker animations

## License

Internal Confidential System. All rights reserved to WINF™.
