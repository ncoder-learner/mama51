# Happy 51st, Mama 🎂

A little birthday site. Open `index.html` in a browser to preview it right now — no build step needed.

## Adding your photos

1. Put your photo files in the `images/` folder.
2. Open `script.js` and look at the `photos` list at the top — it already expects files named `photo-1.jpg` through `photo-6.jpg`.
   - Easiest: rename your photos to match those names.
   - Or: change the `src` in each entry to your actual filenames.
3. Add a `caption` to any photo if you want text to appear on hover (optional — leave it as `""` to skip).
4. Want more or fewer than 6 photos? Just add or delete entries in that list — the gallery updates automatically. Any entry whose file isn't found shows a clean placeholder instead of a broken image, so you can build this out gradually.

## Previewing locally

Just double-click `index.html` — it works as a plain file, no server required.

## Deploying to Vercel via GitHub

1. Create a new GitHub repo and push this folder to it:
   ```
   git init
   git add .
   git commit -m "Happy birthday, Mama"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com), click **Add New → Project**, and import that GitHub repo.
3. Leave all settings as default (this is a plain static site — no framework/build config needed) and click **Deploy**.
4. Vercel gives you a live link (e.g. `your-project.vercel.app`) you can text or share.

That's it — no build tools, no dependencies.
