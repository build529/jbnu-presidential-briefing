# JBNU Presidential Briefing — revised five-screen edition

This is the COMPLETE replacement source project: editable HTML/CSS/JavaScript, analytics data, photographs, letter previews, original Ambassador's Letter and a regenerated five-page PDF. No application backend or build is required to view or publish it.

## Replace your current Codespaces files

1. Commit or download a backup of your current repository FIRST. This package is based on the project shared in our chat; it cannot contain unshared changes in your Codespace.
2. Unzip this package. Open its `jbnu-briefing` folder.
3. Upload that folder's CONTENTS into your existing repository root, replacing matching files. Keep your repository's `.git` folder and GitHub settings intact. `index.html` must remain at the root.
4. Remove the obsolete files listed below from the repository if present. Merely uploading a new folder does not delete old files.
5. Preview, review your actual usage data, commit, and push. Your existing Pages deployment settings can stay unchanged.

### Obsolete files to remove

- `documents/Continuing_My_Contribution_Original.pdf`
- `assets/previews/full-01.jpg` through `full-09.jpg`
- `assets/images/meal.jpg` (the screenshot switcher is removed)
- Any old standalone 33 MB `JBNU_Presidential_Briefing.html` you previously uploaded.
- Old `brief_template.html`, if used as an extra file rather than your entry page.

The full presentation is intentionally no longer linked OR included in this package. Deleting a file from the current branch does not erase earlier Git history.

## Before sending: update or confirm the usage data

The package uses the exact weekly averages previously supplied in our professor-presentation discussion:

| Academic week | Monday–Friday dates (2026) | Average daily users |
|---|---|---:|
| Week 07 | 12–16 October | 331 |
| Week 08 | 19–23 October | 340 |
| Week 09 | 26–30 October | 381 |
| Week 10 | 02–06 November | 396 |
| Week 11 | 09–13 November | 407 |

Week 09's end date was normalized to Friday 30 October in the earlier discussion; recheck it against your records. These are HISTORICAL records, not a claim of current usage. The slide explicitly says 'LATEST RECORDED WEEK' and gives the dates. The approximate '420–430' and '307' were NOT inserted as final figures. Please replace/add exact later weekly records before sending if you want the latest actual week displayed.

Edit `analytics.js`: oldest to newest. Each `average` is an average daily count for the stated five weekdays, NOT a weekly total or weekly unique-user count. The final entry drives the circle. Update `periodLabel` to match the entire range. Keep `latestLabel: "LATEST RECORDED WEEK"` to avoid ambiguous wording. `isCurrent` only controls the historical disclaimer; it does not verify or fetch data. Do not set it true unless appropriate. No values are fetched automatically.

Example SHAPE (use real values, not arbitrary examples):

```javascript
{
  "label": "Week 11",
  "dates": "09–13 Nov",
  "fullDates": "09–13 Nov 2026",
  "average": 407
}
```

Keep quotes around property names and strings: the PDF builder reads this as JSON. Refreshing the browser updates the interactive chart/circle after data edits. Then run the builder below to update the static chart, HTML fallback and PDF as well. If you skip that step, the no-network/printed chart and downloadable PDF can be out of date.

## Files to edit

```text
index.html          All five screens' wording and structure
styles.css          Blue/magenta palette, typography, fixed laptop and reading layouts
app.js              Navigation, reading mode, dialogs, chart animation
analytics.js        Weekly averages and date/source labels
config.js           Supporting document paths and previews
assets/images/      Portrait, cooperation photos, one static website screenshot
assets/previews/    Ambassador's Letter preview images
assets/usage-chart.png  Generated static chart
documents/          Signed letter and current five-page PDF
build_pdf.py        Regenerate static chart, HTML fallback and PDF
requirements.txt    Optional PDF/chart-builder dependencies
.nojekyll           Serve as plain static files on GitHub Pages
```

The palette is JBNU-inspired, not represented as a certified university identity specification. White #FFFFFF; blue #003B71; magenta #A61970; dark text #172B46. The single-series chart uses accessible blue #1751D0.

## What changed

1. Larger portrait, more formal recipients, three clear opening messages and scholarship emphasis. Introductory paragraph removed.
2. Weekly bars and latest-recorded-week circle; one static website image; no screenshot tabs; Multi-LLM paragraph removed.
3. Taller, uncropped cooperation photographs. Updated academic/business and cultural-cooperation descriptions. Embassy letter remains accessible.
4. Broader learning-by-building direction: engineering, applied AI, languages, community projects, industry links and Peru–Korea relationships.
5. Application already submitted; regular admission process acknowledged; tuition and living support emphasized; timely financial clarification requested. No document buttons inside the last slide.

## Preview in YOUR Codespace

In the repository terminal:

```bash
python3 -m http.server 8000
```

Open Ports → 8000 → Open in Browser. Keep this development port private. Stop the server with Ctrl+C when finished. Save changes and refresh; this simple preview does not auto-refresh.

### Layout and animation

- Laptop: 1600 × 900 design canvas, proportionally scaled to the window.
- Portrait phone / narrow viewport: readable, vertically reflowed sections.
- 'Read view' / 'Slide view' lets the reader switch manually.
- Bars animate on entering screen 2. The circle outline draws without implying a percentage or funding target. The number is immediately readable; no counting-up gimmick.
- Reduced-motion preferences disable these effects.
- The only optional external script is pinned Chart.js 4.4.8 from jsDelivr. Without network access, the generated static chart remains visible; the rest of the site remains local. Online animated charts use that CDN. Images and PDFs have relative local paths.
- The signed letter is previewed as two local JPEGs, with separate open/download actions for the original unmodified PDF.

## Rebuild the PDF after edits

For normal publishing, skip this if you have changed nothing. The included PDF is already regenerated.

For revised text, colors or statistics, in a separate Codespaces terminal:

```bash
python3 -m pip install -r requirements.txt
python3 build_pdf.py
```

This rebuilds:
- `assets/usage-chart.png`
- Static analytics values/alt text in `index.html`
- `documents/JBNU_Presidential_Briefing.pdf`

It uses the actual HTML content and desktop typography, not a separate copy of the slide wording. This keeps subsequent text edits in sync. It does not modify the signed letter. WeasyPrint requires system rendering libraries; if your Codespace reports a missing-library error, follow that error's installation guidance or ask for help. No PDF generation happens on GitHub Pages itself.

The builder checks for five pages and off-page text. It cannot guarantee absence of every overlap after arbitrary edits: inspect the PDF after rebuilding. The PDF is a static version: no animation, controls, or embedded document attachments. The Ambassador's Letter remains a separate file on the site.

## Publish / update GitHub Pages

For an existing Pages site: review changed/deleted files in Source Control → Commit → Push / Sync Changes. Saving locally is not publishing. Check GitHub Actions for a successful Pages deployment, then refresh the public link.

For a new repository: Settings → Pages → Deploy from a branch → main → / (root) → Save. Use the address GitHub shows. Keep all paths relative (`./assets/...`) for repository subpaths. Stop the Codespace when not editing.

Official guides:
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/codespaces/developing-in-a-codespace/forwarding-ports-in-your-codespace

## Privacy before publication

GitHub Pages makes files publicly accessible. This includes the signed Ambassador's Letter. Only publish it and the photographs if you have permission and are comfortable with public access. The noindex/nofollow tag requests search engines not to index the site; it is NOT password protection. A private source repository does not automatically make its Pages website private. No passports, bank statements or immigration records belong in this repository.

## Final pre-send checklist

- Confirm exact latest weekly averages and dates; regenerate PDF/static chart if you change them.
- Confirm recipients' names/titles and your preferred major spelling.
- Review all five screens on a laptop and a phone (or narrow browser window).
- Check the enlarged portrait and tall cooperation photos.
- Open slide 2 and check bars, ring and source labels; test with the network disabled to check fallback.
- Open/close the letter dialog; open and download the original PDF.
- Check Contents navigation, arrows, keyboard navigation and Read/Slide switching.
- Download the briefing and inspect all five PDF pages.
- Test the DEPLOYED link, not just your Codespaces preview.

Verification performed for this revision: JavaScript syntax, unique IDs, local file paths, five-page PDF generation, and PDF layout review. Browser interactions have NOT been executed in a live browser here; finish the checks above before sending.
