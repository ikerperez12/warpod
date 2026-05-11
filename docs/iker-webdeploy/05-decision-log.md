# Iker Webdeploy Decision Log

| Date | Area | Decision | Reason | Evidence | Revisit |
| --- | --- | --- | --- | --- | --- |
| 2026-05-11 | Project pattern | Classify as Portfolio/cinematic frontend | Warpod is a visual React/Three.js studio site with scroll storytelling and no backend | README, `src/App.jsx`, production render | If backend or CMS is added |
| 2026-05-11 | Deploy provider | Use Vercel production from GitHub `main` | Current project is deployed on Vercel and user requested push/finalize | `npx vercel ls`, live URL HTTP 200 | If provider changes |
| 2026-05-11 | Backend | Do not add backend | No persistence, auth, secrets or server validation required | `package.json`, source inspection | If forms, auth, payments or data storage are added |
| 2026-05-11 | Visual fidelity | Accept Vite Three/Drei chunk warning | Aggressive splitting or asset removal could risk the current cinematic experience | `npm run build` warning only, build passes | During a dedicated performance pass |
| 2026-05-11 | Security | Keep strict Vercel headers | Static public site benefits from CSP, frame and permissions restrictions | `vercel.json` | When adding external APIs/assets |
| 2026-05-11 | Release docs | Add `docs/iker-webdeploy/` evidence | User invoked `iker-webdeploy`; skill requires auditable release artifacts | This docs directory | On every substantial release |
