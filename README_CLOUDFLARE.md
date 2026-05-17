# Deploy to Cloudflare Workers

This project is set up to run on Cloudflare Workers using `@cloudflare/vite-plugin` and the existing `wrangler.jsonc`.

Prerequisites
- Node.js and npm
- `wrangler` CLI (install globally or use `npx`)

Quick deploy steps

1. Build the project:

```bash
npm run build
```

2. Login with Wrangler (one-time):

```bash
npx wrangler login
```

3. Publish to Cloudflare:

```bash
npx wrangler publish
# or if wrangler installed globally
wrangler publish
```

Convenience script

- `npm run publish:cf` will run `build` then `wrangler publish` (requires global `wrangler` or `npx wrangler`).

Notes
- `wrangler.jsonc` already points `main` to `src/server.ts` and the Vite config redirects the server entry via the plugin.
- If you need a dedicated environment or account/project settings, edit `wrangler.jsonc` or create `wrangler.toml` with your account/project details.
- For local emulation, use `npx wrangler dev`.
