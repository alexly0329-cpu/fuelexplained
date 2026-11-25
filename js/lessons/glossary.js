import { table } from './cards.js';

// Core. General industry vocabulary in plain words. Definitions are short on purpose; other lessons show each term in use.
const G = {
  sell: [['Rack price', 'posted price at a loading rack'], ['Contract price', 'benchmark plus a differential'], ['Spot price', 'price for a one-off purchase'], ['Differential', 'premium or discount to benchmark']],
  move: [['Terminal', 'storage site with loading racks'], ['Lifting', 'taking product at the rack'], ['Bill of lading', 'record of what was loaded'], ['Tank wagon', 'small truck; big = transport']],
  prod: [['ULSD', 'ultra-low-sulfur on-road diesel'], ['RBOB', 'gasoline base before ethanol'], ['Biodiesel blend', 'B5 / B20 = 5% / 20% biodiesel'], ['Winterizer', 'cold-weather diesel additive']],
  sup: [['Allocation', 'rationing when supply is tight'], ['Branded', 'sold under a brand flag, or not'], ['Throughput', 'volume a site handles'], ['Turnaround', 'planned refinery maintenance']],
};
const T = (rows) => table(['term', 'plain words'], rows, { cols: [12, 108], y0: 34, rowH: 26, W: 292 });

export default {
  id: 'glossary', group: 'moving', title: 'Fuel Marketing Glossary', icon: 'book', time: 8, level: 'Beginner',
  tagline: 'Sixteen terms you will hear in fuel marketing, in plain words: how fuel is priced, how it moves, what the products are, and how supply is managed.',
  stats: [
    { id: 'a', label: 'Selling terms', icon: 'scale' }, { id: 'b', label: 'Moving terms', icon: 'truck' },
    { id: 'c', label: 'Product terms', icon: 'droplet' }, { id: 'd', label: 'Supply terms', icon: 'factory' },
  ],
  legend: [['#2a9d8f', 'selling'], ['#e8a33a', 'moving'], ['#7c63d0', 'product']],
  learn: [
    { t: 'Four ways fuel is priced and sold', at: 0 }, { t: 'Four terms for how fuel moves', at: 1 },
    { t: 'Four product terms', at: 2 }, { t: 'Four supply-management terms', at: 3 },
  ],
  build(s) {
    s.floor(10, 10, 'cream');
    s.box('a', 0.8, 1.2, 0, 2.0, 2.0, 1.0, 'teal', { label: { t: 'selling', icon: 'scale' } });
    s.box('b', 4.0, 1.2, 0, 2.0, 2.0, 1.0, 'yellow', { from: 1, label: { t: 'moving', icon: 'truck' } });
    s.box('c', 7.0, 1.8, 0, 1.6, 1.6, 0.9, 'violet', { from: 2, label: { t: 'products', icon: 'droplet' } });
    s.box('d', 4.4, 5.6, 0, 2.4, 2.0, 1.1, 'steel', { from: 3, label: { t: 'supply', icon: 'factory' } });
    s.card('ga', 'SELLING', T(G.sell), { w: 300, h: 154, from: 0, until: 0 });
    s.card('gb', 'MOVING', T(G.move), { w: 300, h: 154, from: 1, until: 1 });
    s.card('gc', 'PRODUCTS', T(G.prod), { w: 300, h: 154, from: 2, until: 2 });
    s.card('gd', 'SUPPLY', T(G.sup), { w: 300, h: 154, from: 3, until: 3 });
  },
  steps: [
    { short: 'Selling', tag: 'CONCEPT', title: 'How fuel is priced and sold', focus: ['a', 'ga'], flows: [], stats: { a: '4 terms' },
      body: ['A rack price is the posted price at a terminal’s loading rack. A contract price is an agreed formula, commonly a benchmark plus a differential, which is just a premium or discount. A spot price is for a one-off purchase today.', 'The Rack, Contract and Spot lessons in Moving & pricing show each with numbers.'] },
    { short: 'Moving', tag: 'CONCEPT', title: 'How fuel moves', focus: ['b', 'gb'], flows: [], stats: { b: '4 terms' },
      body: ['Product leaves a terminal when a customer lifts it at the rack, and a bill of lading records what was loaded. A transport load is a full-size tanker; a tank wagon is a smaller truck that delivers to a customer’s own tank.', 'Both words appear on the Diesel Monitor’s order lines, which is why the Monitor counts gallons from lines of those two kinds.'] },
    { short: 'Products', tag: 'CONCEPT', title: 'Product terms', focus: ['c', 'gc'], flows: [], stats: { c: '4 terms' },
      body: ['ULSD is the ultra-low-sulfur diesel grade sold for on-road use. RBOB is the gasoline base that ethanol is blended into. B5 and B20 mean diesel blended with 5% or 20% biodiesel, and a winterizer is an additive that helps diesel flow in the cold.', 'Biodiesel and winterizer lines appear on the Diesel Monitor’s purchase orders; the Taxes, Blends and Add-ons lesson counts them.'] },
    { short: 'Supply', tag: 'CONCEPT', title: 'Supply-management terms', focus: ['d', 'gd'], flows: [], stats: { d: '4 terms' },
      body: ['Allocation is how a supplier rations product when supply is tight, often based on a customer’s past volumes. Branded product is sold under a brand flag and unbranded without one. Throughput is the volume a refinery or terminal handles, and a turnaround is a planned maintenance shutdown.', 'These terms explain a lot of news about refineries: a turnaround can tighten supply and move prices even when demand is steady.'],
      callout: { k: 'know', t: 'Use a term only when you can say it in plain words. Interviewers notice the difference immediately.' } },
  ],
};
