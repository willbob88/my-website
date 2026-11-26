# Artist Portfolio & Gallery (`willbob88/my-website`)

A clean, fast, zero-subscription fine art portfolio built with plain HTML, CSS, and JavaScript — hosted free on **GitHub Pages** and ready for **Print-on-Demand** whenever you want to start selling prints.

---

## How to Customize Your Site

Everything you need to edit lives in a single file: **`data/artworks.js`**.

1. **Change your name, bio, and email:**
   Open `data/artworks.js` and update `artistName`, `tagline`, `email`, `instagramUrl`, and `aboutParagraphs`.
2. **Replace sample paintings with your own artwork:**
   - Upload your painting photos into the `images/` folder (JPEG or WebP around 1200–1600px wide loads fastest).
   - Update the entries in `window.ARTWORKS` inside `data/artworks.js` with your title, medium, dimensions, year, price, and image path.
3. **Turn on Print-on-Demand ("Order Archival Print") later — $0/month:**
   - Create your prints on a free-tier POD service (e.g. **Printify Pop-Up Store**, **Printful Quick Stores**, **Fourthwall**, **INPRNT**, or **Stripe Payment Links**).
   - Paste the product URL into `printUrl: "https://..."` for any painting in `data/artworks.js`.
   - The button on that painting automatically upgrades from *"Notify Me When Prints Launch"* to **"Order Archival Print ↗"**.

---

## Publishing Live on GitHub Pages + Hostinger Domain

1. **Enable GitHub Pages:**
   - On GitHub, open **Settings → Pages** in `willbob88/my-website`.
   - Under **Build and deployment → Source**, choose **Deploy from a branch**.
   - Select branch **`main`** and folder **`/ (root)`**, then click **Save**.
2. **Connect your Hostinger domain:**
   - In GitHub **Settings → Pages → Custom domain**, enter your domain (e.g. `yourdomain.com`) and click **Save**.
   - In **Hostinger → Domains → DNS / Nameservers**, remove any old `A` record pointing to Hostinger's web server and add GitHub Pages' four `A` records for `@`:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Add a `CNAME` record for `www` pointing to `willbob88.github.io`.
   - Once DNS verifies (usually 10–30 minutes), check **Enforce HTTPS** in GitHub Pages settings.
