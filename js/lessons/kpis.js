import { table, list, bars } from './cards.js';

// Core. All ten orders below are INVENTED; every KPI shown is computed from them in code.
const O = [
  [1, 'ULSD', 8000, 2.46, 1, 3, 19680], [2, 'ULSD', 8000, 2.48, 1, 4, 19840], [3, 'REG', 7500, 2.10, 2, 3, 15750], [4, 'REG', 8000, 2.12, 2, null, null],
  [5, 'ULSD', 6000, 2.47, 3, 6, 14820], [6, 'REG', 8000, 2.11, 4, 5, 16880], [7, 'B20', 3500, 2.80, 4, null, null], [8, 'ULSD', 8000, 2.45, 5, 8, 19600],
  [9, 'REG', 7800, 2.13, 6, 7, 16620], [10, 'ULSD', 8000, 2.46, 6, 9, 19710],
];
const matched = O.filter((o) => o[6] != null), unb = O.filter((o) => o[6] == null);
const matchRate = (matched.length / O.length) * 100;
const lag = matched.reduce((a, o) => a + (o[5] - o[4]), 0) / matched.length;
const unbGal = unb.reduce((a, o) => a + o[2], 0);
const diffs = matched.map((o) => o[6] - o[2] * o[3]);
const over = diffs.filter((d) => Math.abs(d) >= 25).length, small = diffs.filter((d) => d !== 0 && Math.abs(d) < 25).length;
const ul = O.filter((o) => o[1] === 'ULSD'), wavg = ul.reduce((a, o) => a + o[2] * o[3], 0) / ul.reduce((a, o) => a + o[2], 0), savg = ul.reduce((a, o) => a + o[3], 0) / ul.length;
const byProd = ['ULSD', 'REG', 'B20'].map((p) => [p, O.filter((o) => o[1] === p).reduce((a, o) => a + o[2], 0)]);

export default {
  id: 'kpis', group: 'mktops', title: 'KPIs for Order Data', icon: 'gauge', time: 10, level: 'Intermediate',
  tagline: 'Six measures a marketing operations analyst is likely to be asked for, each defined, computed on a ten-order sample and paired with its trap.',
  stats: [
    { id: 'match', label: 'Match rate', icon: 'check' }, { id: 'lag', label: 'Invoice lag (days)', icon: 'clock' },
    { id: 'unb', label: 'Unbilled gallons', icon: 'droplet' }, { id: 'rev', label: 'Review flags (≥$25)', icon: 'flag' },
  ],
  legend: [['#b8c940', 'orders'], ['#2a9d8f', 'matched'], ['#e5534b', 'follow-up']],
  learn: [
    { t: 'What makes a KPI well defined', at: 0 }, { t: 'How to compute an order-to-invoice match rate', at: 1 },
    { t: 'How to measure invoice lag', at: 2 }, { t: 'Why volume-weighted price beats a simple average', at: 3 },
    { t: 'What unbilled volume tells you', at: 4 }, { t: 'How to count exceptions with a threshold', at: 5 },
  ],
  build(s) {
    s.floor(10, 10, 'cream');
    O.forEach((o, i) => s.box('o' + i, 0.8 + (i % 5) * 1.7, 1.0 + Math.floor(i / 5) * 2.4, 0, 1.2, 1.2, 0.8 + (o[2] / 8000) * 0.5, o[6] == null ? 'red' : 'teal', { from: 0, k: 20 + i }));
    s.box('sum', 3.8, 6.4, 0, 2.4, 1.6, 1.0, 'white', { from: 0, label: { t: '10 sample orders', icon: 'file' } });
    s.card('t', 'THE SAMPLE (invented)', table(['id', 'prod', 'gal', '$/gal', 'inv'], O.map((o) => [`${o[0]}`, o[1], `${o[2]}`, o[3].toFixed(2), o[6] == null ? '-' : `${o[6]}`]), { cols: [12, 40, 82, 128, 176], y0: 30, rowH: 12.5, W: 292 }), { w: 300, h: 190, from: 0, until: 0 });
    s.card('m', 'MATCH RATE', list([['Matched', `${matched.length} orders`], ['Follow-up', `${unb.length} orders`], ['Rate', `${matched.length}/${O.length} = ${matchRate.toFixed(0)}%`]], { gap: 34 }), { w: 300, h: 132, from: 1, until: 1 });
    s.card('l', 'INVOICE LAG', list([['Per order', 'invoice day - load day'], ['Average', `${lag.toFixed(2)} days`], ['Trap', 'unmatched have no lag']], { gap: 34 }), { w: 300, h: 132, from: 2, until: 2 });
    s.card('p', 'ULSD PRICE', bars([{ label: 'simple avg', value: savg, color: '#bfbfb2' }, { label: 'volume weighted', value: wavg, color: '#2a9d8f' }], { w: 300, labelW: 100, max: 3, y0: 38, h: 18, gap: 12, fmt: (v) => `$${v.toFixed(3)}`, note: `${ul.length} ULSD orders; weights are gallons` }), { w: 300, h: 130, from: 3, until: 3 });
    s.card('u', 'UNBILLED VOLUME', bars(byProd.map(([label, value]) => ({ label, value, color: '#e8a33a' })), { w: 300, labelW: 70, max: 40000, y0: 36, h: 16, gap: 10, fmt: (v) => `${(v / 1000).toFixed(1)}k`, note: `${unbGal} gal ordered with no invoice yet` }), { w: 300, h: 140, from: 4, until: 4 });
    s.card('v', 'EXCEPTIONS', list([['Rule', 'flag if |invoice - order $| >= 25'], ['Flagged', `${over} order`], ['Small gaps', `${small} shown, not flagged`]], { gap: 34 }), { w: 300, h: 132, from: 5, until: 5 });
  },
  steps: [
    { short: 'Define', tag: 'METHOD', title: 'A KPI is a definition, not a number', focus: ['sum', 't'], flows: [],
      body: ['A well-defined KPI states its grain (one row per what), its numerator and denominator, the filter, and the date field. “Match rate” means little until you say which orders are in the denominator and which invoices count.', 'The next steps compute six KPIs from a ten-order invented sample, so you can check the arithmetic by hand.'], stats: {} },
    { short: 'Match rate', tag: 'NUMBERS', title: 'Order-to-invoice match rate', focus: ['sum', 'm'], flows: [],
      body: [`${matched.length} of ${O.length} orders have an invoice, a match rate of ${matchRate.toFixed(0)}%. The ${unb.length} others are follow-ups, not failures: an invoice may post in a later period.`, 'Report the count beside the rate. Four out of five and 800 out of 1,000 are the same percent but very different confidence.'], stats: { match: `${matchRate.toFixed(0)}%` } },
    { short: 'Invoice lag', tag: 'NUMBERS', title: 'Days from loading to invoice', focus: ['sum', 'l'], flows: [],
      body: [`Subtract the load day from the invoice day for each matched order. The average is ${lag.toFixed(2)} days in the sample.`, 'Only matched orders have a lag, so an average can look healthy while many orders are still waiting. Pair lag with the count of open orders.'], stats: { lag: lag.toFixed(1) } },
    { short: 'Weighted price', tag: 'NUMBERS', title: 'Average price must be weighted by gallons', focus: ['sum', 'p'], flows: [],
      body: [`The simple average of the ${ul.length} ULSD prices is $${savg.toFixed(3)}. Weighting each price by its gallons gives $${wavg.toFixed(3)}, because the 6,000-gallon order counts less than an 8,000-gallon order.`, 'Always say weighted or simple. For prices, weighted by volume is the right default.'], callout: { k: 'key', t: 'Weighted price = total dollars divided by total gallons.' } },
    { short: 'Unbilled', tag: 'NUMBERS', title: 'Volume with no invoice', focus: ['sum', 'u'], flows: [],
      body: [`Two orders, ${unb.map((o) => o[2]).join(' and ')} gallons, total ${unbGal.toLocaleString()} gallons without an invoice. Sorted by product, it shows where follow-up is concentrated.`, 'A rising unbilled balance is a revenue timing risk and an early sign of a broken join.'] },
    { short: 'Exceptions', tag: 'METHOD', title: 'Count exceptions with a stated threshold', focus: ['sum', 'v'], flows: [],
      body: [`Among matched orders, ${over} differs from order dollars by $25 or more, and ${small} has a small gap below that. The threshold is a choice; it is stated so every reader sees the same rule.`, 'Keep the small gaps visible. They are often rounding and tax, but they are also where a systematic problem first appears.'],
      callout: { k: 'know', t: 'Write each KPI on a one-page definition: name, grain, formula, filters, date field, owner and known traps.' }, stats: { unb: `${unbGal.toLocaleString()}`, rev: `${over}` } },
  ],
};
