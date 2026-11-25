import { table, list, code } from './cards.js';

// Core. A star-schema walk-through for fuel order data. The rows are INVENTED; sums shown are computed from them.
const FACT = [[1, 'ULSD', 'T-101', 'Acme', 8000, 19680], [2, 'ULSD', 'T-101', 'Acme', 8000, 19840], [3, 'REG', 'T-102', 'Corner', 7500, 15750], [4, 'REG', 'T-102', 'Corner', 8000, 16960], [5, 'ULSD', 'T-101', 'City', 6000, 14820], [6, 'B20', 'T-102', 'City', 3500, 9800]];
const sumBy = (i) => FACT.reduce((m, r) => (m[r[i]] = (m[r[i]] || 0) + r[4], m), {});
const byProd = sumBy(1);

export default {
  id: 'star', group: 'desk', title: 'Star Schema', icon: 'layers', time: 11, level: 'Intermediate',
  tagline: 'One fact table of events surrounded by small dimension tables: the shape that keeps fuel reporting fast, correct and easy to filter.',
  stats: [
    { id: 'grain', label: 'Grain', icon: 'table' }, { id: 'facts', label: 'Fact tables', icon: 'database' },
    { id: 'dims', label: 'Dimensions', icon: 'layers' }, { id: 'keys', label: 'Keys in the fact', icon: 'link' },
  ],
  legend: [['#e8a33a', 'fact table'], ['#5f9ccb', 'dimension'], ['#7c63d0', 'key']],
  learn: [
    { t: 'What goes wrong with one big flat table', at: 0 }, { t: 'The difference between a fact and a dimension', at: 1 },
    { t: 'What grain means and why to state it first', at: 2 }, { t: 'How keys and one-to-many relationships work', at: 3 },
    { t: 'How a filter on a dimension flows to the fact', at: 4 }, { t: 'Why you need several date roles', at: 5 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    s.box('fact', 3.8, 3.8, 0, 2.4, 2.4, 1.4, 'orange', { label: { t: 'fact_lifting', icon: 'database' } });
    s.box('dp', 0.6, 3.8, 0, 1.6, 2.4, 0.9, 'blue', { from: 1, label: { t: 'dim_product', icon: 'droplet' } });
    s.box('dc', 7.6, 3.8, 0, 1.6, 2.4, 0.9, 'blue', { from: 1, label: { t: 'dim_customer', icon: 'house' } });
    s.box('dt', 3.8, 0.4, 0, 2.4, 1.6, 0.9, 'blue', { from: 1, label: { t: 'dim_terminal', icon: 'truck' } });
    s.box('dd', 3.8, 8.0, 0, 2.4, 1.6, 0.9, 'blue', { from: 1, label: { t: 'dim_date', icon: 'clock' } });
    s.flow('f1', [[2.2, 5.0, 0.05], [3.8, 5.0, 0.05]], 'data', { from: 3 });
    s.flow('f2', [[7.6, 5.0, 0.05], [6.2, 5.0, 0.05]], 'data', { from: 3 });
    s.flow('f3', [[5.0, 2.0, 0.05], [5.0, 3.8, 0.05]], 'data', { from: 3 });
    s.flow('f4', [[5.0, 8.0, 0.05], [5.0, 6.2, 0.05]], 'data', { from: 3 });
    s.flow('fl', [[2.2, 5.4, 0.05], [3.8, 5.4, 0.05]], 'gasoline', { from: 4, until: 4 });
    s.card('flat', 'ONE FLAT TABLE (problems)', list([['Repeats', 'customer name on every row'], ['Edits', 'rename once, fix many rows'], ['Grain', 'unclear what a row is']], { gap: 36 }), { w: 300, h: 132, from: 0, until: 0 });
    s.card('fct', 'FACT ROWS (invented)', table(['id', 'prod', 'term', 'cust', 'gal'], FACT.map((r) => [`${r[0]}`, r[1], r[2], r[3], `${r[4]}`]), { cols: [12, 42, 98, 150, 214], y0: 30, rowH: 15, W: 292 }), { w: 300, h: 150, from: 2, until: 2 });
    s.card('key', 'KEYS AND RELATIONSHIPS', code([`dim_product   1 ---- * fact_lifting`, `dim_customer  1 ---- * fact_lifting`, `dim_terminal  1 ---- * fact_lifting`, `dim_date      1 ---- * fact_lifting`, ``, `one product, many liftings`], { y0: 38, gap: 15 }), { w: 300, h: 140, from: 3, until: 3 });
    s.card('flt', 'FILTER FLOWS TO FACT', code([`slicer: product = ULSD`, `fact rows kept: ${FACT.filter((r) => r[1] === 'ULSD').map((r) => r[0]).join(', ')}`, `gallons = ${byProd.ULSD}`, ``, `slicer: product = REG`, `gallons = ${byProd.REG}`], { y0: 38, gap: 15 }), { w: 300, h: 140, from: 4, until: 4 });
    s.card('rol', 'DATE ROLES', list([['Order date', 'when it was requested'], ['Load date', 'when it left the rack'], ['Invoice date', 'when it was billed']], { gap: 36 }), { w: 300, h: 132, from: 5, until: 5 });
  },
  steps: [
    { short: 'Flat table', tag: 'PROBLEM', title: 'A single wide table gets messy', focus: ['fact', 'flat'], flows: [],
      body: ['Many first reports are one wide sheet: order, customer, product, terminal and dates on every row. Names repeat thousands of times, a rename means many edits, and nobody is sure what one row represents.', 'The star schema splits that sheet into a central table of events and small lookup tables around it.'], stats: { facts: '1' } },
    { short: 'Fact & dims', tag: 'CONCEPT', title: 'Facts are events, dimensions describe them', focus: ['fact', 'dp', 'dc', 'dt', 'dd'], flows: [],
      body: ['A fact table records things that happened and the numbers about them: gallons loaded, dollars invoiced. A dimension table describes the who, what, where and when: customer, product, terminal and date.', 'Fact tables are tall and narrow. Dimension tables are short and wide.'], stats: { dims: '4' } },
    { short: 'Grain', tag: 'METHOD', title: 'State the grain first', focus: ['fact', 'fct'], flows: [],
      body: ['Grain is what one row of the fact table means. In this example it is one lifting. Every other design decision follows from it, and mixing grains in one table is the root of many wrong totals.', 'A good habit: write the grain as a sentence before building anything.'],
      callout: { k: 'key', t: 'Grain sentence: “One row per truck lifting at a terminal.” If you cannot write it, the model is not ready.' }, stats: { grain: 'lifting' } },
    { short: 'Keys', tag: 'DATA', title: 'Keys connect the tables', focus: ['fact', 'dp', 'dc', 'dt', 'dd', 'key'], flows: ['f1', 'f2', 'f3', 'f4'],
      body: ['The fact table holds a key for each dimension. Each dimension has one row per key. That makes every relationship one-to-many: one product, many liftings.', 'Because the “one” side is a clean lookup, joins in this design cannot fan out the way a many-to-many join does.'], stats: { keys: '4' } },
    { short: 'Filtering', tag: 'CONCEPT', title: 'Filters flow from dimension to fact', focus: ['fact', 'dp', 'flt'], flows: ['f1', 'fl'],
      body: [`Choose “ULSD” in a product slicer and the model keeps only the matching fact rows. The sum of gallons becomes ${byProd.ULSD.toLocaleString()} for ULSD and ${byProd.REG.toLocaleString()} for REG in the invented sample.`, 'This is the idea behind filter context in Power BI, which the next lesson uses.'] },
    { short: 'Date roles', tag: 'CONCEPT', title: 'One date table, several roles', focus: ['fact', 'dd', 'rol'], flows: ['f4'],
      body: ['A fuel order has at least three dates: order, load and invoice. Keep one shared date dimension and relate it to the fact table through the date key you want to report by.', 'In Power BI, only one relationship can be active between two tables. Extra roles use inactive relationships activated inside a measure, or separate date columns. Name the date used in every report title.'],
      callout: { k: 'warn', t: 'A monthly chart by order date and one by invoice date can both be correct and still disagree. Label which one it is.' } },
  ],
};
