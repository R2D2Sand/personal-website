# Veyra public results dashboard

Route: /veyra. Public and read-only, with no viewer login or password required.
Existing site pages are unchanged. No order endpoints or trading controls exist.

Public data is restricted to allow-listed market prices, experimental predictions,
indicator readings, and aggregate observation results. Account information,
credentials, local file paths, and raw logs must never be exported.

Local snapshots come from ignored data/veyra/dashboard.json, created by
Veyra's snapshot_export.py. The page shows data age and handles missing data.

The future VPS connection can use VEYRA_DATA_URL (HTTPS) and VEYRA_DATA_TOKEN
(read-only server-to-server token). That connection secret stays on the server;
visitors do not need it. No Kalshi keys belong in the website or browser.
The remote VPS endpoint/transport is not implemented yet.

VEYRA_DASHBOARD_PASSWORD and VEYRA_SESSION_SECRET are no longer used.
The previous private-viewer instructions have been superseded.
This branch has not been deployed to Vercel.
