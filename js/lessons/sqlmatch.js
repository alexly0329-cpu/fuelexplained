import { code, table, list } from './cards.js';

// Core. SQL drills on a small INVENTED order, invoice and accounting set. Every result shown is computed in code from the arrays below.
// The real public-record version of these queries is in the Work lessons.
const LINES = [['PO1', 'fuel', 19680], ['PO1', 'tax', 400], ['PO2', 'fuel', 19840], ['PO2', 'tax', 400], ['PO3', 'fuel', 15750], ['PO3', 'tax', 300], ['PO4', 'fuel', 16960], ['PO4', 'tax', 320], ['PO5', 'fuel', 14820], ['PO5', 'tax', 200]];
const INV = [['I1', 'PO1', 20080], ['I2', 'PO2', 20240], ['I3', 'PO3', 16050], ['I3', 'PO3', 16050], ['I5', 'PO5', 15045]];   // I3 appears twice: a duplicate export row
const ACCT = [['I1', 19680], ['I1', 400], ['I2', 19840], ['I2', 400], ['I3', 15750], ['I3', 300], ['I5', 14820], ['I5', 225]];
const POS = [...new Set(LINES.map((l) => l[0]))];
const poTotal = (p) => LINES.filter((l) => l[0] === p).reduce((a, l) => a + l[2], 0);
const uniqInv = [...new Map(INV.map((r) => [r[0] + '|' + r[1], r])).values()];
const invOf = (p) => uniqInv.filter((r) => r[1] === p).reduce((a, r) => a + r[2], 0);
const unmatched = POS.filter((p) => !uniqInv.some((r) => r[1] === p));
const naiveJoin = INV.reduce((a, r) => a + r[2], 0), dedup = uniqInv.reduce((a, r) => a + r[2], 0);
const diffs = POS.filter((p) => !unmatched.includes(p)).map((p) => [p, invOf(p) - poTotal(p)]);
const flagged = diffs.filter(([, d]) => Math.abs(d) >= 25);
const acctOf = (i) => ACCT.filter((r) => r[0] === i).reduce((a, r) => a + r[1], 0);
const recon = uniqInv.map((r) => [r[0], r[2], acctOf(r[0]), r[2] - acctOf(r[0])]);

export default {
  id: 'sqlmatch', group: 'desk', title: 'SQL Matching Drills', icon: 'database', time: 13, level: 'Intermediate',
  tagline: 'Find unmatched orders, de-duplicate invoices, compare totals against a threshold and reconcile to the ledger, with each query’s result computed on a small data set.',
  stats: [
    { id: 'pos', label: 'Orders', icon: 'file' }, { id: 'un', label: 'Unmatched', icon: 'flag' },
    { id: 'dup', label: 'Rows after dedup', icon: 'layers' }, { id: 'fl', label: 'Flagged (≥$25)', icon: 'gauge' },
  ],
  legend: [['#7c63d0', 'data'], ['#2a9d8f', 'match'], ['#e5534b', 'exception']],
  learn: [
    { t: 'How to read the three tables and their grain', at: 0 }, { t: 'How a LEFT JOIN finds orders with no invoice', at: 1 },
    { t: 'How to de-duplicate before summing', at: 2 }, { t: 'How to aggregate each side before joining', at: 3 },
    { t: 'How to compare totals with a threshold', at: 4 }, { t: 'How to reconcile an invoice to its ledger lines', at: 5 },
    { t: 'How to load the data into SQLite from Python', at: 6 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    s.cyl('po', 1.6, 2.0, 0, 0.9, 1.3, 'green', { label: { t: 'po_line', icon: 'file' } });
    s.cyl('iv', 5.0, 2.0, 0, 0.9, 1.3, 'cream', { label: { t: 'invoice', icon: 'receipt' } });
    s.cyl('ac', 8.0, 4.6, 0, 0.9, 1.3, 'blue', { label: { t: 'accounting', icon: 'database' } });
    s.box('py', 0.8, 6.0, 0, 2.2, 1.4, 0.7, 'violet', { from: 6, label: { t: 'Python script', icon: 'cog' } });
    s.flow('f1', [[2.6, 2.4, 0.05], [4.0, 2.4, 0.05]], 'data', { from: 1 });
    s.flow('f2', [[6.0, 2.6, 0.05], [7.2, 4.6, 0.05]], 'invoice', { from: 5 });
    s.flow('f3', [[2.0, 6.0, 0.05], [2.0, 3.4, 0.05]], 'data', { from: 6 });
    s.card('t', 'THE THREE TABLES (invented)', table(['table', 'one row is', 'rows'], [['po_line', 'an order line', `${LINES.length}`], ['invoice', 'a posted invoice row', `${INV.length}`], ['acct_dist', 'a ledger line', `${ACCT.length}`]], { cols: [12, 90, 240], y0: 34, rowH: 22, W: 292 }), { w: 300, h: 120, from: 0, until: 0 });
    s.card('q1', 'UNMATCHED ORDERS', code([`SELECT p.po_id`, `FROM (SELECT DISTINCT po_id FROM po_line) p`, `LEFT JOIN invoice i ON i.po_id = p.po_id`, `WHERE i.po_id IS NULL;`, ``, `-- returns: ${unmatched.join(', ') || 'none'}`], { y0: 38, gap: 14 }), { w: 300, h: 128, from: 1, until: 1 });
    s.card('q2', 'DE-DUPLICATE', code([`SELECT DISTINCT invoice_id, po_id, amount`, `FROM invoice;`, ``, `-- ${INV.length} rows -> ${uniqInv.length} unique`, `-- naive SUM(amount) = ${naiveJoin}`, `-- unique   SUM(amount) = ${dedup}`], { y0: 38, gap: 14 }), { w: 300, h: 128, from: 2, until: 2 });
    s.card('q3', 'AGGREGATE, THEN JOIN', code([`WITH p AS (SELECT po_id, SUM(amount) AS po_amt`, `           FROM po_line GROUP BY po_id),`, `     i AS (SELECT po_id, SUM(amount) AS inv_amt`, `           FROM (SELECT DISTINCT invoice_id, po_id,`, `                        amount FROM invoice)`, `           GROUP BY po_id)`, `SELECT p.po_id, p.po_amt, i.inv_amt`, `FROM p LEFT JOIN i USING (po_id);`], { y0: 38, gap: 13 }), { w: 300, h: 160, from: 3, until: 3 });
    s.card('q4', 'DIFFERENCE AND THRESHOLD', table(['po', 'order $', 'invoice $', 'diff'], diffs.map(([p, d]) => [p, `${poTotal(p)}`, `${invOf(p)}`, `${d >= 0 ? '+' : ''}${d}`]), { cols: [12, 60, 130, 220], y0: 34, rowH: 20, W: 292, hl: diffs.findIndex(([, d]) => Math.abs(d) >= 25) }), { w: 300, h: 130, from: 4, until: 4 });
    s.card('q5', 'INVOICE vs LEDGER', table(['invoice', 'invoice $', 'ledger $', 'gap'], recon.map((r) => [r[0], `${r[1]}`, `${r[2]}`, `${r[3]}`]), { cols: [12, 70, 140, 230], y0: 34, rowH: 22, W: 292 }), { w: 300, h: 140, from: 5, until: 5 });
    s.card('q6', 'LOAD INTO SQLITE (PYTHON)', code([`import sqlite3`, `db = sqlite3.connect(":memory:")`, `db.execute("CREATE TABLE po_line (`, `  po_id, kind, amount)")`, `db.executemany("INSERT INTO po_line`, `  VALUES (?,?,?)", rows)`, `db.execute("SELECT COUNT(*)`, `  FROM po_line").fetchone()`], { y0: 38, gap: 14 }), { w: 300, h: 156, from: 6, until: 6 });
  },
  steps: [
    { short: 'The tables', tag: 'DATA', title: 'Three tables, three grains', focus: ['po', 'iv', 'ac', 't'], flows: [],
      body: ['An order line table has one row per line. An invoice table has one row per posted invoice, possibly repeated by an export. An accounting table has one row per ledger line.', 'Before any query, say the grain of each table out loud. Most wrong totals come from mixing them.'], stats: { pos: `${POS.length}` } },
    { short: 'Unmatched', tag: 'METHOD', title: 'LEFT JOIN, then keep the missing side', focus: ['po', 'iv', 'q1'], flows: ['f1'],
      body: [`Start from the distinct orders and LEFT JOIN invoices. Orders with no invoice show a NULL on the right; filtering for that NULL gives the unmatched list. In the sample that is ${unmatched.join(', ')}.`, 'A NOT EXISTS subquery returns the same answer and is often easier to read.'], stats: { un: `${unmatched.length}` } },
    { short: 'Dedupe', tag: 'METHOD', title: 'Remove duplicates before summing', focus: ['iv', 'q2'], flows: [],
      body: [`Invoice I3 appears twice, so a plain sum of the invoice table is ${naiveJoin.toLocaleString()} while the true total is ${dedup.toLocaleString()}. SELECT DISTINCT on invoice id, order id and amount removes the repeat.`, 'If two rows share an id but differ in amount, do not silently pick one. Flag it.'],
      callout: { k: 'warn', t: 'Check COUNT(*) against COUNT(DISTINCT key) before trusting any invoice total.' }, stats: { dup: `${uniqInv.length}` } },
    { short: 'Aggregate first', tag: 'METHOD', title: 'Roll each side up to the join key, then join', focus: ['po', 'iv', 'q3'], flows: ['f1'],
      body: ['An order has two lines and its invoice may have several rows. Joining those row by row repeats amounts. A common table expression for each side, grouped by order id, gives one row per order on each side, and the join then cannot fan out.', 'This is the same idea as the grain rule in the star schema lesson.'] },
    { short: 'Threshold', tag: 'NUMBERS', title: 'Flag only differences that matter', focus: ['po', 'iv', 'q4'], flows: ['f1'],
      body: [`Invoice minus order total per matched order: ${diffs.map(([p, d]) => `${p} ${d >= 0 ? '+' : ''}${d}`).join(', ')}. With a $25 rule, ${flagged.length === 1 ? 'one order is' : `${flagged.length} orders are`} flagged (${flagged.map(([p, d]) => `${p} at ${d >= 0 ? '+' : ''}${d}`).join(', ')}).`, 'The threshold sits in the query as a visible number, so it can be changed in one place.'], stats: { fl: `${flagged.length}` } },
    { short: 'Ledger', tag: 'METHOD', title: 'Reconcile the invoice to its ledger lines', focus: ['iv', 'ac', 'q5'], flows: ['f2'],
      body: ['An invoice’s ledger lines should add back up to the invoice amount. Group the accounting table by its invoice key, sum it, and compare. A gap means a missing or extra ledger line.', 'In the sample every invoice reconciles to its ledger, so any order-to-invoice gap comes from the order side, not the books.'], callout: { k: 'know', t: 'Three-way logic: order total, invoice total and ledger total can each be compared to the others.' } },
    { short: 'Load it', tag: 'METHOD', title: 'Use SQLite from Python for quick matching', focus: ['py', 'po', 'q6'], flows: ['f3'],
      body: ['An in-memory SQLite database lets you run these queries on CSV data without any server. Create tables, insert the rows, and query. The same pattern is how a small script can rebuild a report from fresh exports each time.', 'Keep the SQL in the script and the thresholds in constants at the top.'],
      callout: { k: 'key', t: 'Drill the pattern until it is automatic: distinct, left join, aggregate before joining, compare with a threshold, reconcile to the ledger.' } },
  ],
};
