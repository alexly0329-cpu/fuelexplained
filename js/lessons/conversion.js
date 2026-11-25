import { table, list } from './cards.js';

// Core. Unit descriptions follow the Duke course notes (Additional Refining Processes). The FCC feed note is from Argus. Values in the economics card are ILLUSTRATIVE.
const UNITS = [['Cracker', 'breaks long chains', 'gasoline, diesel'], ['Reformer', 'joins short chains', 'high-octane gasoline'], ['Alkylation', 'upgrades structure', 'high-octane gasoline'], ['Coker', 'cracks residuals', 'fuel oil + solid coke']];
const HEAVY_IN = 58, PRODUCT_OUT = 92;

export default {
  id: 'conversion', group: 'barrel', title: 'Cracking, Reforming and Coking', icon: 'cog', time: 10, level: 'Intermediate',
  tagline: 'Distillation sorts. Conversion units break, join and reshape molecules so a refinery can turn cheap heavy oil into fuels people pay more for.',
  stats: [
    { id: 'in', label: 'Crude cost (illustr.)', icon: 'droplet' }, { id: 'out', label: 'Product value (illustr.)', icon: 'chart' },
    { id: 'gap', label: 'Gross gap (illustr.)', icon: 'gauge' }, { id: 'units', label: 'Units shown', icon: 'cog' },
  ],
  legend: [['#35322f', 'heavy feed'], ['#e8a33a', 'gasoline'], ['#c2793a', 'diesel'], ['#6a6c64', 'coke']],
  learn: [
    { t: 'Why US and European refineries make different things', at: 0 }, { t: 'What a cracking unit does', at: 1 },
    { t: 'What a reformer and alkylation do for octane', at: 2 }, { t: 'What a coker does and what petcoke is', at: 3 },
    { t: 'How conversion turns a cheap barrel into a valuable one', at: 4 }, { t: 'What conversion cannot do', at: 5 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    s.cyl('cdu', 1.6, 4.6, 0, 0.9, 4.2, 'steel', { label: { t: 'distillation', icon: 'factory' } });
    s.box('fcc', 4.2, 1.2, 0, 1.4, 1.4, 2.6, 'orange', { from: 1, label: { t: 'cracker', icon: 'cog' } });
    s.box('ref', 4.2, 4.0, 0, 1.4, 1.4, 1.6, 'violet', { from: 2, label: { t: 'reformer' } });
    s.box('alk', 4.4, 6.6, 0, 1.2, 1.2, 1.2, 'green', { from: 2, label: { t: 'alkylation' } });
    s.cyl('cok', 7.8, 6.8, 0, 0.9, 2.6, 'dark', { from: 3, label: { t: 'coker', icon: 'cog' } });
    s.cyl('gas', 7.8, 1.6, 0, 0.8, 1.0, 'yellow', { from: 1, label: { t: 'gasoline' } });
    s.cyl('dsl', 7.8, 3.8, 0, 0.8, 1.0, 'flame', { from: 1, label: { t: 'diesel' } });
    s.flow('f-hv', [[2.6, 4.2, 0.9], [3.4, 2.2, 0.9], [4.2, 1.9, 0.9]], 'resid', { pipe: true, from: 1 });
    s.flow('f-nap', [[2.6, 4.8, 0.7], [4.2, 4.7, 0.7]], 'gasoline', { pipe: true, from: 2 });
    s.flow('f-alk', [[5.6, 4.7, 0.7], [5.0, 6.8, 0.7]], 'gasoline', { pipe: true, from: 2 });
    s.flow('f-res', [[2.4, 5.4, 0.2], [4.0, 8.2, 0.2], [7.0, 7.4, 0.2]], 'resid', { pipe: true, from: 3 });
    s.flow('f-o1', [[5.6, 1.9, 0.9], [7.0, 1.7, 0.9]], 'gasoline', { pipe: true, from: 1 });
    s.flow('f-o2', [[5.6, 2.4, 0.5], [6.8, 3.8, 0.5]], 'diesel', { pipe: true, from: 1 });
    s.card('us', 'WHO MAKES WHAT', list([['United States', 'demand favors gasoline'], ['Europe', 'demand favors diesel'], ['Input choice', 'light crude = more light cuts']], { gap: 36 }), { w: 300, h: 132, from: 0, until: 0 });
    s.card('un', 'THE FOUR UNITS', table(['unit', 'action', 'output'], UNITS, { cols: [12, 84, 186], y0: 34, rowH: 24, W: 292 }), { w: 300, h: 156, from: 5, until: 5 });
  },
  steps: [
    { short: 'Why convert', tag: 'CONCEPT', title: 'Refineries are tuned to their market', focus: ['cdu', 'us'], flows: [],
      body: ['A refinery’s goal is to optimize its product mix for regional demand. The course notes contrast the US, which favors gasoline, with Europe, which favors diesel.', 'You can steer the mix by choosing crude: low-viscosity crude carries more natural gasoline (easy but expensive), while heavy crude carries more heavy fuel oil (cheap but demanding to process).'],
      callout: { k: 'key', t: 'Cheap heavy crude only pays off if the refinery owns the units to upgrade it.' } },
    { short: 'Cracker', tag: 'CONCEPT', title: 'The cracker cuts long chains short', focus: ['cdu', 'fcc', 'gas', 'dsl'], flows: ['f-hv', 'f-o1', 'f-o2'],
      body: ['A cracking unit takes long hydrocarbon chains from heavy fuel oil and cracks them into shorter chains such as gasoline and diesel. The course notes list two types: a visbreaker, which uses high heat and pressure, and the more efficient fluid catalytic cracker (FCC), which uses a fluid solid catalyst.', 'Argus describes a refinery’s FCC as the unit that upgrades naphtha and vacuum gas oil to finished gasoline, which is why its restart mattered when Superior came back after five years of downtime.'], stats: { units: '1' } },
    { short: 'Octane', tag: 'CONCEPT', title: 'Reforming and alkylation raise octane', focus: ['cdu', 'ref', 'alk'], flows: ['f-nap', 'f-alk'],
      body: ['Once you have gasoline molecules, they must perform well in an engine. Octane is that performance: higher octane reduces misfires and allows higher compression.', 'The course notes describe a reformer as the opposite of a cracker. It unifies short, low-quality chains into longer, high-octane gasoline molecules. Alkylation upgrades naphthas from cracking to raise octane.'], stats: { units: '3' } },
    { short: 'Coker', tag: 'CONCEPT', title: 'The coker handles the leftovers', focus: ['cdu', 'cok'], flows: ['f-res'],
      body: ['For the heaviest residuals that even a cracker cannot handle, refineries use a coker. It cracks the longest chains into upgradeable fuel oils and leaves a solid, nearly pure carbon residue: petroleum coke, or petcoke.', 'Coke solidifies in large drums and is physically drilled out. It is often sold as fuel for steelmaking.'], stats: { units: '4' } },
    { short: 'Economics', tag: 'NUMBERS', title: 'Cheap in, valuable out', focus: ['cdu', 'fcc', 'cok'], flows: ['f-hv', 'f-res'],
      body: [`Illustration: a heavy barrel costs $${HEAVY_IN} and the products made from it are worth $${PRODUCT_OUT}, a gross gap of $${PRODUCT_OUT - HEAVY_IN} before running costs. These numbers are round teaching figures.`, 'A refinery without conversion units cannot capture that gap; it would be stuck selling mostly heavy, low-value product. This is the logic behind investments that let a refinery run heavy crude.'],
      callout: { k: 'know', t: 'The crack spread, next lesson, is the market’s way of measuring this gap with futures prices.' }, stats: { in: `$${HEAVY_IN}`, out: `$${PRODUCT_OUT}`, gap: `$${PRODUCT_OUT - HEAVY_IN}` } },
    { short: 'Limits', tag: 'PROBLEM', title: 'What conversion cannot do', focus: ['un'], flows: [],
      body: ['Conversion is not a free lunch: it costs capital, energy and operating effort, and each unit has a capacity limit.', 'The course quiz also flags a common mistake: light naphtha is not converted into diesel. Naphtha goes toward gasoline or petrochemicals, while cracking heavy fractions is what raises the diesel and gasoline yield.'],
      callout: { k: 'warn', t: 'Know which direction each unit works: crackers break heavy into light, reformers join light into larger, cokers deal with the very bottom.' } },
  ],
};
