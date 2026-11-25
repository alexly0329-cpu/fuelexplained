FUEL / EXPLAINED

An interactive, plain-English study site on refined fuel and the data work behind it. It covers the analyst's tools, how refined fuel is made, moved and priced, how orders turn into invoices, the SQL and BI skills behind the reports, and a worked case study on public diesel purchasing records.

It is the sister site of GRID / EXPLAINED and uses the same template: isometric scenes, a step-by-step stepper, a Knowledge Check, a lesson menu, search (Cmd/Ctrl + K) and light and dark themes. The colour is light burgundy with white action buttons.

The site uses public information only: no names, no inside claims.

## Menu (26 lessons)

1. **The role** (2): the data analyst role in fuel operations; The Analyst Toolbox (ETL, BI, automation)
2. **The barrel** (5): crude, quality, conversion, crack spread, the three US refineries
3. **Moving & pricing** (5): midstream, terminals and rack, price chain, supply and demand, Fuel Marketing Glossary
4. **Operations data** (4): Order to Cash, Where Records Break, KPIs for Order Data, Why Did the Number Move?
5. **Analyst desk** (4): Star Schema, Measures/Columns/Refresh, SQL Matching Drills, SQL Beyond Matching
6. **Work: Diesel Monitor** (6): the question, three files one chain, PO lines (taxes, blends, add-ons), matched/unmatched/flagged, monthly series, from Columbus diesel to a seller's desk

## Two tracks

- **Core** (groups 01 to 05, 20 lessons): general concepts such as crude in and products out, crack spreads, terminals, pricing, order-to-cash and SQL/DAX drills. They stand on their own.
- **Work** (group 06, 6 lessons): case studies built on my own Columbus Diesel Order Monitor. Every one carries a WORK badge. The menu has an All / Core / Work switch, and it opens on Core.

The Work lessons describe an independent portfolio project built on public City Auditor records. It is not affiliated with the City of Columbus, any fuel supplier or any employer. Its numbers are a dated snapshot (Nov 5, 2026). The invoice-lag figures were computed for the lesson from that snapshot and are not published on the Monitor. The "From Columbus Diesel to a Seller's Desk" lesson contains proposals, not facts about any company.

Dollar amounts in the Core lessons are labelled as illustrative or invented unless a source is named. The tax-per-gallon medians in the Work lesson on PO lines were computed for the lesson from the same snapshot.

## Run it locally

There is no build step, but the site uses ES modules, so it has to be served over http (opening index.html directly will not work).

```
cd fuelexplained
python3 -m http.server 8000
```

Then open http://localhost:8000

## Add a lesson

1. Copy an existing file in `js/lessons/` and change its `id`, title, scene (`build`) and `steps`.
2. Import it at the top of `js/main.js` and add it to a group list (`ROLE`, `BARREL`, `MOVING`, `MKTOPS`, `DESK` or `WORK`).
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
