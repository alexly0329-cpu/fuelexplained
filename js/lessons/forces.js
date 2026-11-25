import { bars, list } from './cards.js';

// Core. Every figure below is from the Duke course notes (Supply, Demand and Price Elasticity; Seasonal Impacts; Short-Term Constraints; Transport, Processing and Sales Costs).
// The notes' cost estimates are dated and approximate; they are teaching values.
const STAIR = [['Middle East', 27], ['Offshore shelf', 41], ['Shale (2015)', 65], ['Oil sands', 75]];
const PUMP = [['Crude oil', '50 to 70%'], ['Taxes', '15 to 22%'], ['Refining', '7 to 15%'], ['Distribution & marketing', '10 to 12%']];

export default {
  id: 'forces', group: 'moving', title: 'What Moves the Price', icon: 'zap', time: 12, level: 'Intermediate',
  tagline: 'The marginal barrel, the calendar, storms and OPEC: the forces that push fuel prices around and what an order record will inherit from them.',
  stats: [
    { id: 'low', label: 'Cheapest step', icon: 'gauge' }, { id: 'high', label: 'Marginal step', icon: 'flame' },
    { id: 'gulf', label: 'US refining on Gulf', icon: 'factory' }, { id: 'crude', label: 'Crude in pump price', icon: 'droplet' },
  ],
  legend: [['#9fdcd3', 'low cost'], ['#f7a35c', 'high cost'], ['#e5534b', 'shock']],
  learn: [
    { t: 'How the supply cost staircase works', at: 0 }, { t: 'Why the most expensive needed barrel sets the price', at: 1 },
    { t: 'Why oil demand is inelastic', at: 2 }, { t: 'The parts of a pump price', at: 3 },
    { t: 'How refineries change recipe by season', at: 4 }, { t: 'How hurricanes, conflict and OPEC move prices', at: 5 },
  ],
  build(s) {
    s.floor(10, 10, 'cream');
    s.box('s1', 0.8, 2.4, 0, 1.8, 2.6, 0.8, 'teal', { label: { t: 'Middle East', icon: 'droplet' } });
    s.box('s2', 2.6, 2.4, 0, 1.8, 2.6, 1.6, 'green', { from: 0, label: { t: 'offshore' } });
    s.box('s3', 4.4, 2.4, 0, 1.8, 2.6, 2.4, 'orange', { from: 0, label: { t: 'shale' } });
    s.box('s4', 6.2, 2.4, 0, 1.8, 2.6, 3.2, 'flame', { from: 0, label: { t: 'oil sands' } });
    s.box('dem', 8.4, 1.4, 0, 0.4, 5.0, 3.6, 'violet', { from: 1, label: { t: 'demand (steep)', icon: 'gauge' } });
    s.box('storm', 1.0, 6.8, 0, 1.6, 1.6, 0.6, 'red', { from: 5, label: { t: 'Gulf hurricane', icon: 'wind' } });
    s.card('stair', 'COST STAIRCASE · $/bbl (notes)', bars(STAIR.map(([label, value], i) => ({ label, value, color: ['#9fdcd3', '#cfe3b2', '#fcdcbd', '#f7a35c'][i] })), { w: 300, labelW: 88, max: 80, y0: 36, h: 16, gap: 10, fmt: (v) => `$${v}`, note: 'regional average costs from the course notes' }), { w: 300, h: 150, from: 0, until: 1 });
    s.card('pump', 'PUMP PRICE STACK (notes)', list(PUMP.map(([a, b]) => [a, b]), { gap: 32 }), { w: 300, h: 160, from: 3, until: 3 });
    s.card('sea', 'REFINERY SLATE BY SEASON', list([['Spring / summer', 'light slate, maximize gasoline'], ['Fall / winter', 'heavy distillate, heating oil']], { gap: 40 }), { w: 300, h: 110, from: 4, until: 4 });
  },
  steps: [
    { short: 'Staircase', tag: 'CONCEPT', title: 'Supply is a staircase of costs', focus: ['s1', 's2', 's3', 's4', 'stair'], flows: [],
      body: ['Stack the world’s oil regions from cheapest to most expensive. The course notes put the Middle East near $27 a barrel (about 22 million barrels a day), the offshore shelf near $41 (adding about 18 million), and then deepwater, shale and oil sands higher up the steps.', 'These are rough, dated averages used to teach the shape. The staircase moves whenever technology or exchange rates change costs.'], stats: { low: '$27' } },
    { short: 'Marginal barrel', tag: 'CONCEPT', title: 'The last barrel needed sets the price for all', focus: ['s4', 'dem', 'stair'], flows: [],
      body: ['If demand is high enough that expensive oil sands barrels are needed, the notes explain, the market price must be at least the cost of those barrels. The Middle East producer still sells at that price and earns a large margin.', 'The lesson: price follows the marginal cost, not the average cost.'], callout: { k: 'key', t: 'The most expensive producer needed to meet demand sets the market-clearing price.' }, stats: { high: '$75' } },
    { short: 'Demand', tag: 'CONCEPT', title: 'Demand barely reacts to price', focus: ['dem', 's4'], flows: [],
      body: ['Short-term oil demand is inelastic: people do not stop driving immediately when prices rise, so the demand curve is close to a vertical line.', 'The notes name two ways prices crash. A recession shifts demand left, so the top step is no longer needed. A technology shock, such as the shale revolution of 2013 to 2015, adds cheaper barrels into the middle of the staircase.'] },
    { short: 'Pump stack', tag: 'NUMBERS', title: 'What is inside a gasoline price', focus: ['pump'], flows: [],
      body: ['According to the notes, crude is 50 to 70% of the pump price, taxes 15 to 22%, refining 7 to 15% and distribution and marketing 10 to 12%.', 'They also state that a station owner usually earns less than 5% on fuel, about ten cents a gallon, with the real profit in the store.'],
      callout: { k: 'know', t: 'These shares are ranges from the course. Actual shares change with crude price and state taxes.' }, stats: { crude: '50-70%' } },
    { short: 'Seasons', tag: 'CONCEPT', title: 'The calendar shapes refinery output', focus: ['sea'], flows: [],
      body: ['Gasoline and diesel demand follow human behavior: peaks in summer vacation season, a low in winter commuting months. Refineries adjust their recipe. The notes describe a light distillate slate in spring and summer and a heavy distillate slate in fall and winter, when heating oil matters.', 'Summer gasoline blends are also tweaked chemically to limit evaporation in heat.'] },
    { short: 'Shocks', tag: 'CONCEPT', title: 'Storms, conflict and OPEC', focus: ['storm'], flows: [],
      body: ['The notes say the US Gulf Coast holds 45% of US refining capacity. Hurricanes force pre-emptive shutdowns, and prices often jump days before a storm lands. Conflict creates risk premiums, for example nearly $20 a barrel overnight in 1991.', 'OPEC controls about 40% of world consumption and about 60% of internationally traded oil, and the notes call Saudi Arabia the swing producer able to add or remove up to 2 million barrels a day.'],
      callout: { k: 'warn', t: 'A sudden spike in a price or volume series may be an event, not an error. Note the date before you filter it out.' }, stats: { gulf: '45%' } },
  ],
};
