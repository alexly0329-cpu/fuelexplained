import { code, table, list } from './cards.js';
import { PO, fmt$ } from './dmdata.js';

// Work. The join logic of the Columbus Diesel Order Monitor, using its own worked example PO585255. Keys come from the City Auditor's published entity diagram.
const KEYS = [['Purchase order', 'PurchId', 'PO line'], ['PO line', 'SourceDocumentLine', 'Accounting line'], ['Vendor invoice', 'SourceDocumentHeader', 'Accounting line'], ['Vendor invoice', 'LedgerVoucher', 'Payment']];
const diff = +(PO.invTotal - PO.total).toFixed(2);
const acctSum = +PO.acct.reduce((a, b) => a + b, 0).toFixed(2);
const taxGap = +(PO.acct[0] - PO.tax).toFixed(2);

export default {
  id: 'dmjoin', group: 'work', track: 'work', title: 'Three Files, One Chain', icon: 'link', time: 12, level: 'Intermediate',
  tagline: 'How the Monitor joins purchase-order lines, invoice journals and accounting lines, traced end to end on its own check record PO585255.',
  stats: [
    { id: 'po', label: 'PO total', icon: 'file' }, { id: 'inv', label: 'Invoice total', icon: 'receipt' },
    { id: 'diff', label: 'Difference', icon: 'scale' }, { id: 'acct', label: 'Ledger total', icon: 'database' },
  ],
  legend: [['#b8c940', 'order'], ['#2a9d8f', 'invoice'], ['#7c63d0', 'key']],
  learn: [
    { t: 'The three files and what a row is in each', at: 0 }, { t: 'Which keys link which records', at: 1 },
    { t: 'How PO lines are classified as diesel, tax or other', at: 2 }, { t: 'How invoices attach by PurchId and are counted once', at: 3 },
    { t: 'How accounting lines attach by SourceDocumentHeader', at: 4 }, { t: 'The SQL pattern behind the selection', at: 5 },
    { t: 'Why the build checks itself against a known record', at: 6 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    s.cyl('po', 1.6, 2.0, 0, 0.9, 1.3, 'green', { label: { t: 'PO lines', icon: 'file' } });
    s.cyl('iv', 5.0, 2.0, 0, 0.9, 1.3, 'cream', { from: 3, label: { t: 'invoice journal', icon: 'receipt' } });
    s.cyl('ac', 8.0, 5.0, 0, 0.9, 1.3, 'blue', { from: 4, label: { t: 'accounting lines', icon: 'database' } });
    s.box('chk', 1.0, 6.0, 0, 2.4, 1.6, 0.8, 'violet', { from: 6, label: { t: 'self-check', icon: 'check' } });
    s.flow('k1', [[2.6, 2.4, 0.05], [4.0, 2.4, 0.05]], 'order', { from: 3 });
    s.flow('k2', [[6.0, 2.8, 0.05], [7.4, 4.6, 0.05]], 'invoice', { from: 4 });
    s.flow('k3', [[2.4, 3.2, 0.05], [3.8, 6.2, 0.05], [7.2, 5.8, 0.05]], 'data', { from: 1, until: 1 });
    s.card('keys', 'PUBLISHED RELATIONSHIPS', table(['left', 'key', 'right'], KEYS, { cols: [12, 80, 190], y0: 34, rowH: 24, W: 292 }), { w: 300, h: 150, from: 1, until: 1 });
    s.card('lines', `${PO.id} · PO LINES`, code([`line 10  tax      ${PO.tax.toFixed(2)}`, `line 20  diesel   ${PO.fuel.toFixed(2)}  (${PO.gallons} units)`, `                 ------`, `order total      ${PO.total.toFixed(2)}`], { y0: 40, gap: 17 }), { w: 300, h: 118, from: 2, until: 2 });
    s.card('invc', 'INVOICE (matched on PurchId)', code([`invoice   ${PO.invoice}`, `date      ${PO.invDate}`, `amount    ${PO.invTotal.toFixed(2)}`, `PO total  ${PO.total.toFixed(2)}`, `difference ${diff.toFixed(2)}`], { y0: 38, gap: 16 }), { w: 300, h: 128, from: 3, until: 3 });
    s.card('acct', 'LEDGER LINES (by header)', code([`header ${PO.header}`, `line   ${PO.acct[1].toFixed(2)}  fuel`, `line   ${PO.acct[0].toFixed(2)}  tax-like`, `total  ${acctSum.toFixed(2)}`, `= invoice ${PO.invTotal.toFixed(2)}   gap 0.00`], { y0: 38, gap: 16 }), { w: 300, h: 128, from: 4, until: 4 });
    s.card('sql', 'SELECTION RULE (SQLite)', code([`SELECT DISTINCT po_id FROM po_line`, `WHERE vendor = '002166'`, `  AND (lower(description)`, `        LIKE 'fuel| diesel| tank wagon%'`, `    OR lower(description)`, `        LIKE 'fuel| diesel| transport%');`], { y0: 38, gap: 14 }), { w: 300, h: 130, from: 5, until: 5 });
    s.card('gold', 'GOLDEN RECORD TEST', list([['Quantity', `${PO.gallons} units`], ['Diesel line', fmt$(PO.fuel)], ['Invoice', fmt$(PO.invTotal)]], { gap: 34 }), { w: 300, h: 130, from: 6, until: 6 });
  },
  steps: [
    { short: 'Three files', tag: 'DATA', title: 'Three exports, three grains', focus: ['po'], flows: [],
      body: ['The build reads three City Auditor exports for fiscal year 2026: purchase-order lines (one row per line), vendor invoice journals (one row per posted invoice entry) and accounting distributions (one row per ledger line).', 'Because a purchase order has several lines and an invoice has several ledger lines, none of these files can be joined row to row without care.'], stats: { po: '' } },
    { short: 'Keys', tag: 'DATA', title: 'The Auditor publishes which keys link which records', focus: ['po', 'keys'], flows: ['k3'],
      body: ['The Auditor’s entity diagram lists the relationships: a purchase order links to its lines by PurchId, a line links to accounting by SourceDocumentLine, a vendor invoice links to accounting by SourceDocumentHeader, and to a payment by LedgerVoucher if payments are loaded.', 'The Monitor’s method note applies two of these: order lines and invoice journals match on PurchId, and invoice journals connect to accounting distributions through SourceDocumentHeader.'],
      callout: { k: 'know', t: 'Using the publisher’s own entity diagram, instead of guessing keys from column names, is what makes a join defensible.' } },
    { short: 'PO lines', tag: 'METHOD', title: `${PO.id}: classify each line`, focus: ['po', 'lines'], flows: [],
      body: [`The order has two lines. Line 20 is a diesel tank-wagon line for ${PO.gallons} units at ${fmt$(PO.fuel)}. Line 10 is a tax line of ${fmt$(PO.tax)}. Together they total ${fmt$(PO.total)}.`, 'The build labels each line as diesel fuel (the description starts with “Fuel| Diesel|” and contains tank wagon or transport), tax, or other. Only diesel lines feed the gallon count; all lines feed the order total.'], stats: { po: fmt$(PO.total) } },
    { short: 'Invoices', tag: 'METHOD', title: 'Attach invoices on PurchId, count each once', focus: ['po', 'iv', 'invc'], flows: ['k1'],
      body: [`Invoice ${PO.invoice}, dated ${PO.invDate}, carries ${fmt$(PO.invTotal)}. That is ${fmt$(Math.abs(diff))} below the order total, so the recorded difference is ${diff.toFixed(2)}, well under the $25 review threshold.`, 'The build sums invoice amounts once per unique invoice-and-order pair, so an invoice repeated by the export or by accounting rows cannot multiply the total. If two rows share an invoice id but disagree on amount, the total is left unknown instead of guessed.'],
      callout: { k: 'key', t: 'Unknown stays unknown. A blank source value is null, never zero.' }, stats: { inv: fmt$(PO.invTotal), diff: diff.toFixed(2) } },
    { short: 'Ledger', tag: 'METHOD', title: 'Attach ledger lines through the invoice header', focus: ['iv', 'ac', 'acct'], flows: ['k2'],
      body: [`The invoice’s header key leads to two accounting lines, ${fmt$(PO.acct[1])} and ${fmt$(PO.acct[0])}, which add up to ${fmt$(acctSum)}, exactly the invoice. The ${Math.abs(taxGap).toFixed(2)} gap against the order’s tax line sits in the tax-like component.`, 'The published category does not establish why that gap exists, so the project does not guess a cause. It records the figure and stops.'], stats: { acct: fmt$(acctSum) } },
    { short: 'The SQL', tag: 'METHOD', title: 'Selection runs as a small SQLite query', focus: ['po', 'sql'], flows: [],
      body: ['The build loads purchase-order lines into an in-memory SQLite table, then selects the distinct orders for the vendor whose description matches a main diesel line. Everything else is assembled in Python from those selected ids.', 'It is the same pattern as the SQL Matching Drills lesson: distinct orders first, then attach each other source by key.'] },
    { short: 'Self-check', tag: 'METHOD', title: 'The build tests itself on one known record', focus: ['chk', 'gold'], flows: [],
      body: [`After building, the script checks ${PO.id} against hard-coded values: ${PO.gallons} ordered units, ${fmt$(PO.fuel)} in the diesel line, ${fmt$(PO.tax)} tax and ${fmt$(PO.invTotal)} on the invoice. If any differ, it stops instead of publishing.`, 'A single hand-verified record catches silent changes in the public data or in the code.'],
      callout: { k: 'know', t: 'This “golden record” habit is cheap and one of the best things an analyst can add to a pipeline.' } },
  ],
};
