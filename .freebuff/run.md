# Preview Run Doc

## Prerequisites
- Node.js and npm installed
- Dependencies already installed (`node_modules/` present)
- No `.env.local` needed — the frontend works without GEMINI_API_KEY

## Reproduce Uncommitted Artifacts
- Dependencies are already installed in the main checkout. No extra copy steps needed.

## Run the Server
1. Port 3000 may be in use; the preview uses port 3001.
2. Start via PowerShell launcher script:
   ```
   powershell -NoProfile -ExecutionPolicy Bypass -File .freebuff/start-dev.ps1
   ```
   Or manually: `set PORT=3001 && npm run dev`
3. Server binds to `http://localhost:3001`.
4. Logs: `.freebuff/preview-733fab82-66a0-4a38-9ac3-37de39cbe6f3.log`
5. Stderr: `.freebuff/preview-733fab82-66a0-4a38-9ac3-37de39cbe6f3.log.err`
