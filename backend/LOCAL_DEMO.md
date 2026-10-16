# Local demo runbook

Run these in separate terminals from `backend/`:

1. Start local Redis with the password already held in ignored `.env`:

   ```sh
   npm run redis:start
   ```

2. Install the browser once:

   ```sh
   npm run playwright:install
   ```

3. Start the API and scan worker:

   ```sh
   npm run dev
   npm run worker:scan
   ```

The local seeded account is `demo@appdoctor.local`. Establish its development-only browser session with `POST /local-demo/session`; this route is unavailable outside development. Register only a Lovable app you are authorised to test. The first scan observes rendering, requests, links and console errors; it does not submit forms or trigger business actions.

Redis is intentionally bound to `127.0.0.1`, uses AOF persistence, a 256 MB limit, and `noeviction` so queued jobs are not silently discarded.
