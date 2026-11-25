import { table, list, bars, cols } from './cards.js';

// Core. All figures are INVENTED and computed in code from the arrays below. The method (decompose, slice, baseline, cause-or-say-so) is the point.
const A = { ULSD: [200000, 2.60], REG: [200000, 2.40] };   // last month: [gallons, $/gal]
const B = { ULSD: [200000, 2.70], REG: [240000, 2.52] };   // this month
const rev = (m) => Object.values(m).reduce((a, [g, p]) => a + g * p, 0);
const rA = rev(A), rB = rev(B), delta = rB - rA;
const vol = {}, price = {};
for (const k of Object.keys(A)) { vol[k] = (B[k][0] - A[k][0]) * A[k][1]; price[k] = B[k][0] * (B[k][1] - A[k][1]); }
const volT = Object.values(vol).reduce((a, b) => a + b, 0), priceT = Object.values(price).reduce((a, b) => a + b, 0);
const WK = [412, 398, 405, 420, 409, 415, 402, 611];     // weekly thousand gallons, invented; last week looks odd
const med = (a) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const base = WK.slice(0, -1), m = med(base), mad = med(base.map((x) => Math.abs(x - m))), limit = m + 3 * mad * 1.4826;
const fmt = (n) => `$${Math.round(n).toLocaleString()}`;

export default {
  id: 'rootcause', group: 'mktops', title: 'Why Did the Number Move?', icon: 'search', time: 11, level: 'Intermediate',
  tagline: 'A repeatable method for anomalies, variances and ad hoc requests: check the number, split it into price and volume, slice it, compare to a baseline, then name the cause or say you cannot.',
  stats: [
    { id: 'd', label: 'Revenue change', icon: 'chart' }, { id: 'v', label: 'Volume effect', icon: 'droplet' },
    { id: 'p', label: 'Price effect', icon: 'gauge' }, { id: 'b', label: 'Baseline limit (k gal)', icon: 'flag' },
  ],
  legend: [['#bfbfb2', 'last month'], ['#e8a33a', 'this month'], ['#e5534b', 'flagged']],
  learn: [
    { t: 'Why you check the number before explaining it', at: 0 }, { t: 'How to split a change into volume and price', at: 1 },
    { t: 'How to slice it by product to find the driver', at: 2 }, { t: 'How to set a baseline for what counts as unusual', at: 3 },
    { t: 'How to say cause, hypothesis or unknown', at: 4 }, { t: 'How an ad hoc request becomes a clean answer', at: 5 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    s.box('a', 1.0, 1.4, 0, 2.2, 2.2, 1.2, 'steel', { label: { t: 'last month', icon: 'clock' } });
    s.box('b', 4.6, 1.4, 0, 2.2, 2.2, 1.5, 'flame', { from: 1, label: { t: 'this month', icon: 'clock' } });
    s.box('v', 2.0, 5.4, 0, 1.6, 1.6, 0.8, 'blue', { from: 1, label: { t: 'volume', icon: 'droplet' } });
    s.box('p', 4.6, 5.4, 0, 1.6, 1.6, 0.8, 'yellow', { from: 1, label: { t: 'price', icon: 'gauge' } });
    s.box('w', 7.4, 4.8, 0, 1.4, 1.4, 1.5, 'red', { from: 3, label: { t: 'odd week', icon: 'flag' } });
    s.flow('f1', [[3.2, 2.5, 0.05], [4.6, 2.5, 0.05]], 'data', { from: 1 });
    s.card('chk', 'CHECK FIRST', list([['Duplicates', 'same record twice?'], ['Units', 'gallons or barrels?'], ['Dates', 'which date, which period?'], ['Scope', 'same filters both months?']], { gap: 32 }), { w: 300, h: 160, from: 0, until: 0 });
    s.card('dec', 'PRICE AND VOLUME (invented)', table(['', 'last', 'this'], [['gallons', `${(Object.values(A).reduce((a, x) => a + x[0], 0) / 1000)}k`, `${(Object.values(B).reduce((a, x) => a + x[0], 0) / 1000)}k`], ['revenue', fmt(rA), fmt(rB)], ['change', '', fmt(delta)], ['volume effect', '', fmt(volT)], ['price effect', '', fmt(priceT)]], { cols: [12, 120, 200], y0: 34, rowH: 22, W: 292 }), { w: 300, h: 168, from: 1, until: 1 });
    s.card('sl', 'BY PRODUCT', table(['', 'volume', 'price'], Object.keys(A).map((k) => [k, fmt(vol[k]), fmt(price[k])]), { cols: [12, 90, 190], y0: 34, rowH: 24, W: 292 }), { w: 300, h: 120, from: 2, until: 2 });
    s.card('bl', 'WEEKLY k GALLONS', cols(WK.map((v, i) => ({ label: `w${i + 1}`, value: v, color: v > limit ? '#e5534b' : '#bfbfb2' })), { w: 300, y0: 34, h: 70, max: 650, fmt: (v) => `${v}` }), { w: 300, h: 150, from: 3, until: 3 });
    s.card('say', 'THREE HONEST ANSWERS', list([['Cause', 'the record shows why'], ['Hypothesis', 'fits, not proven'], ['Unknown', 'data cannot say']], { gap: 36 }), { w: 300, h: 140, from: 4, until: 4 });
    s.card('flow', 'AD HOC REQUEST', list([['Clarify', 'question, period, use'], ['Query', 'small and checked'], ['Answer', 'one line first'], ['Record', 'save the query']], { gap: 32 }), { w: 300, h: 160, from: 5, until: 5 });
  },
  steps: [
    { short: 'Check', tag: 'METHOD', title: 'Before explaining a number, check it is real', focus: ['a', 'chk'], flows: [],
      body: ['A sudden jump is more often a data problem than a business change: a duplicate load, a changed unit, a different date field or a filter that was not applied last time. Rule these out first, in about five minutes, before building any story.', 'Where Records Break and the KPI lesson list the usual suspects. If the number survives the checks, it is worth explaining.'],
      callout: { k: 'key', t: 'Never explain a number you have not checked. A beautiful explanation of a bad number is the worst outcome.' } },
    { short: 'Split', tag: 'NUMBERS', title: 'Split a change into volume and price', focus: ['a', 'b', 'v', 'p', 'dec'], flows: ['f1'],
      body: [`Take an invented month: revenue rose from ${fmt(rA)} to ${fmt(rB)}, a change of ${fmt(delta)}. Volume effect is the gallon change at last month’s price; price effect is this month’s gallons times the price change.`, `Here the volume effect is ${fmt(volT)} and the price effect ${fmt(priceT)}, which add back to the total. If the two do not add up, the method has a hole.`], stats: { d: fmt(delta), v: fmt(volT), p: fmt(priceT) } },
    { short: 'Slice', tag: 'NUMBERS', title: 'Slice it to find the driver', focus: ['v', 'p', 'sl'], flows: [],
      body: [`By product, regular gasoline accounts for ${fmt(vol.REG)} of volume effect (40,000 more gallons) and ${fmt(price.REG)} of price effect, while diesel moved only on price, ${fmt(price.ULSD)}.`, 'Slice by the dimensions the business uses: product, customer, terminal, month. Stop when one slice explains most of the change. If every slice moves a little, the answer is “broad-based”, which is also a finding.'] },
    { short: 'Baseline', tag: 'METHOD', title: 'Set a baseline for “unusual”', focus: ['w', 'bl'], flows: [],
      body: [`Seven normal weeks of invented volume have a median of ${m}k gallons. A simple robust limit, the median plus three scaled median absolute deviations, is ${limit.toFixed(0)}k. Week 8 at ${WK[7]}k is well above it, so it is flagged; no normal week is.`, 'A median-based rule is not thrown off by the odd week itself. Whatever rule you use, write it down so the same week is flagged the same way next time.'], stats: { b: limit.toFixed(0) } },
    { short: 'Cause', tag: 'PROBLEM', title: 'Cause, hypothesis or unknown', focus: ['say'], flows: [],
      body: ['A cause is something the record shows: a one-off order, a changed rate, a duplicate. A hypothesis fits the pattern but is not proven, for example “many orders share one date, which looks like a batch”. Unknown means the data you have cannot tell.', 'The Diesel Monitor does this deliberately: its flags say what to look at next, and the follow-up notes avoid naming a cause the records do not show.'],
      callout: { k: 'know', t: 'Saying “the data cannot tell us” is a complete answer when it is true, and it builds trust.' } },
    { short: 'Ad hoc', tag: 'ROLE', title: 'From request to answer', focus: ['flow'], flows: [],
      body: ['A good ad hoc request flow is: clarify the question, period and use; run a small query and check it against a known total; give the one-line answer first, then the detail; and save the query with a note so it can be rerun.', 'The same loop works whether the request comes from a sales manager, a support team or a project lead, and it is the habit behind the “process improvement” in many analyst job descriptions.'] },
  ],
};
