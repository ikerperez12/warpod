# Iker Webdeploy Audit

Audit date: 2026-05-11

## Repo Evidence

| Item | Value | Status |
| --- | --- | --- |
| Repo path | `C:\PROYECTOS\IDEAS\warpod` | Verified |
| Product name | Warpod Studio | Verified |
| Product type | Portfolio/cinematic frontend SPA | Verified |
| Stack | React 19, Vite 6, Three.js, React Three Fiber, Drei, GSAP, Framer Motion, Lenis, Vercel Analytics | Verified |
| Current branch | `main` | Verified |
| Git remote | `https://github.com/ikerperez12/warpod.git` | Verified |
| Deploy provider | Vercel | Verified with `npx vercel ls` |
| Live URL | `https://warpod.vercel.app` | Verified HTTP 200 |
| Latest deployment | `https://warpod-fmbv5rz9y-ikerperez12s-projects.vercel.app` | Verified Ready, Production |
| Preview URL | No encontrado | No preview deployment was required for this final production closeout |

## Files Reviewed

| File / source | What it proves | Status |
| --- | --- | --- |
| `README.md` | Professional public presentation, live demo link, visual assets, stack, quick start and production notes | Verified |
| `package.json` / `package-lock.json` | Scripts, React/Vite stack, Vercel Analytics dependency and audited lockfile | Verified |
| `.github/assets/*` | README hero, demo GIF, bento and social preview assets | Verified |
| `.github/workflows/*` | No encontrado | No CI workflow currently exists |
| `vercel.json` | CSP and security headers for production | Verified |
| `.vercel/project.json` | No encontrado | `.vercel/` is intentionally ignored and not versioned |
| `.gitignore` | Ignores `.env`, `.vercel`, `node_modules`, `dist` and local generated assets | Verified |
| `index.html` | Title, viewport, description and theme color | Verified |
| `src/*` | Main cinematic React app, WebGL canvases, deferred media loading and scroll orchestration | Verified |
| `public/assets/*` | Runtime videos, images, fonts, audio and models | Verified |

## Risks

| Risk | Severity | Evidence | Decision |
| --- | --- | --- | --- |
| Large Three/Drei environment chunk | Low | `npm run build` reports `Environment` chunk around 906 kB minified | Accepted for current visual fidelity; no runtime failure |
| Full WCAG AA audit not completed with axe | Low | `@axe-core/cli` blocked by local ChromeDriver/Chrome mismatch | Playwright desktop/mobile snapshots and console checks passed; full axe can be added later if required |
| No GitHub Actions CI | Low | `.github/workflows/*` not found | Accepted for this small Vite SPA; local gates are documented and passed |

## Unknowns

- No verificado: GitHub repository social preview setting in the GitHub UI.
- No verificado: Real-user Core Web Vitals after traffic.
