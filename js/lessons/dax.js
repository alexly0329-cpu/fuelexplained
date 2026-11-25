import { code, table, list, bars } from './cards.js';

// Core. Calculated column vs measure, filter context and refresh, shown on an INVENTED six-row model. Every figure is computed from FACT below.
const FACT = [['ULSD', 8000, 19680], ['ULSD', 8000, 19840], ['REG', 7500, 15750], ['REG', 8000, 16960], ['ULSD', 6000, 14820], ['B20', 3500, 9800]];
const sum = (rows, i) => rows.reduce((a, r) => a + r[i], 0);
const rowPrices = FACT.map((r) => r[2] / r[1]);
const avgOfRatios = rowPrices.reduce((a, b) => a + b, 0) / rowPrices.length;
const ratioOfSums = sum(FACT, 2) / sum(FACT, 1);
const ul = FACT.filter((r) => r[0] === 'ULSD');

export default {
  id: 'dax', group: 'desk', title: 'Measures, Columns and Refresh', icon: 'cog', time: 12, level: 'Intermediate',
  tagline: 'When to compute in a column and when in a measure, how filter context changes an answer, and what a data refresh really does.',
  stats: [
    { id: 'tg', label: 'Total gallons', icon: 'droplet' }, { id: 'wp', label: 'Weighted price', icon: 'chart' },
    { id: 'ar', label: 'Avg of row prices', icon: 'gauge' }, { id: 'ul', label: 'ULSD gallons', icon: 'flame' },
  ],
  legend: [['#e8a33a', 'column'], ['#7c63d0', 'measure'], ['#2a9d8f', 'refresh']],
  learn: [
    { t: 'What a calculated column is and when it is computed', at: 0 }, { t: 'What a measure is and how filter context drives it', at: 1 },
    { t: 'How a slicer changes a measure’s result', at: 2 }, { t: 'Why ratios belong in measures', at: 3 },
    { t: 'What happens at data refresh', at: 4 }, { t: 'A rule of thumb for column versus measure', at: 5 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    s.box('src', 0.6, 1.0, 0, 2.0, 1.8, 1.0, 'cream', { label: { t: 'source data', icon: 'database' } });
    s.box('mod', 4.0, 3.2, 0, 2.2, 2.2, 1.4, 'orange', { label: { t: 'data model', icon: 'layers' } });
    s.box('col', 4.2, 0.4, 0, 1.4, 1.4, 0.9, 'yellow', { from: 0, until: 0, label: { t: 'calculated column', icon: 'table' } });
    s.box('mea', 7.4, 5.8, 0, 1.6, 1.6, 0.9, 'violet', { from: 1, label: { t: 'measure', icon: 'cog' } });
    s.box('vis', 7.4, 1.2, 0, 1.8, 1.8, 1.0, 'white', { from: 2, label: { t: 'report visual', icon: 'chart' } });
    s.flow('f1', [[2.6, 2.0, 0.05], [4.0, 4.0, 0.05]], 'data', { from: 4 });
    s.flow('f2', [[6.2, 4.2, 0.05], [7.4, 6.4, 0.05]], 'data', { from: 1 });
    s.flow('f3', [[6.2, 3.6, 0.05], [7.4, 2.4, 0.05]], 'data', { from: 2 });
    s.card('c', 'CALCULATED COLUMN', code([`Price per gal =`, `  Fact[Amount] / Fact[Gallons]`, ``, `computed row by row at refresh`, `stored in the model (uses memory)`, `row context: one row at a time`], { y0: 38, gap: 15 }), { w: 300, h: 140, from: 0, until: 0 });
    s.card('m', 'MEASURE', code([`Total Gallons =`, `  SUM ( Fact[Gallons] )`, ``, `computed when a visual asks`, `answer depends on filter context`, `all rows: ${sum(FACT, 1).toLocaleString()} gal`], { y0: 38, gap: 15 }), { w: 300, h: 140, from: 1, until: 1 });
    s.card('f', 'SAME MEASURE, DIFFERENT FILTER', bars([['all', sum(FACT, 1)], ['ULSD', sum(ul, 1)], ['REG', sum(FACT.filter((r) => r[0] === 'REG'), 1)], ['B20', 3500]].map(([label, value], i) => ({ label, value, color: ['#bfbfb2', '#c2793a', '#e8a33a', '#9fdcd3'][i] })), { w: 300, labelW: 54, max: 42000, y0: 36, h: 14, gap: 9, fmt: (v) => v.toLocaleString(), note: 'Total Gallons under four slicer choices' }), { w: 300, h: 160, from: 2, until: 2 });
    s.card('r', 'RATIO TRAP', code([`average of row prices = $${avgOfRatios.toFixed(4)}`, `SUM(amount)/SUM(gallons) = $${ratioOfSums.toFixed(4)}`, ``, `Weighted Price =`, `  DIVIDE ( SUM(Amount),`, `           SUM(Gallons) )`], { y0: 38, gap: 15 }), { w: 300, h: 140, from: 3, until: 3 });
    s.card('rf', 'WHAT REFRESH DOES', list([['1', 'reads the source again'], ['2', 'recomputes columns'], ['3', 'measures need nothing stored'], ['4', 'stamp the “as of” time']], { gap: 28 }), { w: 300, h: 150, from: 4, until: 4 });
  },
  steps: [
    { short: 'Column', tag: 'CONCEPT', title: 'A calculated column is computed row by row', focus: ['src', 'mod', 'col', 'c'], flows: [],
      body: ['A calculated column adds a new value to every row of a table. It is calculated when the data is refreshed, stored in the model, and available like any other column, for example to slice or group.', 'Because it is stored, it grows the model. It sees one row at a time, which is called row context.'], stats: {} },
    { short: 'Measure', tag: 'CONCEPT', title: 'A measure is computed when a visual asks', focus: ['mod', 'mea', 'm'], flows: ['f2'],
      body: ['A measure is a formula evaluated at the moment a visual needs it, over whichever rows the current filters leave. Nothing is stored per row.', `Total Gallons over all six invented rows is ${sum(FACT, 1).toLocaleString()}. The same formula returns something different inside each slicer choice, because its filter context is different.`], stats: { tg: sum(FACT, 1).toLocaleString() } },
    { short: 'Filter context', tag: 'CONCEPT', title: 'The same measure answers differently by context', focus: ['mod', 'mea', 'vis', 'f'], flows: ['f2', 'f3'],
      body: [`Pick ULSD in a slicer and Total Gallons becomes ${sum(ul, 1).toLocaleString()}. Pick REG and it becomes ${sum(FACT.filter((r) => r[0] === 'REG'), 1).toLocaleString()}. The model applies the slicer to the dimension, the filter flows to the fact table, and the measure sums whatever remains.`, 'This is why a measure can power many visuals without being rewritten.'], stats: { ul: sum(ul, 1).toLocaleString() } },
    { short: 'Ratios', tag: 'NUMBERS', title: 'Ratios belong in measures', focus: ['mod', 'mea', 'r'], flows: ['f2'],
      body: [`A calculated column of price per gallon, averaged, gives $${avgOfRatios.toFixed(4)}. A measure that divides total dollars by total gallons gives $${ratioOfSums.toFixed(4)}. The second weights each load by its volume and is the right price.`, 'DIVIDE also handles a zero denominator safely by returning blank instead of an error.'],
      callout: { k: 'warn', t: 'Averaging a column of ratios is a common silent error. Sum the numerator and denominator, then divide.' }, stats: { wp: `$${ratioOfSums.toFixed(3)}`, ar: `$${avgOfRatios.toFixed(3)}` } },
    { short: 'Refresh', tag: 'METHOD', title: 'Refresh reloads data and recomputes columns', focus: ['src', 'mod', 'rf'], flows: ['f1'],
      body: ['A scheduled refresh reads the source again and rebuilds the stored tables and calculated columns. Measures are not stored, so they simply give new answers from the new rows.', 'Common refresh problems: expired credentials, a source column renamed or removed, and a source that changes row counts. Show the “data as of” time on the report so readers know how fresh it is.'],
      callout: { k: 'know', t: 'A stale report with a clear “as of” stamp is honest. A stale report without one is a trap.' } },
    { short: 'Rule', tag: 'METHOD', title: 'Rule of thumb: column to slice, measure to total', focus: ['col', 'mea', 'mod'], flows: [],
      body: ['Use a column when you need a value to filter, group or sort by, such as “is matched” or “price band”. Use a measure when you need a total, ratio or percentage that must respond to filters.', 'If you are tempted to store a percentage in a column, you probably want a measure.'] },
  ],
};
