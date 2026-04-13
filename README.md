# Warpod Studio

<p align="center">
  <a href="https://warpod.vercel.app">
    <img src=".github/assets/warpod-hero.png" alt="Warpod Studio hero preview" width="100%">
  </a>
</p>

<p align="center">
  <a href="https://warpod.vercel.app"><strong>Live demo</strong></a>
  |
  <a href="#quick-start">Run locally</a>
  |
  <a href="#architecture">Architecture</a>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-101010?style=flat-square&logo=react&logoColor=61DAFB">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6-101010?style=flat-square&logo=vite&logoColor=FFD62E">
  <img alt="Three.js" src="https://img.shields.io/badge/Three.js-WebGL-101010?style=flat-square&logo=threedotjs&logoColor=white">
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-ScrollTrigger-101010?style=flat-square&logo=greensock&logoColor=88CE02">
  <img alt="Vercel" src="https://img.shields.io/badge/Deployed_on-Vercel-101010?style=flat-square&logo=vercel&logoColor=white">
</p>

Warpod Studio is a cinematic React and Three.js website for a high-end digital studio. It combines WebGL scenes, GSAP scroll choreography, oval video curtain transitions, ambient audio and portfolio-style storytelling into a polished production deployment.

> [!NOTE]
> This repository is built as a frontend experience case study. The best way to evaluate it is to open the live deployment and scroll through the full sequence.

## Preview

<p align="center">
  <a href="https://warpod.vercel.app">
    <img src=".github/assets/warpod-demo.gif" alt="Warpod Studio animated demo" width="100%">
  </a>
</p>

<p align="center">
  <img src=".github/assets/warpod-bento.png" alt="Warpod Studio experience highlights" width="100%">
</p>

## Experience Highlights

- Cinematic landing sequence with large-format typography and atmospheric 3D visuals.
- Smooth scroll storytelling powered by Lenis, GSAP and ScrollTrigger.
- Oval video curtain transitions for the Creative Vision and Digital Mastery sections.
- Horizontal project showcase with image and video-led panels.
- Interactive 3D Kinetic Core scene built with React Three Fiber and Drei.
- Production deployment on Vercel with strict security headers and optimized runtime video assets.

## Tech Stack

| Layer | Tools |
| --- | --- |
| App | React 19, Vite |
| 3D | Three.js, React Three Fiber, Drei |
| Motion | GSAP, ScrollTrigger, Framer Motion |
| Scroll | Lenis |
| Styling | CSS variables, custom typography, responsive layouts |
| Deployment | Vercel |

## Architecture

```mermaid
flowchart LR
  User["Visitor"] --> Vercel["Vercel Edge"]
  Vercel --> Vite["Vite Static Build"]
  Vite --> React["React App"]
  React --> Motion["GSAP + Lenis Scroll System"]
  React --> WebGL["React Three Fiber Scenes"]
  React --> Media["Optimized Images, Audio and Video"]
```

## Quick Start

```bash
git clone https://github.com/ikerperez12/warpod.git
cd warpod
npm install
npm run dev
```

Build and validate before publishing:

```bash
npm run lint
npm run build
npm run preview
```

## Production Notes

- Live deployment: [warpod.vercel.app](https://warpod.vercel.app)
- Runtime videos are provided as optimized 1080p assets for smoother scroll playback.
- Security headers are configured in `vercel.json`, including CSP, frame protection, content type protection and referrer policy.
- Presentation assets for this README live in `.github/assets/`, separate from the website runtime assets.

## Repository Status

The public repository is intentionally focused on the production website. It excludes local environment files, deployment state, dependencies, generated build output and internal cleanup artifacts.
