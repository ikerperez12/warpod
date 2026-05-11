# Iker Webdeploy Release Plan

## Release Target

- Provider: Vercel.
- Project: `ikerperez12s-projects/warpod`.
- Branch: `main`.
- Preview URL: No encontrado.
- Production URL: `https://warpod.vercel.app`.
- Latest production deployment: `https://warpod-fmbv5rz9y-ikerperez12s-projects.vercel.app`.
- Domain: `warpod.vercel.app`.

## Preflight

- [x] Git state reviewed.
- [x] Env vars reviewed: none required.
- [x] Build command known: `npm run build`.
- [x] Output directory known: Vite default `dist`.
- [x] Tests/QA run: lint, build, React Doctor, npm audit, Playwright snapshots, production HTTP check.
- [x] Secrets checked through `.gitignore` and repo inspection.
- [x] Docs updated.

## Deploy Steps

1. Commit validated local changes to `main`.
2. Push `main` to `origin`.
3. Let Vercel Git integration deploy production automatically.
4. Verify Vercel deployment is `Ready`.
5. Verify `https://warpod.vercel.app` returns HTTP 200.

## Verification

- [x] Production loads.
- [x] Primary scroll storytelling surface renders in desktop and mobile snapshots.
- [x] Console checked: 0 errors.
- [x] Mobile checked at `390x844`.
- [x] SEO/a11y/perf/security notes recorded in `02-quality-gates.md`.

## Rollback

- Preferred: revert the latest Git commit and push to `main`.
- Vercel fallback: promote or redeploy the previous Ready production deployment from the Vercel dashboard/CLI.
- Local fallback: run `git log --oneline`, identify the last known good commit and use a revert commit instead of history rewriting.
