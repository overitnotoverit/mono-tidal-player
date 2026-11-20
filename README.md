# Mono — GitHub Pages edition

Static, responsive music discovery page. It runs directly from GitHub Pages with no Node.js server or API secrets.

## Publish
1. Open repository Settings → Pages.
2. Under Build and deployment choose Deploy from a branch.
3. Select branch `main` and folder `/(root)`, then Save.
4. Wait for the Pages panel to show your site URL.

## TIDAL
Search opens the official TIDAL website. Playback and sign-in happen on TIDAL. GitHub Pages cannot run the Node.js backend or safely store a TIDAL client secret, so this static edition does not use private API searches or embedded full playback.
