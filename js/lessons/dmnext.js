import { bars, list, table, code } from './cards.js';
import { SNAP, UNMATCHED, LAG, fmt0 } from './dmdata.js';

// Work. Ideas for extending the Columbus Diesel Order Monitor if it were pointed at a fuel seller's own order data. These are PROPOSALS by the project's author,
// not descriptions of any company's systems. The KPI values are the Monitor's real public-snapshot figures; the price check uses invented numbers.
const unGal = UNMATCHED.reduce((a, r) => a + r[2], 0);
const matchRate = (SNAP.matched / SNAP.orders) * 100, folRate = (SNAP.unmatched / SNAP.orders) * 100, folGal = (unGal / SNAP.gallons) * 100;
const IDX = 2.4, ADD = 0.06, LOADED = 7998, BILLED = 19680, expected = LOADED * (IDX + ADD);

export default {
  id: 'dmnext', group: 'work', track: 'work', title: 'From Columbus Diesel to a Seller’s Desk', icon: 'sparkle', time: 11, level: 'Advanced',
  tagline: 'What the Monitor could not verify is exactly what a seller’s own data would add. A proposed next version, and how to explain the project in plain words.',
  stats: [
    { id: 'mr', label: 'Match rate (real)', icon: 'check' }, { id: 'lag', label: 'Median lag (real)', icon: 'clock' },
    { id: 'fol', label: 'Follow-up share', icon: 'flag' }, { id: 'gap', label: 'Price check gap (invented)', icon: 'scale' },
  ],
  legend: [['#b8c940', 'public data'], ['#7c63d0', 'proposed data'], ['#2a9d8f', 'check']],
  learn: [
    { t: 'How the buyer’s chain differs from the seller’s', at: 0 }, { t: 'Which Monitor limits a seller’s data would remove', at: 1 },
    { t: 'How ordered versus loaded volume would be checked', at: 2 }, { t: 'How a unit-price check against an index would work', at: 3 },
    { t: 'Which KPIs the Monitor already supports', at: 4 }, { t: 'How the Monitor would become a refreshed Power BI model', at: 5 },
    { t: 'How to explain the project in plain words', at: 6 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    s.box('mon', 0.6, 1.0, 0, 2.2, 1.8, 1.0, 'green', { label: { t: 'Monitor today', icon: 'search' } });
    s.box('bol', 4.0, 0.8, 0, 1.6, 1.6, 0.8, 'violet', { from: 1, label: { t: 'loading tickets', icon: 'truck' } });
    s.box('idx', 6.8, 1.4, 0, 1.6, 1.6, 0.8, 'violet', { from: 1, label: { t: 'rack index', icon: 'chart' } });
    s.box('pbi', 3.6, 5.4, 0, 2.6, 2.0, 1.2, 'white', { from: 5, label: { t: 'Power BI model', icon: 'layers' } });
    s.box('chk', 7.0, 6.2, 0, 1.6, 1.4, 0.8, 'teal', { from: 2, label: { t: 'checks', icon: 'check' } });
    s.flow('f1', [[2.8, 2.0, 0.05], [4.0, 1.6, 0.05]], 'order', { from: 1 });
    s.flow('f2', [[5.6, 1.6, 0.05], [6.8, 2.0, 0.05]], 'data', { from: 3 });
    s.flow('f3', [[7.4, 3.0, 0.05], [7.6, 6.2, 0.05]], 'invoice', { from: 2 });
    s.flow('f4', [[2.0, 3.0, 0.05], [3.6, 6.0, 0.05]], 'data', { from: 5 });
    s.card('side', 'TWO SIDES OF ONE CHAIN', table(['', 'buyer (Monitor)', 'seller'], [['starts', 'purchase order', 'customer order'], ['middle', 'delivery unseen', 'loading ticket'], ['price', 'index unseen', 'index + adder'], ['ends', 'invoice, ledger', 'invoice, cash']], { cols: [12, 70, 190], y0: 34, rowH: 22, W: 292 }), { w: 300, h: 148, from: 0, until: 0 });
    s.card('lim', 'LIMIT → DATA THAT REMOVES IT', list([['No delivered gallons', 'loading tickets'], ['No daily index', 'rack benchmark'], ['No scanned invoice', 'billing system']], { gap: 36 }), { w: 300, h: 140, from: 1, until: 1 });
    s.card('vol', 'ORDERED vs LOADED CHECK', code([`ordered  gallons per order`, `loaded   gallons per ticket`, ``, `flag when |loaded - ordered|`, `  exceeds a stated tolerance`, ``, `report by terminal and product`], { y0: 38, gap: 15 }), { w: 300, h: 140, from: 2, until: 2 });
    s.card('px', 'UNIT PRICE CHECK (invented)', code([`expected = loaded x (index + adder)`, `         = ${LOADED} x (${IDX.toFixed(2)} + ${ADD.toFixed(2)}) = ${expected.toFixed(2)}`, `billed   = ${BILLED.toFixed(2)}`, `gap      = ${(BILLED - expected).toFixed(2)}`], { y0: 40, gap: 17 }), { w: 300, h: 120, from: 3, until: 3 });
    s.card('kpi', 'KPIs THE MONITOR ALREADY SUPPORTS', bars([
      { label: 'matched %', value: matchRate, color: '#2a9d8f' }, { label: 'follow-up % orders', value: folRate, color: '#e5534b' }, { label: 'follow-up % gallons', value: folGal, color: '#e5534b' },
    ], { w: 300, labelW: 104, max: 100, y0: 36, h: 16, gap: 10, fmt: (v) => `${v.toFixed(1)}%`, note: `public snapshot, ${SNAP.asOf}` }), { w: 300, h: 140, from: 4, until: 4 });
    s.card('pbi', 'POWER BI SKETCH', code([`fact_order   grain: one order`, `dim_date     cohort month`, `dim_mode     tank wagon / transport`, `dim_status   matched / follow-up`, ``, `measures: Match Rate, Follow-ups,`, `  Ordered Gallons, Median Lag`], { y0: 38, gap: 14 }), { w: 300, h: 150, from: 5, until: 5 });
    s.card('say', 'SIXTY-SECOND VERSION', list([['What', 'trace each diesel order to an invoice'], ['How', 'join three public files by their keys'], ['Result', `${SNAP.matched} of ${SNAP.orders} matched; ${SNAP.unmatched} to follow up`], ['Limit', 'no delivery or price proof']], { gap: 31 }), { w: 300, h: 160, from: 6, until: 6 });
  },
  steps: [
    { short: 'Two sides', tag: 'ROLE', title: 'The buyer’s chain and the seller’s chain', focus: ['mon', 'side'], flows: [],
      body: ['The Monitor follows a buyer’s records: a purchase order, an invoice and the ledger lines that record it. A seller’s marketing operations team sees the same transaction from the other side: a customer order, a loading ticket, an invoice and cash.', 'The matching logic transfers directly. The data available is richer on the seller’s side.'],
      callout: { k: 'know', t: 'Everything on this page from here on is a proposal by the project’s author. It does not describe how any company works internally.' } },
    { short: 'Limits', tag: 'CASE', title: 'Each Monitor limit points to a data source', focus: ['mon', 'bol', 'idx', 'lim'], flows: ['f1'],
      body: ['The Monitor lists what it cannot verify: delivered gallons, a daily unit price index and scanned invoices. A seller’s system holds loading records, can reference a rack benchmark for the contract price, and holds the invoices themselves.', 'Treating limits as a to-do list is a useful habit: each “cannot verify” is an extension waiting for data.'] },
    { short: 'Volume', tag: 'METHOD', title: 'Extension A: ordered versus loaded volume', focus: ['mon', 'bol', 'chk', 'vol'], flows: ['f3'],
      body: ['With loading tickets, the quantity in the Monitor’s ordered-gallons figure could be compared to what actually loaded. A stated tolerance would flag only meaningful differences, reported by terminal and product.', 'This replaces the Monitor’s inferred gallons with measured ones.'], stats: { mr: `${matchRate.toFixed(1)}%` } },
    { short: 'Price', tag: 'NUMBERS', title: 'Extension B: check the unit price', focus: ['idx', 'chk', 'px'], flows: ['f2', 'f3'],
      body: [`If the contract says index plus an adder, the expected invoice is the loaded gallons times that price. With invented numbers, ${LOADED} gallons at $${(IDX + ADD).toFixed(2)} is ${expected.toFixed(2)}, against a billed ${BILLED.toFixed(2)}, a gap of ${(BILLED - expected).toFixed(2)}.`, 'The gap would be reviewed against the same $25-style threshold, in both directions, and noted as a flag rather than as an accusation.'],
      callout: { k: 'warn', t: 'The prices here are invented. The point is the structure of the check, not the numbers.' }, stats: { gap: `${(BILLED - expected).toFixed(2)}` } },
    { short: 'KPIs', tag: 'NUMBERS', title: 'The KPIs the Monitor already supports', focus: ['mon', 'kpi'], flows: [],
      body: [`From the public snapshot: ${matchRate.toFixed(1)}% of orders matched, ${folRate.toFixed(1)}% of orders and ${folGal.toFixed(1)}% of gallons are follow-ups, and the median days from listed date to invoice is ${LAG.median}. These are real values and match the definitions in the KPI lesson.`, `Add unbilled gallons (${fmt0(unGal)} here) and a by-month view and the core of an operations dashboard already exists.`], stats: { lag: `${LAG.median}`, fol: `${folRate.toFixed(1)}%` } },
    { short: 'Power BI', tag: 'METHOD', title: 'Extension C: a refreshed, shareable model', focus: ['mon', 'pbi'], flows: ['f4'],
      body: ['The build script already regenerates the data from the public files. A Power BI version would load that output into a small star schema, one fact row per order with date, mode and status dimensions, and define the measures once so every visual agrees.', 'A scheduled refresh and an “as of” stamp turn the one-off snapshot into a report that stays current and honest about its age.'] },
    { short: 'Plain words', tag: 'ROLE', title: 'Explaining the project in sixty seconds', focus: ['mon', 'say'], flows: [],
      body: [`“I took a city’s public diesel purchasing records and traced each order to its invoice by joining three exports on their published keys. ${SNAP.matched} of ${SNAP.orders} orders have a posted invoice; ${SNAP.unmatched} are flagged for follow-up. Flags mean check the record, not billing error, and the project is clear about what it cannot prove.”`, 'The structure is: what you did, how, what you found, and what you did not claim. It works for any analysis.'],
      callout: { k: 'key', t: 'Always finish with the limit. It is what makes the rest believable.' } },
  ],
};
