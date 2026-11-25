import { bars, code, table } from './cards.js';

// Core. The 3:2:1 method is from the Duke course notes, CME Group and EIA. The prices are HYPOTHETICAL teaching numbers
// (WTI $80, gasoline $2.50, diesel $2.80), the same shape of example used in finance textbooks; they are not a market quote.
const GAL = 42, WTI = 80, RBOB = 2.5, ULSD = 2.8;
const gasBbl = RBOB * GAL, dslBbl = ULSD * GAL;
const out = 2 * gasBbl + 1 * dslBbl, inn = 3 * WTI, total = out - inn, perBbl = total / 3;
const crackOf = (w, r, u) => (2 * r * GAL + u * GAL - 3 * w) / 3;

export default {
  id: 'crack', group: 'barrel', title: 'The Crack Spread', icon: 'chart', time: 12, level: 'Intermediate',
  tagline: 'One number for refining margin: what two barrels of gasoline and one of diesel are worth, minus the three barrels of crude it took to make them.',
  stats: [
    { id: 'prod', label: 'Product value', icon: 'flame' }, { id: 'crude', label: 'Crude cost', icon: 'droplet' },
    { id: 'tot', label: 'Spread for 3 bbl', icon: 'chart' }, { id: 'per', label: 'Spread per bbl', icon: 'gauge' },
  ],
  legend: [['#e8a33a', 'gasoline'], ['#c2793a', 'diesel'], ['#3b2f26', 'crude'], ['#b8c940', 'margin']],
  learn: [
    { t: 'Why refiners watch a spread, not a price', at: 0 }, { t: 'What a simple 1:1 crack is', at: 1 },
    { t: 'Why the 3:2:1 ratio approximates a refinery', at: 2 }, { t: 'Why prices must be converted to dollars per barrel', at: 3 },
    { t: 'How to compute a 3:2:1 spread step by step', at: 4 }, { t: 'What squeezes and what widens the spread', at: 5 },
    { t: 'What the crack spread does not tell you', at: 6 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    s.cyl('c1', 1.2, 1.2, 0, 0.7, 1.1, 'black', { label: { t: 'crude', icon: 'droplet' } });
    s.cyl('c2', 1.2, 3.0, 0, 0.7, 1.1, 'black', { from: 2 });
    s.cyl('c3', 1.2, 4.8, 0, 0.7, 1.1, 'black', { from: 2 });
    s.box('ref', 4.0, 2.6, 0, 2.2, 2.4, 1.8, 'blue', { label: { t: 'refinery', icon: 'factory' } });
    s.cyl('g1', 8.0, 1.2, 0, 0.7, 1.1, 'yellow', { from: 2, label: { t: '2 gasoline' } });
    s.cyl('g2', 8.0, 2.8, 0, 0.7, 1.1, 'yellow', { from: 2 });
    s.cyl('d1', 8.0, 4.8, 0, 0.7, 1.1, 'flame', { from: 2, label: { t: '1 diesel' } });
    s.box('mg', 4.4, 6.6, 0, 1.6, 1.2, 0.8, 'green', { from: 4, label: { t: 'margin', icon: 'chart' } });
    s.flow('f-in', [[2.0, 1.4, 0.05], [4.0, 3.2, 0.05]], 'crude', { pipe: true });
    s.flow('f-g', [[6.2, 3.2, 0.05], [8.0, 1.8, 0.05]], 'gasoline', { pipe: true, from: 1 });
    s.flow('f-d', [[6.2, 4.2, 0.05], [8.0, 5.2, 0.05]], 'diesel', { pipe: true, from: 1 });
    s.card('ratio', 'COMMON RATIOS (CME)', table(['ratio', 'crude', 'gasoline', 'distillate'], [['1:1', '1', '1 (either)', ''], ['3:2:1', '3', '2', '1'], ['5:3:2', '5', '3', '2'], ['2:1:1', '2', '1', '1']], { cols: [12, 70, 130, 214], y0: 34, rowH: 20, W: 292, hl: 1 }), { w: 300, h: 150, from: 2, until: 2 });
    s.card('conv', 'UNIT CONVERSION', code([`gasoline  $${RBOB.toFixed(2)}/gal  x ${GAL} = $${gasBbl.toFixed(2)}/bbl`, `diesel    $${ULSD.toFixed(2)}/gal  x ${GAL} = $${dslBbl.toFixed(2)}/bbl`, `crude     $${WTI.toFixed(2)}/bbl  (already per bbl)`, ``, `futures for RBOB and ULSD quote $/gal;`, `WTI futures quote $/bbl`], { y0: 38, gap: 15 }), { w: 300, h: 140, from: 3, until: 3 });
    s.card('math', 'WORKED EXAMPLE (hypothetical)', code([`products = 2 x ${gasBbl.toFixed(2)} + 1 x ${dslBbl.toFixed(2)}`, `         = $${out.toFixed(2)}`, `crude    = 3 x ${WTI} = $${inn.toFixed(2)}`, `spread   = ${out.toFixed(2)} - ${inn.toFixed(2)} = $${total.toFixed(2)}`, `per bbl  = ${total.toFixed(2)} / 3 = $${perBbl.toFixed(2)}`], { y0: 38, gap: 16 }), { w: 300, h: 130, from: 4, until: 4 });
    s.card('mv', 'WHAT MOVES IT', bars([
      { label: 'base case', value: crackOf(WTI, RBOB, ULSD), color: '#b8c940' }, { label: 'crude +$10', value: crackOf(WTI + 10, RBOB, ULSD), color: '#35322f' },
      { label: 'gasoline +20c', value: crackOf(WTI, RBOB + 0.2, ULSD), color: '#e8a33a' }, { label: 'diesel +20c', value: crackOf(WTI, RBOB, ULSD + 0.2), color: '#c2793a' },
    ], { w: 300, labelW: 92, max: 45, y0: 36, h: 14, gap: 9, fmt: (v) => `$${v.toFixed(1)}`, note: 'hypothetical $/bbl; other inputs held constant' }), { w: 300, h: 170, from: 5, until: 5 });
  },
  steps: [
    { short: 'Why a spread', tag: 'CONCEPT', title: 'A refiner sells products, not crude', focus: ['c1', 'ref'], flows: ['f-in'],
      body: ['A refiner buys crude and sells fuel, so the price of crude alone says little about profit. What matters is the gap between what the products sell for and what the crude cost: the crack spread, named after “cracking” crude into products.', 'CME Group calls it the theoretical refining margin. It ignores the refinery’s own operating costs, so it is a gross margin measure.'] },
    { short: 'Simple crack', tag: 'CONCEPT', title: 'The 1:1 crack', focus: ['ref', 'g1', 'd1'], flows: ['f-in', 'f-g', 'f-d'],
      body: ['The simplest version compares one barrel of crude with one barrel of a product, for example one RBOB gasoline contract against one WTI contract. CME describes this as the most common single-product crack.', 'The Duke notes describe the simple spread as the price difference between a barrel of crude and a barrel of gasoline.'] },
    { short: '3:2:1', tag: 'CONCEPT', title: 'Three crude barrels, two gasoline, one diesel', focus: ['c1', 'c2', 'c3', 'g1', 'g2', 'd1', 'ratio'], flows: ['f-in', 'f-g', 'f-d'],
      body: ['A real refinery makes a mix. EIA notes that US refiners produce roughly two barrels of gasoline for every barrel of distillate, so the 3:2:1 ratio of three crude, two gasoline and one distillate is the most common multiple-product crack.', 'CME also lists 5:3:2 and 2:1:1 variants. Which one fits depends on the refinery and region.'] },
    { short: 'Units', tag: 'METHOD', title: 'Convert everything to dollars per barrel', focus: ['conv'], flows: [],
      body: [`Gasoline and diesel futures are priced in dollars per gallon, while WTI is priced per barrel. A barrel holds ${GAL} gallons, so multiply the product prices by ${GAL} before comparing.`, `At $${RBOB.toFixed(2)} a gallon, gasoline is worth $${gasBbl.toFixed(2)} a barrel; at $${ULSD.toFixed(2)}, diesel is $${dslBbl.toFixed(2)}.`],
      callout: { k: 'warn', t: 'Forgetting the ×42 is the classic mistake: it makes the spread look hugely negative.' } },
    { short: 'The math', tag: 'NUMBERS', title: 'Worked example with hypothetical prices', focus: ['math', 'mg'], flows: [],
      body: [`Products: 2 × $${gasBbl.toFixed(2)} + 1 × $${dslBbl.toFixed(2)} = $${out.toFixed(2)}. Crude: 3 × $${WTI} = $${inn}. The spread for three barrels is $${total.toFixed(2)}, or $${perBbl.toFixed(2)} per barrel of crude after dividing by 3.`, 'The Duke notes show the formula without the final division by 3, which gives the spread for the whole three-barrel bundle. CME and EIA divide by 3 to quote it per barrel. Both are the same idea at a different scale.'],
      callout: { k: 'key', t: 'Always state whether a spread is per three-barrel bundle or per barrel.' }, stats: { prod: `$${out.toFixed(0)}`, crude: `$${inn}`, tot: `$${total.toFixed(1)}`, per: `$${perBbl.toFixed(1)}` } },
    { short: 'What moves it', tag: 'CONCEPT', title: 'Crude up squeezes, products up widens', focus: ['mv'], flows: [],
      body: ['If crude rises and product prices do not, the spread narrows: the refiner pays more and sells for the same. If a product price rises faster than crude, the spread widens.', 'Because refining margins can move opposite to crude prices, the Duke notes explain why integrated companies that both produce and refine oil have a natural hedge: high crude helps the producing side, low crude helps the refining side.'] },
    { short: 'Limits', tag: 'PROBLEM', title: 'A futures proxy, not your plant’s margin', focus: ['ref', 'mg'], flows: [],
      body: ['The standard 3:2:1 uses WTI and US product futures. A refinery on a different crude, in a different region, or with a different yield can earn a very different margin. In the CME contract the diesel leg is ULSD; older textbook versions used heating oil as a proxy.', 'The spread also moves a lot. In mid-2026 CME’s market commentary noted the 3-2-1 crack approaching $70 a barrel, far above typical levels, so always date a spread when you quote it.'],
      callout: { k: 'know', t: 'The crack spread tells you the direction and rough size of refining economics. It does not replace the refinery’s own yield, cost and crude-differential data.' } },
  ],
};
