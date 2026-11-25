import { table, list } from './cards.js';

// Core. Spot, OTC, futures, contango and backwardation follow the Duke course notes (Types of Prices); rack and contract benchmarks are from OPIS.
// Dollar and curve figures are ILLUSTRATIVE.
const MONTHS = [1, 6, 12, 18];
const CONTANGO = [70, 72, 74, 75.5], BACK = [74, 72, 70.5, 69.5];
const INDEX = 2.4, ADDER = 0.06, GAL = 8000;
const price = INDEX + ADDER;
const curve = (vals, color, y0) => {
  const lo = 66, hi = 78, pts = vals.map((v, i) => [30 + i * 80, y0 + 70 - ((v - lo) / (hi - lo)) * 60]);
  return `<path d="M${pts.map((p) => p.join(',')).join('L')}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>` + pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="${color}" stroke="var(--obj-edge)" stroke-width="1.2"/>`).join('');
};

export default {
  id: 'prices', group: 'moving', title: 'Spot, Rack, Contract and Futures', icon: 'chart', time: 12, level: 'Intermediate',
  tagline: 'One fuel, four prices. How the number on an invoice is built from futures, spot, a rack benchmark and a negotiated adder.',
  stats: [
    { id: 'idx', label: 'Index (illustr. $/gal)', icon: 'chart' }, { id: 'add', label: 'Adder', icon: 'scale' },
    { id: 'px', label: 'Contract price', icon: 'receipt' }, { id: 'inv', label: 'Order value', icon: 'file' },
  ],
  legend: [['#7c63d0', 'price signal'], ['#e8a33a', 'product'], ['#2a9d8f', 'invoice']],
  learn: [
    { t: 'The chain from futures to retail', at: 0 }, { t: 'What a spot price is, and that it has no floor', at: 1 },
    { t: 'How spot is estimated: OTC reports and futures', at: 2 }, { t: 'What a rack price is', at: 3 },
    { t: 'How a contract references an index plus an adder', at: 4 }, { t: 'How to read contango and backwardation', at: 5 },
    { t: 'Why pump prices lag crude', at: 6 },
  ],
  build(s) {
    s.floor(10, 10, 'cream');
    s.box('fut', 0.8, 0.8, 0, 1.8, 1.6, 1.0, 'violet', { label: { t: 'futures', icon: 'chart' } });
    s.box('spot', 3.4, 2.4, 0, 1.8, 1.6, 1.0, 'violet', { from: 1, label: { t: 'spot', icon: 'clock' } });
    s.box('rack', 5.6, 4.4, 0, 1.8, 1.6, 1.0, 'orange', { from: 3, label: { t: 'rack', icon: 'truck' } });
    s.box('ret', 7.4, 6.6, 0, 1.6, 1.4, 0.9, 'green', { from: 6, label: { t: 'retail', icon: 'house' } });
    s.box('con', 1.0, 6.2, 0, 2.0, 1.6, 1.1, 'white', { from: 4, label: { t: 'contract', icon: 'file' } });
    s.flow('f1', [[2.6, 1.8, 0.05], [3.4, 3.0, 0.05]], 'data', { from: 1 });
    s.flow('f2', [[5.2, 3.4, 0.05], [5.6, 5.0, 0.05]], 'data', { from: 3 });
    s.flow('f3', [[7.4, 5.8, 0.05], [8.2, 6.6, 0.05]], 'gasoline', { from: 6 });
    s.flow('f4', [[3.0, 6.9, 0.05], [5.6, 5.6, 0.05]], 'invoice', { from: 4 });
    s.card('chain', 'THE PRICE CHAIN (OPIS)', list([['Futures', 'exchange, standardized'], ['Spot', 'bulk, immediate'], ['Rack', 'terminal, truckload'], ['Retail', 'the pump']], { gap: 31 }), { w: 300, h: 156, from: 0, until: 0 });
    s.card('src', 'HOW SPOT IS FOUND', table(['source', 'nature', 'visible?'], [['OTC deals', 'private', 'via Platts, Argus'], ['Futures', 'exchange', 'public (NYMEX, ICE)']], { cols: [12, 90, 160], y0: 34, rowH: 24, W: 292 }), { w: 300, h: 100, from: 2, until: 2 });
    s.card('curve', 'FORWARD CURVE · illustrative $/bbl', `<path class="ax" d="M20,118H290"/>${curve(CONTANGO, '#e5534b', 30)}${curve(BACK, '#2a9d8f', 30)}${MONTHS.map((m, i) => `<text x="${30 + i * 80}" y="132" text-anchor="middle" style="font-size:8px">${m} mo</text>`).join('')}<text x="206" y="48" style="font-size:8.5px;fill:#e5534b">contango</text><text x="12" y="44" style="font-size:8.5px;fill:#2a9d8f">backwardation</text>`, { w: 300, h: 144, from: 5, until: 5 });
  },
  steps: [
    { short: 'The chain', tag: 'CONCEPT', title: 'Futures lead spot, spot leads rack, rack leads retail', focus: ['fut', 'chain'], flows: [],
      body: ['OPIS describes a price chain: oil futures affect spot markets, spot affects rack markets, and rack ultimately affects the retail price a consumer sees.', 'Each link has a different buyer, size and speed. Knowing which link a number comes from is the first thing to check.'] },
    { short: 'Spot', tag: 'CONCEPT', title: 'Spot means immediate delivery and payment', focus: ['fut', 'spot'], flows: ['f1'],
      body: ['The Duke notes define spot as the price for immediate delivery, in hours to days, with immediate payment. It reflects the current physical balance of supply and demand: full tanks push it down, a refiner running short pushes it up.', 'There is no physical spot market floor. It is a concept, not a place.'] },
    { short: 'Finding it', tag: 'CONCEPT', title: 'Reporters and exchanges reveal the spot price', focus: ['fut', 'spot', 'src'], flows: ['f1'],
      body: ['Over-the-counter deals are private, so price-reporting agencies such as Platts and Argus survey companies to estimate the price. Futures contracts trade publicly on exchanges like NYMEX and ICE with everything pre-set: quantity, location and date.', 'The notes add that a one-month futures price is often used as a proxy for the current spot price.'] },
    { short: 'Rack', tag: 'CONCEPT', title: 'The rack is the wholesale price at a terminal', focus: ['spot', 'rack'], flows: ['f2'],
      body: ['OPIS says spot prices directly influence rack prices. Rack is the common word for the wholesale fuel market, where product is bought at terminals, and OPIS is the most widely accepted benchmark for rack prices used in supply contracts.', 'Suppliers post a rack price for each product at each terminal. A rack price is for truckload quantities and excludes taxes and freight.'] },
    { short: 'Contract', tag: 'NUMBERS', title: 'A contract price = an index plus an adder', focus: ['rack', 'con'], flows: ['f4'],
      body: [`OPIS describes its rack benchmarks as the reference for wholesale supply contracts. In practice a contract may say “index plus a fixed adder”. With an illustrative index of $${INDEX.toFixed(2)} a gallon and a $${ADDER.toFixed(2)} adder, the price is $${price.toFixed(2)}, so a ${GAL.toLocaleString()}-gallon load is worth $${(price * GAL).toLocaleString('en-US', { maximumFractionDigits: 0 })}.`, 'OPIS publishes benchmark times such as a 10:00 a.m. ET contract average, so a contract must also say which benchmark time applies.'],
      callout: { k: 'know', t: 'The index and adder here are invented to show the arithmetic. Real contract terms are confidential to the parties.' }, stats: { idx: `$${INDEX.toFixed(2)}`, add: `$${ADDER.toFixed(2)}`, px: `$${price.toFixed(2)}`, inv: `$${(price * GAL).toLocaleString('en-US', { maximumFractionDigits: 0 })}` } },
    { short: 'The curve', tag: 'CONCEPT', title: 'Contango and backwardation', focus: ['fut', 'curve'], flows: [],
      body: ['A forward curve plots the price for delivery in one month, six months, eighteen months and so on. In backwardation the curve slopes down: future prices are lower than today, which signals a sell-now market.', 'In contango it slopes up. If storage is cheap, you can buy now, store and sell later for a locked-in profit.'],
      callout: { k: 'key', t: 'Spot tells you about physical scarcity right now. The curve tells you what the market expects next.' } },
    { short: 'The lag', tag: 'CONCEPT', title: 'Why the pump price lags', focus: ['ret', 'rack'], flows: ['f3'],
      body: ['The supply chain is full of inventory in tanks and pipelines, and it takes weeks to move crude to a refinery and product to a station. The Duke notes conclude that pump prices usually lag crude markets by a few weeks.', 'For a data analyst, this lag shows up when you compare dates: an order priced on one day may reflect a market move from earlier.'] },
  ],
};
