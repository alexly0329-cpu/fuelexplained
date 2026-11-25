import { table, list, code } from './cards.js';

// Core. Rack facts (truck-and-trailer of about 8,000 gallons; rack prices exclude taxes and freight; racks sit at terminals often along a pipeline)
// are from OPIS. "Lifting" and the sample records are plain-language teaching examples, not a real company's data.
const LOAD = 8000, DIESEL_ORDER = 379459;
const SAMPLE = [['T-101', 'ULSD', '7,998', 'Acme Fleet'], ['T-101', 'ULSD', '8,004', 'Acme Fleet'], ['T-102', 'Reg 87', '8,010', 'Corner Fuel'], ['T-101', 'B20', '3,500', 'City Garage']];

export default {
  id: 'terminals', group: 'moving', title: 'Terminals, Racks and Liftings', icon: 'truck', time: 10, level: 'Beginner',
  tagline: 'The terminal is where bulk product becomes a customer’s truckload. This is where most marketing-operations records are born.',
  stats: [
    { id: 'load', label: 'Truckload (gal)', icon: 'truck' }, { id: 'trucks', label: 'Loads in 379k gal', icon: 'gauge' },
    { id: 'tax', label: 'In rack price?', icon: 'receipt' }, { id: 'recs', label: 'Records per lifting', icon: 'file' },
  ],
  legend: [['#e8a33a', 'gasoline'], ['#c2793a', 'diesel'], ['#7c63d0', 'records'], ['#5f9ccb', 'pipeline']],
  learn: [
    { t: 'What a terminal and a rack are', at: 0 }, { t: 'What a lifting is and what a bill of lading records', at: 1 },
    { t: 'How big a typical rack transaction is', at: 2 }, { t: 'What a rack price leaves out', at: 3 },
    { t: 'Who buys at the rack', at: 4 }, { t: 'What a lifting record looks like', at: 5 },
    { t: 'Questions to ask about any volume field', at: 6 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    s.line('pipe', [[0.4, 3.2, 0.05], [3.0, 3.2, 0.05]], { w: 5 });
    s.cyl('tk1', 3.6, 1.6, 0, 0.8, 1.5, 'white', { label: { t: 'storage tanks', icon: 'database' } });
    s.cyl('tk2', 3.6, 4.0, 0, 0.8, 1.5, 'white');
    s.box('rack', 6.0, 2.0, 0, 0.9, 2.4, 1.2, 'steel', { from: 1, label: { t: 'loading rack', icon: 'gauge' } });
    s.box('truck', 8.0, 2.6, 0, 1.0, 1.6, 0.9, 'white', { from: 1, label: { t: 'truck', icon: 'truck' } });
    s.box('off', 1.0, 6.6, 0, 1.8, 1.4, 1.0, 'cream', { from: 5, label: { t: 'order system', icon: 'file' } });
    s.box('cust', 6.0, 6.6, 0, 1.8, 1.4, 1.0, 'green', { from: 4, label: { t: 'customers', icon: 'house' } });
    s.flow('f-in', [[0.4, 3.2, 0.05], [3.0, 3.2, 0.05]], 'jet', { pipe: true, from: 0 });
    s.flow('f-tk', [[4.6, 2.8, 0.05], [6.0, 3.1, 0.05]], 'gasoline', { pipe: true, from: 1 });
    s.flow('f-tr', [[6.9, 3.1, 0.05], [8.0, 3.3, 0.05]], 'diesel', { pipe: true, from: 1 });
    s.flow('f-rec', [[8.4, 4.6, 0.05], [8.2, 6.6, 0.05], [2.8, 7.2, 0.05]], 'data', { from: 5 });
    s.flow('f-cu', [[8.4, 4.6, 0.05], [7.4, 6.6, 0.05]], 'invoice', { from: 4, until: 4 });
    s.card('mix', 'WHO PULLS FROM A RACK (OPIS)', list([['Jobbers & marketers', 'resell to others'], ['Retailers', 'stations'], ['Fleets & municipalities', 'own use']], { gap: 36 }), { w: 300, h: 132, from: 4, until: 4 });
    s.card('prc', 'RACK PRICE vs DELIVERED', table(['item', 'in rack price?'], [['fuel at the terminal', 'yes'], ['taxes', 'no (OPIS)'], ['freight to the site', 'no (OPIS)']], { cols: [12, 190], y0: 34, rowH: 24, W: 292 }), { w: 300, h: 130, from: 3, until: 3 });
    s.card('rec', 'SAMPLE LIFTING RECORDS (invented)', table(['terminal', 'product', 'gallons', 'customer'], SAMPLE, { cols: [12, 74, 138, 196], y0: 34, rowH: 20, W: 292 }), { w: 300, h: 150, from: 5, until: 5 });
    s.card('chk', 'ASK ABOUT ANY VOLUME', list([['Unit', 'gallons or barrels?'], ['Basis', 'gross or adjusted?'], ['Source', 'ordered or loaded?'], ['Time', 'which date field?']], { gap: 32 }), { w: 300, h: 160, from: 6, until: 6 });
  },
  steps: [
    { short: 'Terminal', tag: 'CONCEPT', title: 'A terminal stores bulk fuel and sells it by the truckload', focus: ['pipe', 'tk1', 'tk2'], flows: ['f-in'],
      body: ['A terminal is a tank farm, often fed by a pipeline, where fuel is stored until it is sold. OPIS defines a rack as a fuel distribution point, usually along a pipeline, where fuel is supplied and stored.', 'Rack is also the common industry word for the wholesale market itself: the price posted at a terminal for a truckload of product.'] },
    { short: 'Lifting', tag: 'CONCEPT', title: 'A lifting is one truck loading at the rack', focus: ['tk1', 'rack', 'truck'], flows: ['f-tk', 'f-tr'],
      body: ['In plain terms, a lifting is a customer’s truck pulling a load from a terminal. The loading rack meters the product and a bill of lading records what was loaded, when, from where and for whom.', 'OPIS notes that some customers own their trucks and others hire common carriers, which then deliver to a customer’s tank or retail site.'], stats: { recs: '5+' } },
    { short: 'Load size', tag: 'NUMBERS', title: 'A rack load is about 8,000 gallons', focus: ['rack', 'truck'], flows: ['f-tr'],
      body: [`OPIS says rack transactions are typically truck-and-trailer quantities of approximately ${LOAD.toLocaleString()} gallons, far smaller than the high-volume spot trades that move product between companies.`, `For scale, the Columbus case study later in this site counts 379,459 ordered diesel gallons, about ${Math.round(DIESEL_ORDER / LOAD)} truckloads, across the whole of 2026 so far.`],
      stats: { load: '~8,000', trucks: `${Math.round(DIESEL_ORDER / LOAD)}` } },
    { short: 'Rack price', tag: 'CONCEPT', title: 'The rack price is not the delivered price', focus: ['prc'], flows: [],
      body: ['OPIS says rack prices do not include taxes or the freight needed to carry fuel from the rack to a retail station. A delivered price adds both.', 'If an analyst compares a rack index to an invoice, the difference is not necessarily an error. It may be tax, freight, an additive or a negotiated adder.'],
      callout: { k: 'warn', t: 'Always ask what a price includes before calling a gap a variance.' }, stats: { tax: 'No' } },
    { short: 'Buyers', tag: 'CONCEPT', title: 'Who lifts product', focus: ['cust', 'mix'], flows: ['f-cu'],
      body: ['OPIS lists suppliers, jobbers, retailers, municipalities and financial institutions as users of rack prices. A jobber or marketer resells to others; fleets and cities buy for their own use.', 'OPIS also notes that a station owner, a fleet buyer or a city bidding for fuel is most likely billed off an OPIS price.'] },
    { short: 'The record', tag: 'DATA', title: 'What a lifting record looks like', focus: ['off', 'rec'], flows: ['f-rec'],
      body: ['A lifting becomes a row: terminal, product, gallons, customer, date and a ticket or bill-of-lading number. The sample table is invented to show the shape, not any real company’s data.', 'Notice that the first two rows are close to 8,000 but not equal. Real loads vary, so exact-match logic on gallons will fail.'] },
    { short: 'Questions', tag: 'METHOD', title: 'Four questions for any volume field', focus: ['chk'], flows: [],
      body: ['Is the unit gallons or barrels? Is the volume gross or adjusted for temperature? Does it record what was ordered or what was loaded? Which of several dates does the report use?', 'Each question changes a total. The case-study lessons show a real example where a quantity is only an inference because the source has no unit field and no delivery proof.'],
      callout: { k: 'key', t: 'Good analysts write the answers to these four questions next to the number.' } },
  ],
};
