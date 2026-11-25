import { bars, list, table } from './cards.js';
import { SNAP, UNMATCHED, LAG, fmt$, fmt0 } from './dmdata.js';

// Work. The review rules of the Columbus Diesel Order Monitor and what the 16 follow-up records look like. The invoice-lag figures are computed for this lesson from the public snapshot.
const unGal = UNMATCHED.reduce((a, r) => a + r[2], 0), unUsd = UNMATCHED.reduce((a, r) => a + r[3], 0);
const jan2 = UNMATCHED.filter((r) => r[1] === '2026-01-02').length;
const late = UNMATCHED.filter((r) => r[1] === '2026-10-26');
const share = (unGal / SNAP.gallons) * 100, shareUsd = (unUsd / SNAP.poTotal) * 100;

export default {
  id: 'dmflags', group: 'work', track: 'work', title: 'Matched, Unmatched, Flagged', icon: 'flag', time: 12, level: 'Intermediate',
  tagline: 'The Monitor’s review rules, what its 16 follow-up records look like, and a new look at invoice lag across the 332 matched orders.',
  stats: [
    { id: 'm', label: 'Matched', icon: 'check' }, { id: 'u', label: 'Follow-up', icon: 'flag' },
    { id: 'g', label: 'Follow-up gallons', icon: 'droplet' }, { id: 'lag', label: 'Median lag (days)', icon: 'clock' },
  ],
  legend: [['#2a9d8f', 'matched'], ['#e5534b', 'follow-up'], ['#e8a33a', 'minor gap']],
  learn: [
    { t: 'The four difference classes and their counts', at: 0 }, { t: 'What “unmatched in the loaded exports” does and does not mean', at: 1 },
    { t: 'What the 16 follow-ups share and where to look next', at: 2 }, { t: 'How big the unmatched set is by volume and dollars', at: 3 },
    { t: 'What invoice lag looks like across matched orders', at: 4 }, { t: 'Why a threshold rule is stated and fixed', at: 5 },
  ],
  build(s) {
    s.floor(10, 10, 'cream');
    s.box('mt', 0.8, 0.8, 0, 2.4, 2.0, 1.2, 'teal', { label: { t: '332 matched', icon: 'check' } });
    s.box('mi', 4.0, 0.8, 0, 1.6, 2.0, 0.8, 'yellow', { from: 0, label: { t: 'minor gaps', icon: 'scale' } });
    s.box('un', 7.0, 0.8, 0, 1.6, 2.0, 0.7, 'red', { from: 1, label: { t: '16 follow-up', icon: 'flag' } });
    s.box('jn', 6.6, 4.6, 0, 1.4, 1.4, 0.6, 'red', { from: 2, label: { t: 'Jan 2 cluster', icon: 'pin' } });
    s.box('lt', 6.8, 7.0, 0, 1.2, 1.2, 0.6, 'red', { from: 2, label: { t: 'Oct 26', icon: 'clock' } });
    s.box('lg', 1.0, 5.2, 0, 3.4, 2.0, 0.8, 'white', { from: 4, label: { t: 'invoice lag', icon: 'clock' } });
    s.flow('f1', [[3.2, 1.8, 0.05], [4.0, 1.8, 0.05]], 'invoice', { from: 0 });
    s.flow('f2', [[5.6, 1.8, 0.05], [7.0, 1.8, 0.05]], 'data', { from: 1 });
    s.card('cls', 'DIFFERENCE CLASSES', bars([
      { label: 'exact match', value: SNAP.exact, color: '#2a9d8f' }, { label: 'minor adjust', value: SNAP.minor, color: '#e8a33a' },
      { label: 'material (≥$25)', value: SNAP.material, color: '#e5534b' }, { label: 'no invoice', value: SNAP.unmatched, color: '#6a6c64' },
    ], { w: 300, labelW: 92, max: 340, y0: 36, h: 14, gap: 9, fmt: (v) => `${v}`, note: `${SNAP.orders} orders in total` }), { w: 300, h: 160, from: 0, until: 0 });
    s.card('rule', 'WHAT “UNMATCHED” MEANS', list([['In the loaded file', 'no linked invoice found'], ['Not proven', 'that it was never invoiced'], ['Check', 'adjacent years, source records']], { gap: 36 }), { w: 300, h: 140, from: 1, until: 1 });
    s.card('un', 'THE 16 FOLLOW-UPS BY DATE', table(['listed', 'orders', 'gallons'], [['2026-01-02', `${jan2}`, fmt0(UNMATCHED.filter((r) => r[1] === '2026-01-02').reduce((a, r) => a + r[2], 0))], ['Feb to Sep', `${UNMATCHED.length - jan2 - late.length - 1}`, fmt0(UNMATCHED.filter((r) => r[1] > '2026-01-02' && r[1] < '2026-10-01').reduce((a, r) => a + r[2], 0))], ['2026-10-02', '1', '245'], ['2026-10-26', `${late.length}`, fmt0(late.reduce((a, r) => a + r[2], 0))]], { cols: [12, 130, 200], y0: 34, rowH: 22, W: 292 }), { w: 300, h: 140, from: 2, until: 2 });
    s.card('sz', 'HOW BIG IS IT', bars([{ label: 'gallons', value: share, color: '#e5534b' }, { label: 'order $', value: shareUsd, color: '#e5534b' }], { w: 300, labelW: 70, max: 10, y0: 38, h: 18, gap: 12, fmt: (v) => `${v.toFixed(1)}%`, note: `${fmt0(unGal)} gal and ${fmt$(unUsd)} of ${SNAP.orders} orders` }), { w: 300, h: 130, from: 3, until: 3 });
    s.card('lag', 'DAYS: LISTED DATE TO INVOICE DATE', bars(LAG.bins.map(([label, value]) => ({ label, value, color: '#2a9d8f' })), { w: 300, labelW: 74, max: 240, y0: 36, h: 14, gap: 8, fmt: (v) => `${v}`, note: `${LAG.n} matched orders, median ${LAG.median}, mean ${LAG.mean}` }), { w: 300, h: 160, from: 4, until: 4 });
    s.card('thr', 'THE $25 RULE', list([['Stated', 'in the method, in code'], ['Both ways', 'over or under the order'], ['Below it', 'still visible, not flagged']], { gap: 36 }), { w: 300, h: 140, from: 5, until: 5 });
  },
  steps: [
    { short: 'Classes', tag: 'NUMBERS', title: 'Every order falls into one of four classes', focus: ['mt', 'mi', 'cls'], flows: ['f1'],
      body: [`Of ${SNAP.orders} orders, ${SNAP.exact} match their invoice exactly, ${SNAP.minor} show a minor adjustment (a gap under $25), ${SNAP.material} show a material variance of $25 or more, and ${SNAP.unmatched} have no invoice in the loaded file.`, 'The recorded difference is invoice dollars minus the full purchase-order total, including tax and other lines. A difference is not proof of a billing error, because amendments, tax adjustments, timing or partial fulfillment can all explain it.'], stats: { m: `${SNAP.matched}`, u: `${SNAP.unmatched}` } },
    { short: 'Unmatched', tag: 'PROBLEM', title: '“Unmatched” is a statement about the file', focus: ['un', 'rule'], flows: ['f2'],
      body: ['An order with no linked invoice is unmatched in the loaded exports. It is not proven uninvoiced: an invoice may post in another fiscal year or after the export was refreshed.', 'That is why each such record carries the reason “invoice not found in loaded 2026 journal; check adjacent years and source records”, rather than a verdict.'],
      callout: { k: 'warn', t: 'Wording matters. “Not found in this file” and “never billed” are different claims, and only the first one is supported.' } },
    { short: 'The 16', tag: 'DATA', title: 'What the follow-ups have in common', focus: ['un', 'jn', 'lt', 'f2'], flows: ['f2'],
      body: [`${jan2} of the ${SNAP.unmatched} follow-ups are listed on the same day, January 2, and they hold most of the follow-up gallons. Two more are listed on October 26, only days before the invoice journal’s October 30 update, and the snapshot is dated November 5.`, 'These are patterns to check, not conclusions. A same-day cluster suggests a batch to look at together; very recent orders may simply not be invoiced yet. The project leaves the explanation to the source records.'],
      callout: { k: 'key', t: 'A good flag says what to look at next. It does not say what happened.' } },
    { short: 'Size', tag: 'NUMBERS', title: 'The unmatched set in gallons and dollars', focus: ['un', 'sz'], flows: [],
      body: [`The 16 follow-ups total ${fmt0(unGal)} ordered gallons, ${share.toFixed(1)}% of the ${fmt0(SNAP.gallons)}, and ${fmt$(unUsd)} of order value, ${shareUsd.toFixed(1)}% of ${fmt$(SNAP.poTotal)}.`, 'Sizing the exception set tells a reader whether the follow-up is a rounding issue or a material one. Here, a small share of volume and dollars sits behind a count of 16.'], stats: { g: fmt0(unGal) } },
    { short: 'Invoice lag', tag: 'NUMBERS', title: 'How long invoices take to appear', focus: ['lg', 'lag'], flows: [],
      body: [`Counting days from each order’s listed date to its invoice date across the ${LAG.n} matched orders gives a median of ${LAG.median} days, a mean of ${LAG.mean} and a 90th percentile of ${LAG.p90}. Most invoices land within a week; one took ${LAG.max} days.`, 'This analysis was computed for this lesson from the public snapshot and is not published on the Monitor. The listed date is not a delivery date, so read it as “days from the order line’s date”.'],
      callout: { k: 'know', t: 'A skewed distribution like this is better described by the median and percentiles than by the mean alone.' }, stats: { lag: `${LAG.median}` } },
    { short: 'The rule', tag: 'METHOD', title: 'A threshold rule is stated and fixed', focus: ['mt', 'thr'], flows: [],
      body: ['The $25 rule is applied the same way in both directions, so an invoice $30 under an order is flagged as well as one $30 over. It is written into the method and the code, and smaller differences stay visible on each record.', 'No matched order reaches it. A rule that never fires is still useful: it documents what would, and it makes “nothing found” a checkable statement.'] },
  ],
};
