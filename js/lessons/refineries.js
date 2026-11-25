import { bars, table, list } from './cards.js';

// Core. Capacities and facts come from public reporting (Cenovus, Argus, Industrial Info, Reuters via Digital Refining, Globe and Mail). Capacities are rounded stated figures.
const CAP = [['Lima, OH', 185, '#e8a33a'], ['Toledo, OH', 160, '#5f9ccb'], ['Superior, WI', 50, '#c2793a']];
const TOTAL = CAP.reduce((a, r) => a + r[1], 0);

export default {
  id: 'refineries', group: 'barrel', title: 'Cenovus’s Three US Refineries', icon: 'factory', time: 10, level: 'Beginner',
  tagline: 'Lima and Toledo in Ohio, Superior in Wisconsin: what each plant makes, where its product goes, and what recent history means for an analyst.',
  stats: [
    { id: 'lima', label: 'Lima (kb/d)', icon: 'factory' }, { id: 'tol', label: 'Toledo (kb/d)', icon: 'factory' },
    { id: 'sup', label: 'Superior (kb/d)', icon: 'factory' }, { id: 'tot', label: 'Combined (kb/d)', icon: 'gauge' },
  ],
  legend: [['#e8a33a', 'Lima'], ['#5f9ccb', 'Toledo'], ['#c2793a', 'Superior'], ['#35322f', 'crude']],
  learn: [
    { t: 'The three refineries and their rough sizes', at: 0 }, { t: 'What Lima makes and where it sells', at: 1 },
    { t: 'What happened at Toledo and why it matters', at: 2 }, { t: 'What Superior makes and processes', at: 3 },
    { t: 'Who handles marketing and logistics', at: 4 }, { t: 'Why integration is a data topic', at: 5 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    s.box('lima', 6.6, 1.4, 0, 2.2, 2.0, 1.8, 'orange', { label: { t: 'Lima', icon: 'factory' } });
    s.cyl('lt', 7.7, 2.0, 1.8, 0.35, 1.4, 'steel', { shadow: false });
    s.box('tol', 7.0, 6.4, 0, 2.2, 2.0, 1.8, 'blue', { from: 2, label: { t: 'Toledo', icon: 'factory' } });
    s.box('sup', 1.0, 0.8, 0, 1.6, 1.4, 1.2, 'flame', { from: 3, label: { t: 'Superior', icon: 'factory' } });
    s.box('hq', 3.0, 6.8, 0, 1.8, 1.4, 1.2, 'white', { from: 4, label: { t: 'marketing & logistics', icon: 'chart' } });
    s.cyl('crude', 1.2, 4.6, 0, 0.8, 1.0, 'black', { from: 3, label: { t: 'crude' } });
    s.flow('f-lt', [[8.0, 3.6, 0.05], [8.2, 6.4, 0.05]], 'gasoline', { pipe: true, from: 5 });
    s.flow('f-sup', [[1.2, 3.8, 0.05], [1.6, 2.4, 0.05]], 'crude', { pipe: true, from: 3, until: 3 });
    s.flow('f-hq', [[4.8, 7.2, 0.05], [5.6, 3.0, 0.05], [6.6, 2.4, 0.05]], 'data', { from: 4 });
    s.flow('f-hq2', [[4.8, 7.6, 0.05], [7.0, 7.4, 0.05]], 'data', { from: 4 });
    s.card('cap', 'STATED CAPACITY (kb/d)', bars(CAP.map(([label, value, color]) => ({ label, value, color })), { w: 300, labelW: 84, max: 200, y0: 36, h: 18, gap: 12, fmt: (v) => `${v}`, note: `about ${TOTAL} thousand barrels a day combined` }), { w: 300, h: 140, from: 0, until: 0 });
    s.card('hist', 'RECENT HISTORY', list([['Superior', 'explosion 2018; restarted 2023'], ['Toledo', 'explosion Sept 2022; restarted 2023'], ['Toledo', 'Cenovus bought BP’s 50% for $300M'], ['Ohio', '$1.5B planned over five years']], { gap: 33 }), { w: 300, h: 170, from: 2, until: 2 });
  },
  steps: [
    { short: 'The sites', tag: 'CONCEPT', title: 'Three refineries, two states', focus: ['lima', 'tol', 'sup', 'cap'], flows: [],
      body: ['Cenovus’s US refining network in this scene is Lima and Toledo in Ohio and Superior in Wisconsin. Published capacities are about 185,000, 160,000 and 50,000 barrels a day.', 'Capacity is the maximum crude a plant can process. Actual throughput depends on maintenance, crude supply and margins, so reported numbers change from quarter to quarter.'],
      callout: { k: 'know', t: 'Sources round and update these figures, and EIA, the company and trade press can differ slightly. Cite the date and source whenever you use one.' }, stats: { lima: '185', tol: '160', sup: '50', tot: `${TOTAL}` } },
    { short: 'Lima', tag: 'CONCEPT', title: 'Lima: gasoline, ULSD and jet for the Midwest', focus: ['lima'], flows: [],
      body: ['OPIS reports Lima’s products include gasoline, ultra-low sulfur diesel and jet fuel, supplying markets in Ohio, Illinois, Indiana, Pennsylvania and southern Michigan. Cenovus says products travel by pipeline and rail car.', 'A 2019 crude flexibility project increased the refinery’s heavy-oil capacity and let it switch between light and heavy feedstock.'] },
    { short: 'Toledo', tag: 'CONCEPT', title: 'Toledo: a fire, a restart and full ownership', focus: ['tol', 'hist'], flows: [],
      body: ['Cenovus held 50% of Toledo through the Husky merger and bought the other 50% from BP for $300 million. Argus reports the refinery was offline after a September 2022 explosion that killed two workers, and was fully operational by mid-June 2023.', 'The purchase added 80,000 barrels a day of throughput capacity, including 45,000 of heavy-oil capacity, and came with a multi-year product supply agreement.'],
      callout: { k: 'warn', t: 'Outages change what a data analyst sees: volumes drop to zero, then ramp. Any trend that crosses 2022 and 2023 needs an annotation, not a fit.' } },
    { short: 'Superior', tag: 'CONCEPT', title: 'Superior: asphalt, gasoline and diesel', focus: ['sup', 'crude'], flows: ['f-sup'],
      body: ['Cenovus describes Superior as producing a full slate including asphalt, gasoline and diesel from light and heavy crude from North Dakota and Western Canada.', 'It was rebuilt after a 2018 explosion. Industrial Info put the upgrades at $1.2 billion, and Argus reported the fluid catalytic cracker coming online in 2023 as the step that completed the restart after five years of downtime.'] },
    { short: 'Marketing', tag: 'CONCEPT', title: 'A marketing and supply team sits between plant and customer', focus: ['hq', 'lima', 'tol'], flows: ['f-hq', 'f-hq2'],
      body: ['A company profile describes a marketing and supply organization that oversees sale, marketing and logistics for the Lima, Toledo and Superior production, and buys non-crude feedstocks for Lima.', 'That is the neighborhood of a marketing operations data analyst: orders, volumes, invoices and delivery records for product that has already left the refinery.'],
      callout: { k: 'key', t: 'The refinery makes the molecules. Marketing operations is where each batch becomes a customer order, an invoice and a record.' } },
    { short: 'Integration', tag: 'CONCEPT', title: 'Why joining the plants is a data story', focus: ['lima', 'tol', 'f-lt'], flows: ['f-lt'],
      body: ['Cenovus’s chief operating officer said the company was looking at integration opportunities between Lima and Toledo to capture additional margin, and Reuters reported a plan to spend more than $1.5 billion on the two Ohio refineries over five years.', 'More integration means more shared supply, shared terminals and shared customers. That raises the stakes on consistent order, volume and pricing data across plants.'],
      callout: { k: 'know', t: 'This lesson reports public information only. It does not describe any internal Cenovus system.' } },
  ],
};
