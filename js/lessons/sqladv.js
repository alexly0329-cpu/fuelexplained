import { code, table, list } from './cards.js';

// Core. Every table and result below is INVENTED. The numbers on each card are computed in code from these arrays, and the SQL text is the same logic in SQLite syntax.
const O = [['P1', 'Jan', 8000, 19680], ['P2', 'Jan', 7500, 15750], ['P3', 'Feb', 8000, 19840], ['P4', 'Feb', 6000, 14820], ['P5', 'Mar', 8000, 16880], ['P6', 'Mar', 3500, 9800]];
const INV = [['I1', 'P1', 19680, '01-05'], ['I2', 'P2', 15742, '01-06'], ['I3', 'P3', 19840, '02-04'], ['I4', 'P4', 14000, '02-10'], ['I4r', 'P4', 14820, '02-12'], ['I5', 'P5', 16905, '03-09']];
const latest = {};
INV.forEach((r) => { if (!latest[r[1]] || r[3] > latest[r[1]][3]) latest[r[1]] = r; });
const rows = O.map(([po, mo, g, tot]) => { const i = latest[po]; const d = i ? i[2] - tot : null; const cls = d == null ? 'no invoice' : d === 0 ? 'exact' : Math.abs(d) < 25 ? 'minor' : 'material'; return [po, mo, g, tot, i ? i[2] : null, d, cls]; });
const cnt = {}; rows.forEach((r) => { cnt[r[6]] = (cnt[r[6]] || 0) + 1; });
const multi = Object.entries(INV.reduce((a, r) => (a[r[1]] = (a[r[1]] || 0) + 1, a), {})).filter(([, n]) => n > 1).map(([p]) => p);
const months = ['Jan', 'Feb', 'Mar'], mg = months.map((m) => O.filter((o) => o[1] === m).reduce((a, o) => a + o[2], 0));
const run = mg.map((_, i) => mg.slice(0, i + 1).reduce((a, b) => a + b, 0));
const mom = mg.map((v, i) => (i ? v - mg[i - 1] : null));

export default {
  id: 'sqladv', group: 'desk', title: 'SQL Beyond Matching', icon: 'database', time: 12, level: 'Advanced',
  tagline: 'CASE for classes, HAVING for duplicates, a CTE to build in layers, ROW_NUMBER to keep the latest record, and running totals and month-over-month change with window functions.',
  stats: [
    { id: 'm', label: 'Material gaps', icon: 'flag' }, { id: 'n', label: 'No invoice', icon: 'file' },
    { id: 'r', label: 'Running total (gal)', icon: 'gauge' }, { id: 'c', label: 'Mar vs Feb (gal)', icon: 'chart' },
  ],
  legend: [['#b8c940', 'orders'], ['#2a9d8f', 'invoices'], ['#7c63d0', 'query result']],
  learn: [
    { t: 'How to read the two sample tables', at: 0 }, { t: 'How to turn a difference into a class with CASE', at: 1 },
    { t: 'How to find duplicates with GROUP BY and HAVING', at: 2 }, { t: 'How to keep the latest row with ROW_NUMBER', at: 3 },
    { t: 'How to build a query in layers with a CTE', at: 4 }, { t: 'How to compute a running total and a change from last month', at: 5 },
  ],
  build(s) {
    s.floor(10, 10, 'cream');
    s.cyl('o', 1.6, 2.2, 0, 0.9, 1.3, 'green', { label: { t: 'orders', icon: 'file' } });
    s.cyl('i', 4.6, 2.2, 0, 0.9, 1.3, 'cream', { label: { t: 'invoices', icon: 'receipt' } });
    s.box('q', 3.0, 6.0, 0, 2.6, 1.8, 1.0, 'violet', { from: 1, label: { t: 'query result', icon: 'table' } });
    s.box('w', 7.2, 5.0, 0, 1.6, 1.6, 1.4, 'teal', { from: 5, label: { t: 'windows', icon: 'chart' } });
    s.flow('f1', [[2.4, 3.2, 0.05], [3.6, 6.0, 0.05]], 'data', { from: 1 });
    s.flow('f2', [[5.4, 3.2, 0.05], [4.4, 6.0, 0.05]], 'data', { from: 1 });
    s.card('tab', 'THE TWO TABLES (invented)', table(['po', 'mo', 'gal', 'order $'], O.map((o) => [o[0], o[1], `${o[2]}`, `${o[3]}`]), { cols: [12, 50, 92, 150], y0: 28, rowH: 12, W: 292 }) + table(['inv', 'po', 'amount', 'posted'], INV.map((r) => [r[0], r[1], `${r[2]}`, r[3]]), { cols: [12, 50, 92, 160], y0: 118, rowH: 12, W: 292 }), { w: 300, h: 214, from: 0, until: 0 });
    s.card('case', 'CASE: CLASS', code(['SELECT po,', '  CASE', "   WHEN amount IS NULL THEN 'no invoice'", "   WHEN diff = 0 THEN 'exact'", "   WHEN ABS(diff) < 25 THEN 'minor'", "   ELSE 'material' END AS class", 'FROM matched;', '', `exact ${cnt.exact || 0}  minor ${cnt.minor || 0}  material ${cnt.material || 0}  none ${cnt['no invoice'] || 0}`], { y0: 30, gap: 13 }), { w: 300, h: 160, from: 1, until: 1 });
    s.card('hav', 'HAVING: DUPLICATES', code(['SELECT po, COUNT(*) AS n', 'FROM invoices', 'GROUP BY po', 'HAVING COUNT(*) > 1;', '', `result: ${multi.join(', ')} has 2 invoice rows`, '', 'WHERE filters rows before grouping;', 'HAVING filters groups after.'], { y0: 32, gap: 14 }), { w: 300, h: 156, from: 2, until: 2 });
    s.card('rn', 'ROW_NUMBER: LATEST', code(['SELECT * FROM (', ' SELECT *, ROW_NUMBER() OVER (', '   PARTITION BY po', '   ORDER BY posted DESC) AS rn', ' FROM invoices)', 'WHERE rn = 1;', '', `P4 keeps ${latest.P4[0]} (${latest.P4[2]}), not I4`], { y0: 32, gap: 14 }), { w: 300, h: 150, from: 3, until: 3 });
    s.card('cte', 'CTE: LAYERS', code(['WITH last_inv AS (', '  SELECT po, amount FROM (...rn = 1)', '), joined AS (', '  SELECT o.po, o.total, l.amount,', '         l.amount - o.total AS diff', '  FROM orders o', '  LEFT JOIN last_inv l USING (po))', 'SELECT class, COUNT(*) FROM joined', 'GROUP BY class;'], { y0: 32, gap: 13 }), { w: 300, h: 158, from: 4, until: 4 });
    s.card('win', 'WINDOWS BY MONTH', table(['month', 'gallons', 'running', 'vs prior'], months.map((m, i) => [m, `${mg[i]}`, `${run[i]}`, mom[i] == null ? '-' : `${mom[i]}`]), { cols: [12, 70, 136, 214], y0: 34, rowH: 22, W: 292 }) + code(['SUM(gal) OVER (ORDER BY mo)  -- running', 'gal - LAG(gal) OVER (ORDER BY mo)'], { y0: 124, gap: 13 }), { w: 300, h: 160, from: 5, until: 5 });
  },
  steps: [
    { short: 'Tables', tag: 'DATA', title: 'Two small tables to practise on', focus: ['o', 'i', 'tab'], flows: [],
      body: [`Six orders and six invoice rows, all invented. One order, P4, has two invoice rows (a first invoice and a corrected one), P6 has none, and P5’s invoice is $25 above its order.`, 'Small tables with deliberate traps are the best way to practise: you know what the right answer is.'] },
    { short: 'CASE', tag: 'METHOD', title: 'CASE turns a difference into a class', focus: ['q', 'case'], flows: ['f1', 'f2'],
      body: [`After joining orders to each order’s latest invoice, CASE labels every row: no invoice, exact, minor (under $25) or material ($25 or more). The counts here are ${cnt.exact} exact, ${cnt.minor} minor, ${cnt.material} material and ${cnt['no invoice']} with no invoice.`, 'Put the NULL test first. A NULL difference fails every comparison, so it would fall into ELSE and be mislabelled.'],
      callout: { k: 'warn', t: 'In CASE the first true branch wins, so order the branches from most specific to least.' }, stats: { m: `${cnt.material}`, n: `${cnt['no invoice']}` } },
    { short: 'HAVING', tag: 'METHOD', title: 'GROUP BY and HAVING find duplicates', focus: ['i', 'hav'], flows: [],
      body: ['Group the invoice rows by order and keep groups with more than one row. P4 appears, so it needs a decision about which invoice counts.', 'WHERE filters rows before they are grouped, HAVING filters the groups afterwards. Mixing them up is a classic interview slip.'] },
    { short: 'Latest', tag: 'METHOD', title: 'ROW_NUMBER keeps one row per order', focus: ['i', 'rn'], flows: [],
      body: [`Number each order’s invoices from newest to oldest with ROW_NUMBER, partitioned by order, and keep number 1. P4 keeps ${latest.P4[0]} at ${latest.P4[2]}, the corrected invoice, not the earlier ${INV[3][2]}.`, 'Whether the latest or a sum is right is a business rule, not a SQL one. State the rule, then write the query.'] },
    { short: 'CTE', tag: 'METHOD', title: 'A CTE builds the query in layers', focus: ['q', 'cte'], flows: ['f1', 'f2'],
      body: ['A common table expression names an intermediate result, so the query reads top to bottom: first the latest invoice per order, then the join, then the class counts. Each layer can be run and checked alone.', 'This is how long “order-to-invoice matching” queries stay readable, and it is the easiest habit to show in a screen share.'] },
    { short: 'Windows', tag: 'NUMBERS', title: 'Running totals and change from last month', focus: ['w', 'win'], flows: [],
      body: [`A window function adds a calculation across rows without collapsing them. SUM over the month order gives a running total of ${run.join(', ')} gallons, and LAG gives each month’s change from the one before: ${mom.slice(1).join(' and ')} gallons.`, 'Window functions keep every row, which is what dashboards need for trends. Check the result by hand on a tiny table, as here.'], stats: { r: `${run[2]}`, c: `${mom[2]}` } },
  ],
};
