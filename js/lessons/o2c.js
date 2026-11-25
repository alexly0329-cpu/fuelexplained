import { table, list, code } from './cards.js';

// Core. A general order-to-cash walk-through for fuel marketing. Records and numbers are INVENTED teaching examples;
// the real public-record version of this chain is in the Work lessons.
const ORD = 8000, LOADED = 7998, PRICE = 2.46;
const inv = LOADED * PRICE;

export default {
  id: 'o2c', group: 'mktops', title: 'Order to Cash', icon: 'receipt', time: 11, level: 'Beginner',
  tagline: 'Follow one fuel order from request to payment, and see which record each step leaves behind.',
  stats: [
    { id: 'ord', label: 'Ordered (gal)', icon: 'file' }, { id: 'ld', label: 'Loaded (gal)', icon: 'truck' },
    { id: 'px', label: 'Price ($/gal)', icon: 'chart' }, { id: 'amt', label: 'Invoice ($)', icon: 'receipt' },
  ],
  legend: [['#b8c940', 'order'], ['#e8a33a', 'product'], ['#2a9d8f', 'invoice'], ['#7c63d0', 'record']],
  learn: [
    { t: 'The six steps from order to cash', at: 0 }, { t: 'What an order record holds', at: 1 },
    { t: 'Why loaded volume can differ from ordered volume', at: 2 }, { t: 'How price is attached to a lifting', at: 3 },
    { t: 'What an invoice adds', at: 4 }, { t: 'What payment and the ledger record', at: 5 },
    { t: 'What a three-way match checks', at: 6 },
  ],
  build(s) {
    s.floor(10, 10, 'cream');
    s.box('ord', 0.6, 0.8, 0, 1.6, 1.4, 0.9, 'green', { label: { t: 'order', icon: 'file' } });
    s.box('rack', 3.0, 2.2, 0, 1.4, 1.6, 1.2, 'steel', { from: 2, label: { t: 'terminal', icon: 'truck' } });
    s.box('prc', 5.2, 1.0, 0, 1.4, 1.4, 0.9, 'violet', { from: 3, label: { t: 'price', icon: 'chart' } });
    s.box('inv', 6.4, 3.6, 0, 1.6, 1.4, 1.0, 'cream', { from: 4, label: { t: 'invoice', icon: 'receipt' } });
    s.box('pay', 4.0, 6.0, 0, 1.6, 1.4, 1.0, 'white', { from: 5, label: { t: 'payment', icon: 'scale' } });
    s.box('led', 7.4, 7.0, 0, 1.6, 1.4, 1.0, 'blue', { from: 5, label: { t: 'ledger', icon: 'database' } });
    s.flow('f1', [[2.2, 1.6, 0.05], [3.2, 2.8, 0.05]], 'order', { from: 1 });
    s.flow('f2', [[4.4, 2.8, 0.05], [5.4, 2.0, 0.05]], 'gasoline', { from: 2 });
    s.flow('f3', [[6.4, 1.8, 0.05], [7.2, 3.6, 0.05]], 'data', { from: 3 });
    s.flow('f4', [[7.2, 5.0, 0.05], [5.6, 6.4, 0.05]], 'invoice', { from: 4 });
    s.flow('f5', [[5.6, 6.8, 0.05], [7.4, 7.4, 0.05]], 'invoice', { from: 5 });
    s.card('o', 'ORDER RECORD (invented)', code([`order_id   A-1001`, `customer   Acme Fleet`, `product    ULSD`, `terminal   T-101`, `ordered    ${ORD} gal`, `price rule index + $0.06`], { y0: 38, gap: 15 }), { w: 300, h: 140, from: 1, until: 1 });
    s.card('v', 'ORDERED vs LOADED', table(['record', 'gallons'], [['order A-1001', `${ORD}`], ['bill of lading', `${LOADED}`], ['difference', `${LOADED - ORD}`]], { cols: [12, 200], y0: 34, rowH: 24, W: 292 }), { w: 300, h: 120, from: 2, until: 2 });
    s.card('i', 'INVOICE MATH', code([`${LOADED} gal x $${PRICE.toFixed(2)} = $${inv.toFixed(2)}`, ``, `plus taxes and fees where billed,`, `one invoice may cover several loads`], { y0: 38, gap: 16 }), { w: 300, h: 120, from: 4, until: 4 });
    s.card('m', 'THREE-WAY MATCH', list([['Order', 'what was agreed'], ['Delivery', 'what was loaded'], ['Invoice', 'what was billed']], { gap: 36 }), { w: 300, h: 132, from: 6, until: 6 });
  },
  steps: [
    { short: 'The chain', tag: 'CONCEPT', title: 'Six steps, six kinds of record', focus: ['ord', 'rack', 'prc', 'inv', 'pay', 'led'], flows: ['f1', 'f2', 'f3', 'f4', 'f5'],
      body: ['Order to cash is the path from a customer’s request to money in the bank: order, loading, pricing, invoice, payment and the accounting entry that records it.', 'Each step is usually owned by a different team and stored in a different system. Marketing operations analysts spend much of their time joining those records back together.'], stats: { ord: '' } },
    { short: 'Order', tag: 'DATA', title: 'The order says what was agreed', focus: ['ord', 'o'], flows: ['f1'],
      body: ['An order record holds the customer, product, quantity, delivery point, requested date and the pricing rule that applies. The example is invented and compact; real orders have many more fields and often several lines.', 'The order id is the key that everything downstream should carry.'], stats: { ord: `${ORD}` } },
    { short: 'Loading', tag: 'DATA', title: 'The terminal records what actually loaded', focus: ['ord', 'rack', 'v'], flows: ['f1', 'f2'],
      body: [`A truck rarely loads exactly the ordered volume. In the example the order was ${ORD.toLocaleString()} gallons and the bill of lading shows ${LOADED.toLocaleString()}.`, 'Which one to invoice depends on the contract, so reports must say whether a volume is ordered or loaded.'],
      callout: { k: 'warn', t: 'Ordered and delivered volumes are different facts. Treat them as separate columns, never as one “quantity”.' }, stats: { ld: `${LOADED}` } },
    { short: 'Price', tag: 'NUMBERS', title: 'Price is attached from the contract rule', focus: ['rack', 'prc'], flows: ['f2', 'f3'],
      body: ['The pricing rule, such as an index plus an adder, is applied using a benchmark for the right date and place. If the benchmark is posted at a different time than the lifting, the date used matters.', 'The previous lessons covered rack, spot and contract prices. Here the result is one number: dollars per gallon.'], stats: { px: `$${PRICE.toFixed(2)}` } },
    { short: 'Invoice', tag: 'NUMBERS', title: 'The invoice turns volume and price into dollars', focus: ['prc', 'inv', 'i'], flows: ['f3', 'f4'],
      body: [`Loaded volume times price gives $${inv.toFixed(2)} in the example. Real invoices add taxes, fees and additives as separate lines, and one invoice can cover several loads or several orders.`, 'That one-to-many shape is the main reason joins go wrong, which the next lesson explains.'], stats: { amt: `$${inv.toLocaleString('en-US', { maximumFractionDigits: 0 })}` } },
    { short: 'Cash', tag: 'DATA', title: 'Payment and the accounting entry close the loop', focus: ['inv', 'pay', 'led'], flows: ['f4', 'f5'],
      body: ['When the customer pays, the payment is matched to the invoice. The accounting system records the amount against accounts and cost centers, often as several distribution lines per invoice.', 'These ledger lines are the last place a record can be checked against the order. Their amounts should add back up to the invoice.'] },
    { short: 'Match', tag: 'METHOD', title: 'A three-way match checks the whole chain', focus: ['ord', 'rack', 'inv', 'm'], flows: ['f1', 'f2', 'f4'],
      body: ['A three-way match compares the order, the delivery record and the invoice. Quantities, prices and parties should agree within agreed tolerances.', 'Real data rarely matches perfectly. The craft is deciding which differences are normal, which need a person to look, and writing that rule down.'],
      callout: { k: 'key', t: 'The analyst’s job is not to find perfect data. It is to make the exceptions visible and explainable.' } },
  ],
};
