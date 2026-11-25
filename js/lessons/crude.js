import { bars, table } from './cards.js';
import { ring } from './common.js';

// Core. Product stack and the 46% gasoline share come from the Duke course notes (Crude Oil Distillation); the 42-gallon barrel from EIA.
const GAL = 42, GASOLINE = 0.46;
const STACK = [
  ['LPG', '3–4', 'propane, butane'], ['Naphtha', '4–12', 'gasoline, plastics'], ['Kerosene', '12–16', 'jet fuel'],
  ['Distillates', '15–18', 'diesel, heating oil'], ['Heavy oil', '19+', 'bunker fuel, lube'], ['Residuals', '25+', 'asphalt, wax'],
];
const TANKS = [['lpg', 'LPG', 'white', 7.3, 7.6, 5.1, 'gas'], ['nap', 'naphtha', 'yellow', 7.3, 5.9, 4.3, 'gasoline'], ['ker', 'kerosene', 'blue', 7.3, 4.2, 3.4, 'jet'], ['dist', 'distillates', 'flame', 7.3, 2.5, 2.5, 'diesel'], ['hfo', 'heavy oil', 'dark', 7.3, 0.9, 1.6, 'resid']];

export default {
  id: 'crude', group: 'barrel', title: 'Crude In, Products Out', icon: 'droplet', time: 10, level: 'Beginner',
  tagline: 'A refinery is a sorting machine: heat crude, let it rise through a tower, and catch each product at the height where it turns back into liquid.',
  stats: [
    { id: 'gal', label: 'Gallons per barrel', icon: 'droplet' }, { id: 'gas', label: 'Gasoline share (US)', icon: 'gauge' },
    { id: 'gasgal', label: 'Gasoline gallons', icon: 'flame' }, { id: 'top', label: 'Lightest product', icon: 'thermo' },
  ],
  legend: [['#3b2f26', 'crude'], ['#e8a33a', 'gasoline'], ['#c2793a', 'diesel'], ['#5f9ccb', 'jet'], ['#6a6c64', 'heavy']],
  learn: [
    { t: 'Why crude oil is a “soup” of different molecules', at: 0 }, { t: 'What the furnace does before the tower', at: 1 },
    { t: 'Why products separate by height in the tower', at: 2 }, { t: 'The product stack from LPG to asphalt', at: 3 },
    { t: 'How much of a US barrel becomes gasoline', at: 4 }, { t: 'What distillation alone cannot do', at: 5 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    s.cyl('ctank', 1.2, 1.6, 0, 1.0, 1.1, 'black', { label: { t: 'crude tank', icon: 'droplet' } });
    s.box('furn', 0.7, 5.2, 0, 1.4, 1.4, 1.1, 'flame', { from: 1, label: { t: 'furnace', icon: 'flame' }, extra: `<g class="flicker" style="transform-box:fill-box;transform-origin:50% 100%"></g>` });
    s.cyl('tower', 4.2, 4.6, 0, 0.95, 5.6, 'steel', { label: { t: 'distillation tower', icon: 'factory' }, from: 2, k: 40 });
    [1.2, 2.2, 3.2, 4.2, 5.0].forEach((z, i) => s.raw('tr' + i, ring(4.2, 4.6, z, 0.95), { from: 2, k: 41 + i }));
    TANKS.forEach(([id, name, col, x, y, , kind], i) => s.cyl(id, x, y, 0, 0.55, 0.9, col, { from: 3, label: { t: name }, lopt: { dy: -16 } }));
    s.flow('f-in', [[1.9, 2.2, 0.05], [1.9, 5.2, 0.05], [2.1, 5.7, 0.05]], 'crude', { pipe: true, from: 0, until: 1 });
    s.flow('f-hot', [[2.1, 6.1, 0.9], [3.7, 5.6, 0.9], [4.0, 5.1, 0.9]], 'crude', { pipe: true, from: 1 });
    TANKS.forEach(([id, , , x, y, z, kind]) => s.flow('o-' + id, [[5.1, 4.7, z], [6.0, y + 0.3, z], [x - 0.8, y + 0.3, 0.7]], kind === 'gas' ? 'gasoline' : kind, { pipe: true, from: 3 }));
    s.card('stack', 'PRODUCT STACK · carbon atoms per chain', table(['product', 'carbons', 'main use'], STACK, { cols: [12, 92, 150], y0: 34, rowH: 19, W: 292 }), { w: 300, h: 158, from: 3, until: 3 });
    s.card('barrel', 'ONE US BARREL (42 gal)', bars([
      { label: 'gasoline', value: GAL * GASOLINE, color: '#e8a33a' }, { label: 'everything else', value: GAL * (1 - GASOLINE), color: '#bfbfb2' },
    ], { w: 300, labelW: 96, max: GAL, y0: 36, h: 18, gap: 12, fmt: (v) => v.toFixed(1), note: `about ${Math.round(GAL * GASOLINE)} gallons of gasoline per barrel` }), { w: 300, h: 120, from: 4, until: 4 });
  },
  steps: [
    { short: 'The soup', tag: 'CONCEPT', title: 'Crude oil is a soup of hydrocarbons', focus: ['ctank'], flows: ['f-in'],
      body: ['Crude oil is not one substance. It is a mix of hydrocarbon molecules, chains of carbon atoms of many different lengths, from short chains that behave like gas to very long chains that behave like tar.', 'You cannot burn crude in a car. The refinery’s job is to separate that soup into useful pieces and, as later lessons show, to reshape some of them.'],
      callout: { k: 'key', t: 'The number of carbon atoms in a chain decides what the molecule is good for: short chains are light and volatile, long chains are heavy and sticky.' }, stats: { gal: GAL } },
    { short: 'Heat it', tag: 'CONCEPT', title: 'The furnace boils the crude', focus: ['ctank', 'furn'], flows: ['f-in', 'f-hot'],
      body: ['Crude is heated, mixed with superheated steam, and enters the bottom of the tower as a hot vapor.', 'Refining is described in the course notes as cooking and cooling: first you boil everything, then you cool it back down in a controlled way.'] },
    { short: 'Rise & cool', tag: 'CONCEPT', title: 'The vapor rises and cools', focus: ['tower', 'furn'], flows: ['f-hot'],
      body: ['Inside the tower the vapor rises, and the higher it goes, the cooler it gets. Each kind of molecule turns back into a liquid at its own temperature, so each settles out at its own height.', 'Trays at set levels catch the liquid. Small perforated bubble caps on each tray act like a loosened soda cap: vapor can fizz up through the holes while the liquid is caught.'],
      callout: { k: 'know', t: 'Rule of thumb: short chains have low boiling points and rise to the top; long chains have high boiling points and sink to the bottom.' } },
    { short: 'The stack', tag: 'CONCEPT', title: 'Six layers, top to bottom', focus: ['tower', 'lpg', 'nap', 'ker', 'dist', 'hfo', 'stack'], flows: ['o-lpg', 'o-nap', 'o-ker', 'o-dist', 'o-hfo'],
      body: ['From the top: LPG (3–4 carbons, propane and butane), naphtha (4–12, the raw material for gasoline and plastics), kerosene (12–16, jet fuel and heating), distillates (15–18, diesel and heating oil), heavy oil and lubricants (19+), and residuals (25+, asphalt and wax) at the very bottom.', 'In the course notes, diesel is called the primary European fuel and gasoline the primary US fuel, which is why refineries tune their output differently by region.'],
      stats: { top: 'LPG' } },
    { short: 'The barrel', tag: 'NUMBERS', title: 'About 46% of a US barrel is gasoline', focus: ['barrel'], flows: [],
      body: [`A barrel holds ${GAL} US gallons. US refineries are set up to maximize gasoline, which the course notes put at 46% of the barrel, roughly ${Math.round(GAL * GASOLINE)} gallons.`, 'The rest becomes diesel, jet fuel and other products. Exact shares change by refinery, crude type and season; treat 46% as an average, not a promise.'],
      callout: { k: 'warn', t: 'A yield is an average for a whole industry. A specific refinery’s yield depends on its units and on the crude it buys.' }, stats: { gas: '46%', gasgal: `${(GAL * GASOLINE).toFixed(1)} gal` } },
    { short: 'Why light wins', tag: 'CONCEPT', title: 'Light crude gives more of the valuable cuts', focus: ['ctank', 'tower'], flows: [],
      body: ['Light, low-viscosity crude already contains more short chains, so more of it lands in the gasoline and jet range. Heavy crude contains more long chains, so more of it lands in the heavy-oil and residual layers.', 'That is why crude quality drives price, which the next lesson covers.'] },
    { short: 'Limits', tag: 'CONCEPT', title: 'Distillation only sorts what is already there', focus: ['tower', 'hfo'], flows: ['o-hfo'],
      body: ['A simple refinery can only separate. If the crude holds a lot of heavy material, the refinery ends up with a lot of low-value heavy product.', 'Advanced refineries add units that break and reshape molecules. That is the topic of the conversion lesson, and it is why a refinery that can process cheap, heavy crude can earn more than one that cannot.'],
      callout: { k: 'key', t: 'Distillation separates. Conversion manufactures. The margin is made in the second part.' } },
  ],
};
