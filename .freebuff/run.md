# Preview Run Doc

## Prerequisites
- Node.js and npm installed
- Dependencies already installed (`node_modules/` present)
- No `.env.local` needed — the frontend works without GEMINI_API_KEY

## Reproduce Uncommitted Artifacts
- Dependencies are already installed in the main checkout. No extra copy steps needed.

## Run the Server
1. Port 3000 is usually occupied by an unrelated WhatsApp bridge process; use port 3001.
2. Start the server DETACHED (PowerShell, per-thread log paths; stdout and stderr must point at different files):
   ```
   powershell -NoProfile -Command '$env:PORT="3001"; (Start-Process -FilePath "npm.cmd" -ArgumentList "run","dev" -WorkingDirectory "C:\Users\felip\Documents\projects\winf-glass-home" -RedirectStandardOutput "<log>" -RedirectStandardError "<log>.err" -WindowStyle Hidden -PassThru).Id'
   ```
   Or manually: `PORT=3001 npm run dev`
3. Server binds to `http://localhost:3001` (server.ts honors the `PORT` env var; default is 3000).
4. Confirm it survived: `powershell -NoProfile -Command "Get-Process -Id <pid>"`, then wait until `curl http://localhost:3001` answers HTTP 200 before registering the preview.

Note: `.freebuff/start-dev.ps1` exists but is corrupted (backslashes mangled) — prefer the direct command above. Don't use it.

## Lighthouse audit (production build)

1. Build: `npx vite build`
2. Serve production: `NODE_ENV=production PORT=4173 npx tsx server.ts` (background)
3. Run: `CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe" npx --yes lighthouse@11 http://localhost:4173/ --output=json --output-path=.freebuff/lh/<page>.json --quiet --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage --window-size=1350,940 --mute-audio" --only-categories=performance,accessibility,best-practices,seo`
4. Kill stray Chrome between runs (`Get-Process chrome | Stop-Process -Force`) — scores vary ±10-15 pts on this VM if Chrome instances overlap.
5. Regenerate OG banners: `node scripts/generate-og-banners.mjs`. Asset codemods (one-shot): scripts/swap-png-refs.cjs, lazy-imports.cjs, lazy-videos*.cjs.
