import { bars, list, table } from './cards.js';

// Work. Counts come from the Diesel Monitor's public snapshot (Nov 5, 2026): 348 selected orders. The per-gallon tax medians were computed for this lesson from that snapshot.
// Rates: federal diesel excise 24.4 cents per gallon (EIA, Jan 2026); Ohio state diesel tax 47 cents per gallon standard, with a state motor fuel tax holiday from Oct 4, 2026 to Jan 2, 2027 (Ohio Department of Taxation).
const KINDS = [['Diesel fuel (tank wagon / transport)', 349, '#2a9d8f'], ['Tax lines', 348, '#7c63d0'], ['Other lines (biodiesel, winterizer)', 279, '#e8a33a']];
const TAXKIND = [['Biodiesel taxes line', 202], ['Diesel taxes line', 146]];
const OTHER = [['Biodiesel tank wagon', 189], ['Biodiesel winterizer', 52], ['Diesel winterizer', 23], ['Biodiesel transport', 15]];
const PRE = { n: 134, med: 0.375 }, POST = { n: 12, med: 0.026 };

export default {
  id: 'dmlines', group: 'work', track: 'work', title: 'What Is on a Purchase Order: Taxes, Blends, Add-ons', icon: 'receipt', time: 11, level: 'Intermediate',
  tagline: 'The lines that sit around the diesel line on the Monitor’s 348 orders: tax, biodiesel and winterizer, the 2026 Ohio tax holiday, and why dollars per diesel gallon is a trap.',
  stats: [
    { id: 'f', label: 'Diesel lines', icon: 'droplet' }, { id: 't', label: 'Tax lines', icon: 'receipt' },
    { id: 'o', label: 'Other lines', icon: 'file' }, { id: 'h', label: 'Median tax ¢/gal before', icon: 'gauge' },
  ],
  legend: [['#2a9d8f', 'diesel'], ['#7c63d0', 'tax'], ['#e8a33a', 'blend / add-on']],
  learn: [
    { t: 'What kinds of lines a fuel purchase order carries', at: 0 }, { t: 'How tax lines are recorded on the Monitor’s orders', at: 1 },
    { t: 'What biodiesel and winterizer lines are', at: 2 }, { t: 'Why a tax-per-gallon ratio mixes definitions', at: 3 },
    { t: 'What the Ohio tax holiday means for the data', at: 4 }, { t: 'What an analyst does when a rule changes mid-series', at: 5 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    s.box('d', 0.8, 1.2, 0, 2.2, 2.2, 1.4, 'teal', { label: { t: 'diesel line', icon: 'droplet' } });
    s.box('t', 4.0, 1.2, 0, 1.8, 2.2, 0.9, 'violet', { from: 1, label: { t: 'tax line', icon: 'receipt' } });
    s.box('o', 7.0, 1.2, 0, 1.6, 2.2, 0.7, 'yellow', { from: 2, label: { t: 'add-on lines', icon: 'file' } });
    s.box('r', 4.0, 5.6, 0, 2.6, 1.8, 0.9, 'white', { from: 3, label: { t: 'ratio trap', icon: 'flag' } });
    s.box('h', 7.2, 6.0, 0, 1.6, 1.6, 0.8, 'red', { from: 4, label: { t: 'Oct 4, 2026', icon: 'clock' } });
    s.flow('f1', [[3.0, 2.3, 0.05], [4.0, 2.3, 0.05]], 'invoice', { from: 1 });
    s.flow('f2', [[5.8, 2.3, 0.05], [7.0, 2.3, 0.05]], 'invoice', { from: 2 });
    s.card('k', 'LINES ON 348 ORDERS', bars(KINDS.map(([label, value, color]) => ({ label: label.split(' (')[0], value, color })), { w: 300, labelW: 74, max: 400, y0: 34, h: 16, gap: 12, fmt: (v) => `${v}`, note: 'every order carries one tax line' }), { w: 300, h: 150, from: 0, until: 0 });
    s.card('tx', 'TAX LINES BY KIND', bars(TAXKIND.map(([label, value]) => ({ label: label.replace(' taxes line', ''), value, color: '#7c63d0' })), { w: 300, labelW: 74, max: 240, y0: 36, h: 18, gap: 12, fmt: (v) => `${v}`, note: 'quantity equals dollars on a tax line' }), { w: 300, h: 130, from: 1, until: 1 });
    s.card('ad', 'ADD-ON LINES', bars(OTHER.map(([label, value]) => ({ label: label.replace('Biodiesel ', 'Bio ').replace('Diesel ', 'Dsl '), value, color: '#e8a33a' })), { w: 300, labelW: 96, max: 200, y0: 34, h: 16, gap: 10, fmt: (v) => `${v}`, note: '279 lines in all' }), { w: 300, h: 160, from: 2, until: 2 });
    s.card('tr', 'WHY THE RATIO MISLEADS', list([['Numerator', 'tax on diesel or biodiesel line'], ['Denominator', 'diesel tank-wagon gallons only'], ['Result', 'not a statutory rate']], { gap: 36 }), { w: 300, h: 140, from: 3, until: 3 });
    s.card('ho', 'TAX RATES (public)', table(['', 'cents / gal'], [['Federal diesel', '24.4'], ['Ohio diesel, standard', '47.0'], ['Ohio, Oct 4 - Jan 2', 'near 0'], ['Median in data before', `${(PRE.med * 100).toFixed(1)}`], ['Median in data on Oct 26', `${(POST.med * 100).toFixed(1)}`]], { cols: [12, 200], y0: 34, rowH: 22, W: 292 }), { w: 300, h: 168, from: 4, until: 4 });
    s.card('ru', 'WHEN A RULE CHANGES', list([['Flag it', 'mark the boundary date'], ['Compare in-period', 'not across it'], ['Say what is unknown', 'how the line is built']], { gap: 36 }), { w: 300, h: 140, from: 5, until: 5 });
  },
  steps: [
    { short: 'Lines', tag: 'DATA', title: 'An order is more than its diesel line', focus: ['d', 'k'], flows: [],
      body: ['Each purchase order in the public records has several lines. Across the 348 selected orders, the Monitor classifies 349 main diesel lines (one order has two), 348 tax lines (exactly one per order) and 279 other lines. Only the diesel lines feed the gallon count.', 'Classifying lines by kind is the first transform step: it decides what counts as volume and what counts as money.'], stats: { f: '349', t: '348', o: '279' } },
    { short: 'Tax', tag: 'DATA', title: 'Tax shows up as a separate dollar line', focus: ['d', 't', 'tx'], flows: ['f1'],
      body: ['The tax line is labelled either “Biodiesel Taxes” (202 orders) or “Diesel Taxes” (146 orders). On these lines the quantity equals the dollar amount, so the line records dollars, not gallons.', 'Federal excise tax on diesel is 24.4 cents per gallon (U.S. Energy Information Administration, January 2026), and states add their own. The public order lines do not break the tax line into those parts.'] },
    { short: 'Blends', tag: 'CONCEPT', title: 'Biodiesel and winterizer lines', focus: ['t', 'o', 'ad'], flows: ['f2'],
      body: ['Many orders also carry biodiesel lines (a blend component, listed as tank wagon, transport or winterizer) and winterizer lines for diesel. Biodiesel tank-wagon lines appear on 189 orders, winterizer lines on 75 (52 biodiesel, 23 diesel) and biodiesel transport lines on 15.', 'A winterizer is a cold-weather additive. The Monitor keeps these lines visible on each order but out of the diesel-gallon figure, which is why the order total is larger than the diesel fuel dollars alone.'],
      callout: { k: 'know', t: 'Whole-order totals include tax and add-ons. They are not diesel revenue, and the Monitor says so wherever it shows them.' } },
    { short: 'Ratio', tag: 'PROBLEM', title: 'Dollars per diesel gallon is a trap', focus: ['r', 'tr'], flows: [],
      body: ['It is tempting to divide an order’s tax by its gallons to get a rate. But the tax can belong to the biodiesel or the diesel line, while the gallons count only diesel tank-wagon and transport lines, so the ratio mixes two definitions.', 'For example, PO585255 shows $399.00 of tax on 503 diesel units, about 79 cents a gallon. Federal 24.4 plus Ohio’s standard 47 cents would be 71.4 cents, and the public records do not explain the difference, so the Monitor reports the amount as recorded and does not guess.'],
      callout: { k: 'warn', t: 'A ratio that looks like a rate is not one until numerator and denominator describe the same thing.' } },
    { short: 'Holiday', tag: 'NUMBERS', title: 'A rate change inside the data window', focus: ['h', 'ho'], flows: [],
      body: [`Ohio’s state motor fuel tax, normally 47 cents a gallon on diesel, was set to drop to almost nothing from October 4, 2026 through January 2, 2027 (Ohio Department of Taxation). Only 17 of the 348 orders are listed on or after October 4, all on October 26.`, `Among orders with a diesel tax line, the median tax per diesel gallon is ${(PRE.med * 100).toFixed(1)} cents for ${PRE.n} orders before October 4 and ${(POST.med * 100).toFixed(1)} cents for ${POST.n} orders on October 26. The direction fits a rate change, but the lines are not documented well enough to prove it, and these medians were computed for this lesson, not published on the Monitor.`],
      stats: { h: `${(PRE.med * 100).toFixed(1)}` } },
    { short: 'Rule', tag: 'METHOD', title: 'What to do when a rule changes mid-series', focus: ['h', 'ru'], flows: [],
      body: ['Mark the boundary date in the data, compare like with like on each side of it, and write down what you do not know. A tax holiday, a new product spec or a changed contract term all behave the same way in a time series.', 'This is the “definitions” and “timing” break from the Where Records Break lesson, shown on real records.'],
      callout: { k: 'key', t: 'Before you chart a trend, ask what changed on the calendar. The answer is often outside the data.' } },
  ],
};
