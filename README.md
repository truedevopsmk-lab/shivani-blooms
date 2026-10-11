# Shivani Blooms 🌷

A gentle, mobile-first habit tracker for daily routines, little to-dos, mood check-ins, and monthly progress. Built with plain HTML, CSS, and JavaScript so it can be hosted free on GitHub Pages.

**Suggested repository name:** `shivani-blooms`  
**App title:** Shivani Blooms — Your Daily Habit Garden

## Features

- Home dashboard with your Paris sunset photo, greeting, daily encouragement, and daily completion progress.
- Set a profile picture from the phone's photo library.
- Add, edit, pause/resume, and archive habits; choose a category, icon, and optional goal.
- Daily checklist with one-tap completion.
- Daily to-do list with tick-off and delete controls.
- Optional mood check-in.
- Monthly colour-coded habit grid. Tap a date to see or change that day's check-ins.
- Monthly consistency summary and habit-by-habit progress.
- JSON backup/restore and CSV export.
- Local-first storage and a service worker for an offline app shell after the first successful online visit.
- Responsive layout designed for phones, including iPhone safe-area padding.

## Files

- `index.html` — screen structure and navigation
- `styles.css` — responsive design
- `app.js` — interactions, rendering, storage, charts/grid, backup/export
- `manifest.webmanifest` — PWA name and install settings
- `sw.js` — service worker/offline app shell
- `assets/paris-sunset.jpg` — supplied Paris sunset home-cover photo
- `assets/monthly-tracker-reference.png` — supplied monthly tracker reference image
- `assets/icon.svg` — app icon

## Publish on GitHub Pages

1. Create a new **public** GitHub repository named `shivani-blooms` (or another name you prefer).
2. Upload the **contents** of this folder to the repository root. `index.html` must be at the root, not inside another nested folder.
3. Commit/push the files to the `main` branch.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Select branch **main** and folder **/(root)**, then save.
7. Wait for deployment to finish. The expected URL is:

   `https://YOUR-GITHUB-USERNAME.github.io/shivani-blooms/`

   For the account used for the earlier FitTrack project, the URL pattern would be `https://truedevopsmk-lab.github.io/shivani-blooms/`.

8. Open the published URL and test the Home, Habits, Month, Progress, and More tabs. Verify that the browser address starts with `https://`.

### Install on iPhone

1. Open the published URL in **Safari** on Shivani's iPhone.
2. Tap **Share**.
3. Choose **Add to Home Screen**.
4. Keep the name **Shivani Blooms** and, if offered, enable **Open as Web App**.
5. Tap **Add**.

The first visit should be online so the service worker can cache the app shell for later offline opening.

## Data and privacy — please read

- Habits, mood, to-dos, profile photo, and history are stored in the browser's local storage on the current device/profile.
- This app does not send habit records to an app-owned server.
- Data does **not** automatically sync between iPhone, Mac, Safari, Chrome, or different browser profiles.
- Clearing website/browser data may erase the local entries. Export a JSON backup periodically and store it somewhere safe.
- JSON import replaces the current local data after confirmation; export a backup before restoring if you need to keep the existing records.
- The supplied `monthly-tracker-reference.png` is included as a design reference; the app builds its own live monthly grid from the habits you create.
- The Google Fonts import is optional decorative typography; the app's system-font fallbacks continue to work if that resource is unavailable.

## Notes / limitations

- The starter habits are examples only. Shivani can rename, pause, or archive them and create her own routines.
- Mood check-ins are personal journaling prompts, not health assessments.
- Browser notifications, cloud sync, accounts, encrypted backups, and AI coaching are not implemented.
- For privacy, keep the repository source public only if you are comfortable with others seeing the code and the supplied cover photo. The app's local habit entries are not committed to GitHub.
- This first version uses `localStorage`, suitable for a simple single-device tracker. If reliable sync between multiple devices is needed later, plan a secure backend and merge/backup strategy rather than assuming GitHub Pages will sync the data.

## Local preview

You can open `index.html` directly to inspect the layout, but PWA install/offline features require HTTPS or a local web server. For a quick local server from this folder, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.


## Shivani starter habits

The first-run experience is preloaded with habits inspired by Shivani's handwritten chart: wake up at 6 AM, 10 minutes of oil pulling, a 10-minute morning walk, yoga, all home meals, and reading a book. “Tasks of the day” remains a separate daily to-do list so one-off tasks don't clutter recurring habits. Habits can be edited, paused/resumed, archived, or deleted from the habit-management screen. Delete asks for confirmation; archive/pause are gentler options when preserving the habit's check-in history matters.
