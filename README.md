# FUEL / EXPLAINED

An interactive, plain-English guide to how crude oil becomes fuel, how fuel is moved and priced, how a fuel seller's orders turn into invoices, and how an analyst checks that chain with SQL and Power BI.

It is the sister site of GRID / EXPLAINED and uses the same template: isometric scenes, a step-by-step stepper, a Knowledge Check, a lesson menu, search (Cmd/Ctrl + K) and light and dark themes. The colour is deep burgundy instead of green.

## Two tracks

- **Core** (lessons 01 to 04, 15 lessons): general concepts such as crude in and products out, crack spreads, terminals, pricing, order-to-cash and SQL/DAX drills. They stand on their own.
- **Work** (group 05, 5 lessons): case studies built on my own Columbus Diesel Order Monitor. Every one carries a WORK badge. The menu has an All / Core / Work switch, and it opens on Core.

The Work lessons describe an independent portfolio project built on public City Auditor records. It is not affiliated with the City of Columbus, any fuel supplier or any employer. Its numbers are a dated snapshot (Nov 5, 2026). The invoice-lag figures were computed for the lesson from that snapshot and are not published on the Monitor. The "From Columbus Diesel to a Seller's Desk" lesson contains proposals, not facts about any company.

Dollar amounts in the Core lessons are labelled as illustrative or invented unless a source is named.

## Run it locally

There is no build step, but the site uses ES modules, so it has to be served over http (opening index.html directly will not work).

```
cd fuelexplained
python3 -m http.server 8000
```

Then open http://localhost:8000

## Add a lesson

1. Copy an existing file in `js/lessons/` and change its `id`, title, scene (`build`) and `steps`.
2. Import it at the top of `js/main.js` and add it to a group list (`BARREL`, `MOVING`, `MKTOPS`, `DESK` or `WORK`).
3. For a case study based on my own work, add `track: 'work'` so it gets the WORK badge and appears under the Work filter.

Step tags in use: CONCEPT, NUMBERS, PROBLEM, TRADE-OFF, METHOD, DATA, CASE, ROLE.

## Brand

Light burgundy and paper palette from the Grid brand system: ink `#2b1218`, topbar `#8b2f45`, dark theme `#2a0e16`, paper `#f7f1ef`, white action buttons `#ffffff`, plus the blue `#90acba` and gold `#c2a33c` accents. Fonts are DM Sans and IBM Plex Mono (loaded from Google Fonts in `index.html`).

## Put it on GitHub (done by you, in the browser)

1. On github.com, click New repository, name it (for example `fuelexplained`), keep it Public and click Create.
2. Click "uploading an existing file", unzip this folder on your computer and drag in the contents of `fuelexplained` (the `index.html` file and the `css` and `js` folders, not the zip itself).
3. Click Commit changes.
4. For a live link: Settings, then Pages, then Source "Deploy from a branch", branch `main`, folder `/ (root)`, Save. Netlify also works by dragging the folder in.

## Sources

Duke "Oil and Gas Industry Operations and Markets" course notes; U.S. EIA; CME Group; OPIS; Argus; Industrial Info; Reuters/Digital Refining; The Globe and Mail; Cenovus public pages; the City of Columbus Auditor Data Hub and the Columbus Diesel Order Monitor repository.
