import { code, list, table } from './cards.js';

// Core. Failure modes of joined business records. All sample rows are INVENTED. The real public-record example of several of these is in the Work lessons.
const LINES = [['A-1', 'fuel', 100], ['A-1', 'tax', 20], ['A-1', 'fee', 5]];
const INVS = [['I-9', 'A-1', 125], ['I-9', 'A-1', 125]];  // the same invoice exported twice
const lineTotal = LINES.reduce((a, r) => a + r[2], 0);
const invDup = INVS.reduce((a, r) => a + r[2], 0), invDedup = [...new Map(INVS.map((r) => [r[0] + r[1], r])).values()].reduce((a, r) => a + r[2], 0);

export default {
  id: 'breaks', group: 'mktops', title: 'Where Records Break', icon: 'flag', time: 11, level: 'Intermediate',
  tagline: 'Seven ways a joined set of orders and invoices goes wrong, each with a tiny example and the check that catches it.',
  stats: [
    { id: 'tot', label: 'True order total', icon: 'receipt' }, { id: 'dup', label: 'Naive invoice total', icon: 'flag' },
    { id: 'fix', label: 'Deduplicated', icon: 'check' }, { id: 'n', label: 'Failure modes', icon: 'layers' },
  ],
  legend: [['#e5534b', 'break'], ['#2a9d8f', 'check'], ['#7c63d0', 'record']],
  learn: [
    { t: 'How keys that look alike fail to join', at: 0 }, { t: 'How duplicates inflate totals', at: 1 },
    { t: 'What fan-out is on a one-to-many join', at: 2 }, { t: 'Why blank must not become zero', at: 3 },
    { t: 'How units and definitions differ silently', at: 4 }, { t: 'How timing and period cut-offs hide records', at: 5 },
    { t: 'Why a small rounding gap is not an error', at: 6 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    s.box('ord', 0.8, 1.0, 0, 2.2, 1.6, 1.0, 'green', { label: { t: 'orders', icon: 'file' } });
    s.box('inv', 6.0, 1.0, 0, 2.2, 1.6, 1.0, 'cream', { label: { t: 'invoices', icon: 'receipt' } });
    s.box('led', 3.4, 6.2, 0, 2.2, 1.6, 1.0, 'blue', { label: { t: 'ledger', icon: 'database' } });
    s.box('bad', 3.6, 3.0, 0, 1.4, 1.4, 0.7, 'red', { from: 1, label: { t: 'mismatch', icon: 'flag' } });
    s.flow('f1', [[3.0, 1.8, 0.05], [6.0, 1.8, 0.05]], 'data', {});
    s.flow('f2', [[7.0, 2.8, 0.05], [5.6, 6.6, 0.05]], 'invoice', { from: 5 });
    s.card('key', 'KEYS THAT LOOK ALIKE', table(['order table', 'invoice table'], [['PO585255', 'po585255'], ['0012345', '12345'], ['A-1001', 'A-1001 ']], { cols: [12, 150], y0: 34, rowH: 22, W: 292 }), { w: 300, h: 120, from: 0, until: 0 });
    s.card('dup', 'DUPLICATE ROWS (invented)', code([`order A-1  lines: 100 + 20 + 5 = ${lineTotal}`, `invoice I-9 exported twice: ${INVS[0][2]}, ${INVS[1][2]}`, `naive sum of rows   = ${invDup}`, `unique invoice only = ${invDedup}`], { y0: 38, gap: 16 }), { w: 300, h: 112, from: 1, until: 1 });
    s.card('fan', 'FAN-OUT', code([`3 order lines x 2 invoice rows`, `= 6 joined rows`, ``, `sum(line_amount) over the join:`, `${LINES.map((r) => r[2]).join(' + ')} counted twice = ${lineTotal * 2}`, `true order total = ${lineTotal}`], { y0: 38, gap: 15 }), { w: 300, h: 140, from: 2, until: 2 });
    s.card('nul', 'BLANK IS NOT ZERO', list([['null', 'unknown, keep as unknown'], ['0', 'known to be nothing'], ['sum', 'say how many rows were unknown']], { gap: 34 }), { w: 300, h: 140, from: 3, until: 3 });
    s.card('def', 'SAME WORD, DIFFERENT FACT', table(['field', 'could mean'], [['quantity', 'ordered or delivered'], ['date', 'order, load or invoice'], ['amount', 'with or without tax'], ['unit', 'gallons or barrels']], { cols: [12, 130], y0: 34, rowH: 22, W: 292 }), { w: 300, h: 140, from: 4, until: 4 });
  },
  steps: [
    { short: 'Keys', tag: 'PROBLEM', title: 'Keys that look the same but are not', focus: ['ord', 'inv', 'key'], flows: ['f1'],
      body: ['Joins need equal keys. Case, spaces, leading zeros and prefixes quietly break equality: “PO585255” is not “po585255”, and “0012345” is not “12345” if one side is text and the other a number.', 'Check: count rows before and after the join, and list the keys that failed to match instead of dropping them.'],
      callout: { k: 'warn', t: 'A join that silently returns fewer rows is worse than one that errors.' }, stats: { n: '7' } },
    { short: 'Duplicates', tag: 'PROBLEM', title: 'Duplicate rows multiply money', focus: ['inv', 'dup', 'bad'], flows: ['f1'],
      body: [`An export that lists the same invoice twice makes the naive total ${invDup}, while the true amount is ${invDedup}. The case study later in this site specifically sums posted invoice amounts once per unique invoice and purchase-order pair for this reason.`, 'Check: group by the key and look for counts above one before summing.'], stats: { dup: `${invDup}`, fix: `${invDedup}` } },
    { short: 'Fan-out', tag: 'PROBLEM', title: 'One-to-many joins repeat the “one” side', focus: ['ord', 'inv', 'fan', 'bad'], flows: ['f1'],
      body: [`An order has ${LINES.length} lines and its invoice appears on 2 rows, so a join produces ${LINES.length * 2} rows. Summing the order amount over that result counts it twice: ${lineTotal * 2} instead of ${lineTotal}.`, 'Fix: aggregate each side to the grain of the join key first, then join the two summaries.'],
      callout: { k: 'key', t: 'Know the grain of every table: one row per what? Join at a matching grain.' }, stats: { tot: `${lineTotal}` } },
    { short: 'Nulls', tag: 'PROBLEM', title: 'Blank is not zero', focus: ['nul'], flows: [],
      body: ['If an amount is missing, the true value is unknown. Replacing it with zero makes a total look complete when it is not.', 'Better: keep the null, report how many rows are unknown next to any total, and decide with the business owner whether to exclude or estimate them.'] },
    { short: 'Definitions', tag: 'PROBLEM', title: 'Same column name, different meaning', focus: ['def'], flows: [],
      body: ['“Quantity”, “date” and “amount” each have several possible meanings in fuel data. Quantity may be ordered or delivered; amount may include tax; a date may be the order, the loading or the invoice.', 'Write a one-line definition for every metric field and keep it with the report.'] },
    { short: 'Timing', tag: 'PROBLEM', title: 'The record may live in another period', focus: ['inv', 'led'], flows: ['f2'],
      body: ['An order in one fiscal year can be invoiced in the next, so a year-limited extract will show it as unmatched. That is not proof it was never billed.', 'Check: widen the window by a period on each side before calling something missing.'] },
    { short: 'Rounding', tag: 'NUMBERS', title: 'A few cents is not an error', focus: ['inv', 'led'], flows: ['f2'],
      body: ['Tax rounding, line rounding and currency conversions leave small gaps between records. Chasing every cent wastes time and hides the real exceptions.', 'Set an explicit threshold, for example flag only gaps of $25 or more, state it in the report and show the smaller gaps without alarm. The Work lessons use exactly that rule on real public data.'],
      callout: { k: 'know', t: 'A threshold is a decision, not a fact. Write down who chose it and why.' } },
  ],
};
