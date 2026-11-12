# JBNU Presidential Briefing

An editable, static five-screen briefing for José Aldonate. Plain HTML, CSS and JavaScript. No framework, npm install, database, API keys or build step is required.

## Before publishing: privacy

Publishing makes the briefing, photographs and linked PDFs publicly accessible. This includes the signed Ambassador's Letter. Publish only material you are comfortable making public and have permission to share. A hard-to-guess URL, robots noindex, or a private source repository is NOT access control for a public Pages site. Removing a document button does not remove the underlying PDF. If a document must not be public, remove the PDF, its preview images, its config entry and the corresponding buttons before the first public commit. Previously committed files can remain in Git history.

The included noindex/nofollow meta tag asks compliant search engines not to index the page; it does not prevent access or forwarding. Do not upload passports, bank statements, immigration records or other private application materials.

## Folder map

```text
index.html             Slide text and structure. Start here for copy edits.
styles.css             Typography, colors, layout, transitions, phone styles.
app.js                 Navigation, reading/slide modes, dialogs, downloads.
config.js              Screenshot-switcher text and document/preview paths.
.nojekyll              Tells GitHub Pages to serve this as a static site.
assets/images/         Portrait, platform screenshots and cooperation photos.
assets/previews/       JPEG previews of the two supporting PDFs.
documents/             Original letter, original full presentation, briefing PDF.
README.md              This guide.
```

The original standalone HTML embedded all documents and previews in one large file. This version separates them: HTML/CSS/JS/config total about 39 KB, plus images requested by the browser. Supporting PDFs are requested only when opened or downloaded; preview images are inserted when a document dialog opens. The entire folder is still larger because it includes the original PDFs. Do not commit the old 33 MB single-file HTML alongside this version.

## 1. Create your repository

1. Download and unzip the source ZIP.
2. On GitHub create a repository, for example `jbnu-briefing`.
3. For the simplest GitHub Free setup, use a public repository. Private-repository Pages availability depends on your plan, and a private repository does not automatically make its Pages site private.
4. Initialize with a README so the `main` branch exists.
5. Select **Code → Codespaces → Create codespace on main**.

## 2. Put the files in Codespaces

Drag the CONTENTS of the unzipped `jbnu-briefing` folder into the repository's Explorer panel. Replace the initial README when prompted. `index.html` must be at the repository root, not one extra folder down. Keep all subfolders intact. Make sure `.nojekyll` is included; it is a hidden/empty file. If you cannot see it, create an empty file with that exact name in the editor.

Expected: Explorer shows `index.html`, `styles.css`, `app.js`, `config.js`, `assets/` and `documents/` directly under the repository name.

## 3. Preview while editing

In YOUR Codespaces terminal, from the repository root:

```bash
python3 -m http.server 8000
```

Open **Ports**, find port **8000**, and select **Open in Browser** (or click the preview notification). Keep this development port private. If it is not listed, use **Add Port → 8000**. This development server is just a preview; it is not your permanent deployment. Stop it with Ctrl+C when finished.

Save a file and refresh the browser to see changes. This simple server does not automatically refresh the page. Use a separate terminal for Git commands while it is running.

Check:
- Laptop slide navigation and arrow keys.
- Phone-sized reading view (390 px is a useful starting width).
- Read view / Slide view toggle.
- Both platform screenshot tabs.
- Letter and full-presentation previews, Close and Escape.
- Open PDF and Download PDF for each document.
- Toolbar Download PDF button.
- Keyboard Tab focus and reduced-motion behavior.

The package has had static path/structure checks, not a full browser interaction test. Complete these checks before sending the public link.

## 4. Commit and push

Use Codespaces **Source Control** to review changed files, stage them, enter a message and **Commit**, then **Sync Changes / Push**. Or, in a second terminal:

```bash
git status
git add index.html styles.css app.js config.js assets documents README.md .nojekyll .gitignore
git commit -m "Add JBNU presidential briefing"
git push origin main
```

These commands assume the default branch is `main`. If yours has another name, substitute it.

## 5. Publish on GitHub Pages

In the repository on GitHub:

1. **Settings → Pages**.
2. Under **Build and deployment**, set **Source → Deploy from a branch**.
3. Choose branch **main** and folder **/ (root)**.
4. Select **Save**.
5. Check the **Actions** tab for the Pages deployment result.
6. Use the published link displayed in **Settings → Pages** once deployment succeeds.

A project-repository address typically looks like:

```text
https://YOUR-USERNAME.github.io/jbnu-briefing/
```

That is an example, not an already-deployed URL. The actual address is supplied by GitHub. Relative paths beginning `./` allow the site to work under the repository subpath. Do not change them to `/assets/...` unless you intentionally change the hosting layout.

## 6. Everyday edit → preview → publish

1. Open the existing Codespace, rather than creating a new one each time.
2. Edit a file, save and refresh your development preview.
3. Review your changes in Source Control.
4. Commit and push to `main`.
5. Wait for the Pages deployment to succeed, then refresh the public site.

Saving in Codespaces alone does not update the public website. Pushing to the configured branch triggers publication. A Codespaces preview address is not the permanent link to send to the President. Stop the Codespace when not using it.

## Where to edit

### Slide text

Open `index.html`. Search for the `SLIDE 1` through `SLIDE 5` comments or a distinctive sentence. Change the text between tags without changing IDs such as `s1`, `title1`, `productImage` or `documentsButton`; JavaScript uses those IDs.

```html
<h1 id="title1">
  Continuing My<br>
  <span>Contribution</span><br>
  at JBNU
</h1>
```

Edit the section's `data-title` attribute too if you want a different Contents menu label. The content of each screen is not fetched from config.js: the main slide copy lives in index.html.

### Color and type

Open `styles.css`. At the top, `:root` defines:

```css
--ink: #1d312c;
--muted: #4c655d;
--accent: #246b52;
--line: #dbe5df;
--wash: #f2f6f3;
```

Find `h1`, `h2`, `.lead` and `.slide` to adjust heading sizes, paragraph sizes and spacing. Phone overrides are inside `@media(max-width:700px)`. Desktop slide mode uses a 1600 × 900 design canvas scaled to the viewport; phone reading mode reflows the content. System fonts are used, so exact letter shapes can differ slightly across operating systems. There are no remote fonts or external JavaScript dependencies.

### Photographs and screenshots

Replace the relevant image in `assets/images/`, keeping the same filename, or change its path in index.html. Product-switcher image paths also appear in config.js. Keep both references consistent. Cropping is controlled by `.portrait`, `.photo` and `.product-image` in styles.css. Update alt text if the image's meaning changes.

### Supporting documents

In config.js, each document has a `url`, download `filename`, title and a list of preview image paths. A relative URL example is:

```javascript
url: "./documents/Ambassador_Letter_C121_2026.pdf"
```

Replace PDFs in documents/ or update the paths. IMPORTANT: previews are separate JPEG files, not live PDF rendering. Replacing a PDF does not update its previews. Replace the corresponding preview images in assets/previews/ and update the preview list if the page count changes. Preserve the original signed document rather than editing it.

### Updating the downloadable briefing PDF

The included briefing PDF is a snapshot, not a live export of the HTML. Editing text or styles does NOT automatically change it. For small changes, use browser Print → Save as PDF; landscape, background graphics on, headers/footers off. Browser paper-size handling varies, so inspect all five pages before publishing a replacement. Browser printing does not retain the supporting files embedded in the supplied PDF. For exact slide-sized PDF regeneration and embedded attachments, request a regenerated PDF after finalizing the HTML.

### Animation and behavior

In styles.css, look for `@keyframes enter`, `.slide.active.enter`, `.btn` transitions and the reduced-motion rule. In app.js, `automaticMode()` chooses the initial device layout, `go()` changes slides, `viewDoc()` opens a document preview and `product()` changes the screenshot. No backend is involved.

## Known limits

- No public website has been deployed for you; follow the steps above to deploy it yourself.
- The first version does not include a verified platform URL or email address. No such links were invented.
- The original usage figure remains dated; replace it only with supported data.
- PDF preview JPEGs, document PDFs and HTML text must be kept in sync manually.
- A PDF download can open in the built-in viewer rather than save immediately on some mobile browsers.
- The app expects exactly five screens in its navigation calculations. Adding/removing screens requires updating app.js, not only index.html.
- This is a static presentation, not a login-protected document portal.

## Official GitHub references

- Pages publishing source: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Codespaces preview ports: https://docs.github.com/en/codespaces/developing-in-a-codespace/forwarding-ports-in-your-codespace
