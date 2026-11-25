import { bars, list, table } from './cards.js';
import { SNAP, fmt$, fmt0 } from './dmdata.js';

// Work. A case study of my own project, the Columbus Diesel Order Monitor, an independent portfolio build on public City Auditor records.
// It is not affiliated with the City of Columbus, any fuel supplier or any employer. Figures are from the Nov 5, 2026 snapshot.
const rate = (SNAP.matched / SNAP.orders) * 100;

export default {
  id: 'dmoverview', group: 'work', track: 'work', title: 'The Diesel Monitor: The Question', icon: 'search', time: 10, level: 'Intermediate',
  tagline: 'One buyer, one supplier, every diesel order traced from purchase order to invoice. What the project asks, what data it uses and what it refuses to claim.',
  stats: [
    { id: 'ord', label: 'Orders', icon: 'file' }, { id: 'mat', label: 'Matched to invoice', icon: 'check' },
    { id: 'gal', label: 'Ordered gallons', icon: 'droplet' }, { id: 'rate', label: 'Match rate', icon: 'gauge' },
  ],
  legend: [['#b8c940', 'order'], ['#2a9d8f', 'invoice'], ['#7c63d0', 'ledger'], ['#e5534b', 'follow-up']],
  learn: [
    { t: 'The question the Monitor answers', at: 0 }, { t: 'Which public sources it uses', at: 1 },
    { t: 'How the scope is limited to one vendor and diesel lines', at: 2 }, { t: 'The headline numbers and how to read them', at: 3 },
    { t: 'What the project does not claim', at: 4 }, { t: 'Why this is a marketing-operations exercise in disguise', at: 5 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    s.box('po', 0.6, 1.0, 0, 2.0, 1.6, 1.0, 'green', { label: { t: 'purchase orders', icon: 'file' } });
    s.box('iv', 3.6, 3.0, 0, 2.0, 1.6, 1.0, 'cream', { from: 1, label: { t: 'invoice journal', icon: 'receipt' } });
    s.box('ac', 6.6, 5.0, 0, 2.0, 1.6, 1.0, 'blue', { from: 1, label: { t: 'accounting', icon: 'database' } });
    s.box('mon', 1.0, 6.4, 0, 2.4, 1.8, 1.2, 'white', { from: 3, label: { t: 'monitor', icon: 'search' } });
    s.box('fu', 6.8, 0.8, 0, 1.4, 1.4, 0.8, 'red', { from: 3, label: { t: '16 follow-ups', icon: 'flag' } });
    s.flow('f1', [[2.6, 1.8, 0.05], [3.6, 3.6, 0.05]], 'order', { from: 1 });
    s.flow('f2', [[5.6, 3.8, 0.05], [6.6, 5.6, 0.05]], 'invoice', { from: 1 });
    s.flow('f3', [[3.0, 6.8, 0.05], [6.6, 6.2, 0.05]], 'data', { from: 3 });
    s.card('src', 'PUBLIC SOURCES', list([['City Auditor Data Hub', 'PO lines, invoice journals, accounting'], ['Bid RFQ030275', 'about 600,000 gal per year'], ['Ordinances 1557-2025, 0324-2026', 'award and funding']], { gap: 40 }), { w: 300, h: 148, from: 1, until: 1 });
    s.card('scope', 'SCOPE RULES', list([['Fiscal year 2026', 'orders listed Jan to Oct'], ['Vendor 002166', 'one supplier'], ['Diesel line required', 'tank wagon or transport']], { gap: 36 }), { w: 300, h: 140, from: 2, until: 2 });
    s.card('num', 'SNAPSHOT NUMBERS', bars([
      { label: 'orders', value: SNAP.orders, color: '#b8c940' }, { label: 'matched', value: SNAP.matched, color: '#2a9d8f' }, { label: 'follow-up', value: SNAP.unmatched, color: '#e5534b' },
    ], { w: 300, labelW: 70, max: 360, y0: 36, h: 16, gap: 10, fmt: (v) => `${v}`, note: `data as of ${SNAP.asOf}` }), { w: 300, h: 140, from: 3, until: 3 });
    s.card('lim', 'WHAT IT CANNOT VERIFY', list([['Delivery', 'no bills of lading'], ['Unit price', 'no daily index'], ['Billing accuracy', 'no scanned invoices']], { gap: 36 }), { w: 300, h: 140, from: 4, until: 4 });
  },
  steps: [
    { short: 'Question', tag: 'CASE', title: 'One buyer, one supplier, every order traced', focus: ['po', 'iv'], flows: [],
      body: ['The Columbus Diesel Order Monitor is an independent portfolio case study. It asks a plain question of public records: for one supplier’s diesel orders, which purchase orders have a posted invoice, and which need a follow-up?', 'It is explicitly not affiliated with the City of Columbus, any fuel supplier or any employer, and a follow-up flag means “check the record”, not “billing error”.'],
      callout: { k: 'know', t: 'This is my own project. The lessons in the Work track use it as a worked example of the order-to-cash and data-matching ideas in the Core lessons.' }, stats: { ord: `${SNAP.orders}` } },
    { short: 'Sources', tag: 'DATA', title: 'Three public exports and the documents that frame them', focus: ['po', 'iv', 'ac', 'src'], flows: ['f1', 'f2'],
      body: ['The numbers come from the City Auditor’s Data Hub: purchase-order lines, vendor invoice journals and accounting distributions for fiscal year 2026. The documents that set the context are bid notice RFQ030275, which estimated about 600,000 gallons a year across three diesel products, Ordinance 1557-2025 (the award), and Ordinance 0324-2026 (the later funding authorization).', 'The contract documents are context only. The public order lines do not name the agreement per order, so the project never claims a given order was issued under it.'] },
    { short: 'Scope', tag: 'METHOD', title: 'Scope is a rule you can state in one line', focus: ['po', 'scope'], flows: [],
      body: ['The analysis selects fiscal-year 2026 purchase orders for vendor account 002166 that contain at least one main diesel tank-wagon or transport line. Everything else on those orders, such as tax, additives and biodiesel, stays visible but is kept out of the diesel-gallon figure.', 'A scope this explicit means two people running the same code on the same files get the same list.'],
      callout: { k: 'key', t: 'Write the scope as a filter. If you cannot, the numbers cannot be reproduced.' } },
    { short: 'Numbers', tag: 'NUMBERS', title: 'The headline numbers', focus: ['mon', 'fu', 'num'], flows: ['f3'],
      body: [`${SNAP.orders} supplier purchase orders, ${SNAP.matched} with a posted invoice (${rate.toFixed(1)}%) and ${SNAP.unmatched} follow-ups. Ordered diesel gallons total ${fmt0(SNAP.gallons)}, inferred from quantities because the export has no unit field. Diesel fuel lines add up to ${fmt$(SNAP.fuel)}.`, `Whole-order totals are ${fmt$(SNAP.poTotal)} for purchase orders and ${fmt$(SNAP.invTotal)} for linked invoices. Those include tax and other lines, so they are not diesel-only revenue.`],
      callout: { k: 'warn', t: 'Gallons here are an inference, not delivery. The Monitor says so on the page and in its method.' }, stats: { mat: `${SNAP.matched}`, gal: fmt0(SNAP.gallons), rate: `${rate.toFixed(1)}%` } },
    { short: 'Limits', tag: 'PROBLEM', title: 'What the project refuses to claim', focus: ['lim', 'mon'], flows: [],
      body: ['The public exports do not include bills of lading, scanned invoices, confirmed delivered gallons or daily proprietary fuel index values. So the Monitor cannot certify a unit price, a shipment volume or billing accuracy. It identifies records for follow-up.', 'No matched order reaches the $25 review threshold. That is a statement about the loaded records, not a clean bill of health.'] },
    { short: 'Why it matters', tag: 'ROLE', title: 'The same chain, seen from the buyer’s side', focus: ['po', 'iv', 'ac'], flows: ['f1', 'f2'],
      body: ['A marketing operations analyst at a fuel seller handles the same chain from the other side: customer order, loading record, invoice, ledger. The Monitor shows how to match the records, state the scope, set a threshold, flag exceptions and be honest about what the data cannot prove.', 'The next lessons walk through the joins, the flags, the monthly view and what would change with a seller’s own data.'],
      callout: { k: 'key', t: 'Method over conclusions: the skill on show is how the matching is built and checked.' } },
  ],
};
