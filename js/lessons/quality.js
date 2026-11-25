import { bars, table, code } from './cards.js';

// Core. Sweet/sour and light/heavy, API gravity and benchmarks follow the Duke course notes (Benchmark Costs) and EIA definitions.
// The price differences below are ILLUSTRATIVE round numbers, not market quotes.
const api = (sg) => 141.5 / sg - 131.5;
const CRUDES = [['WTI-type', 'light', 'sweet', 40], ['Heavy sour', 'heavy', 'sour', 20]];
const PRICE = { bench: 70, medium: 66, heavy: 58 };

export default {
  id: 'quality', group: 'barrel', title: 'Sweet, Sour, Light, Heavy', icon: 'gauge', time: 10, level: 'Beginner',
  tagline: 'Two measurements, sulfur and density, explain why one barrel of crude sells for more than another.',
  stats: [
    { id: 'api', label: 'API gravity', icon: 'gauge' }, { id: 'sul', label: 'Sulfur line', icon: 'flame' },
    { id: 'disc', label: 'Heavy discount (illustr.)', icon: 'chart' }, { id: 'bench', label: 'Benchmarks', icon: 'pin' },
  ],
  legend: [['#fde3a7', 'light, sweet'], ['#f7a35c', 'medium'], ['#35322f', 'heavy, sour'], ['#9fcdf0', 'refinery']],
  learn: [
    { t: 'The two quality dials of crude oil', at: 0 }, { t: 'How API gravity is calculated and read', at: 1 },
    { t: 'What sweet and sour mean, and why sulfur costs money', at: 2 }, { t: 'Why light crude is worth more', at: 3 },
    { t: 'What a benchmark crude is', at: 4 }, { t: 'How a discount to the benchmark works', at: 5 },
    { t: 'Why heavy crude matters to a heavy-oil refiner', at: 6 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    s.cyl('lt', 1.6, 1.6, 0, 0.9, 1.5, 'yellow', { label: { t: 'light, sweet', icon: 'droplet' } });
    s.cyl('md', 1.6, 4.6, 0, 0.9, 1.5, 'flame', { from: 3, label: { t: 'medium' } });
    s.cyl('hv', 1.6, 7.6, 0, 0.9, 1.5, 'black', { from: 2, label: { t: 'heavy, sour', icon: 'droplet' } });
    s.box('ref', 6.4, 3.6, 0, 2.2, 2.2, 1.6, 'blue', { label: { t: 'refinery', icon: 'factory' } });
    s.box('bm', 4.4, 0.6, 0, 1.6, 1.2, 0.8, 'white', { from: 4, label: { t: 'benchmark price', icon: 'pin' } });
    s.flow('f-lt', [[2.7, 1.8, 0.05], [5.6, 3.8, 0.05], [6.4, 4.2, 0.05]], 'gasoline', { pipe: true });
    s.flow('f-md', [[2.7, 4.6, 0.05], [6.4, 4.7, 0.05]], 'diesel', { pipe: true, from: 3 });
    s.flow('f-hv', [[2.7, 7.6, 0.05], [5.4, 6.2, 0.05], [6.4, 5.4, 0.05]], 'resid', { pipe: true, from: 2 });
    s.card('api', 'API GRAVITY', code([`degrees API = 141.5 / SG - 131.5`, ``, `SG 0.83 -> ${api(0.83).toFixed(1)}  (light)`, `SG 0.92 -> ${api(0.92).toFixed(1)}  (medium)`, `SG 0.96 -> ${api(0.96).toFixed(1)}  (heavy)`, ``, `higher API = lighter oil`], { y0: 38, gap: 14 }), { w: 300, h: 140, from: 1, until: 1 });
    s.card('sw', 'SULFUR LINE (EIA)', table(['', 'sulfur', 'price'], [['sweet', 'under 1%', 'higher'], ['sour', 'over 1%', 'lower']], { cols: [12, 80, 170], y0: 34, rowH: 22, W: 292 }), { w: 300, h: 96, from: 2, until: 2 });
    s.card('dif', 'DIFFERENTIALS · ILLUSTRATIVE $/bbl', bars([
      { label: 'benchmark', value: PRICE.bench, color: '#fde3a7' }, { label: 'medium', value: PRICE.medium, color: '#f7a35c' }, { label: 'heavy sour', value: PRICE.heavy, color: '#35322f' },
    ], { w: 300, labelW: 84, max: 80, y0: 36, h: 16, gap: 10, fmt: (v) => `$${v}`, note: `heavy sells ${PRICE.bench - PRICE.heavy} below the benchmark in this example` }), { w: 300, h: 140, from: 5, until: 5 });
  },
  steps: [
    { short: 'Two dials', tag: 'CONCEPT', title: 'Crude has two quality dials', focus: ['lt', 'hv'], flows: ['f-lt'],
      body: ['“Oil” is not one commodity. Crude differs by region, and two properties drive its value: how dense it is (light or heavy) and how much sulfur it holds (sweet or sour).', 'The course notes put it simply: crude is valued by how easy it is to turn into high-demand products such as gasoline.'], stats: { bench: 'WTI, Brent' } },
    { short: 'API gravity', tag: 'NUMBERS', title: 'API gravity measures lightness', focus: ['lt', 'api'], flows: ['f-lt'],
      body: ['The industry scale is API gravity: degrees API = 141.5 divided by specific gravity, minus 131.5. It runs opposite to density, so a higher number means a lighter oil.', 'Thresholds vary by source. EIA calls crude light above 38 degrees and heavy at 22 or below. The course notes use light above 31.1 and heavy below 22.3. Always check which cut-off a report uses.'],
      callout: { k: 'warn', t: 'Two sources can label the same barrel differently. A “light” or “heavy” tag is only meaningful next to its cut-off.' }, stats: { api: '22 to 38+' } },
    { short: 'Sweet vs sour', tag: 'CONCEPT', title: 'Sulfur splits sweet from sour', focus: ['hv', 'sw'], flows: ['f-hv'],
      body: ['EIA defines sweet crude as under 1% sulfur and sour as over 1%. Sulfur, often as hydrogen sulfide, is corrosive and pollutes when burned.', 'Sour crude needs extra processing to remove the sulfur, so it sells at a discount. Removing it turns sour crude into sweet products.'], stats: { sul: '1%' } },
    { short: 'Light vs heavy', tag: 'CONCEPT', title: 'Light crude is worth more', focus: ['lt', 'md', 'hv'], flows: ['f-lt', 'f-md', 'f-hv'],
      body: ['Light crude flows like water and holds short chains, ideal for gasoline and jet fuel. Heavy crude flows like molasses and holds long chains, which are harder to refine.', 'EIA notes that light, sweet grades are priced higher partly because gasoline and diesel can be made from them with far less sophisticated, energy-intensive processes.'] },
    { short: 'Benchmarks', tag: 'CONCEPT', title: 'A few crudes set the reference price', focus: ['bm', 'lt'], flows: ['f-lt'],
      body: ['There are hundreds of crude types, so the market anchors on benchmarks. West Texas Intermediate (WTI) is a light, sweet US crude. Brent is a light, sweet crude from the North Sea.', 'Every other crude is priced relative to a benchmark. A Texas crude that is heavier and more sour than WTI will sell at a discount to it.'], stats: { bench: 'WTI · Brent' } },
    { short: 'Differentials', tag: 'NUMBERS', title: 'Price = benchmark plus or minus a differential', focus: ['dif'], flows: [],
      body: ['A differential is the gap between a crude and its benchmark. In the illustration, a heavy sour crude sells $12 below a $70 benchmark.', 'The gap is not fixed. EIA reported in 2017 that the premium for WTI over heavy Western Canada Select in the Midwest narrowed from $13 a barrel in March to $10 in August.'],
      callout: { k: 'know', t: 'All dollar figures in this scene are round teaching numbers. For live differentials, use a market data source.' }, stats: { disc: `-$${PRICE.bench - PRICE.heavy}` } },
    { short: 'Cenovus', tag: 'CONCEPT', title: 'Why heavy crude matters in Ohio and Wisconsin', focus: ['hv', 'ref'], flows: ['f-hv'],
      body: ['Argus describes Cenovus’s Toledo and Superior refineries as the usual destinations for Canadian heavy crude, and notes that narrowing light-heavy price gaps can be a headwind to refinery profit.', 'Cenovus says a 2019 project at Lima gave that refinery the flexibility to switch between light and heavy feedstock. The next lessons show how a refinery turns cheap heavy barrels into valuable fuel.'],
      callout: { k: 'key', t: 'A refinery that can process heavy, sour crude earns the discount. A refinery that cannot must buy the expensive barrel.' } },
  ],
};
