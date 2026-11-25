import { cols, table, list } from './cards.js';
import { MONTHS, SNAP, fmt0 } from './dmdata.js';

// Work. The monthly view of the Columbus Diesel Order Monitor. Months are the date cohort of each order's earliest main diesel line, not proven delivery months.
const aug = MONTHS[7], sep = MONTHS[8], jan = MONTHS[0];
const dGal = sep[2] - aug[2];
const avgAug = aug[2] / aug[1], avgSep = sep[2] / sep[1];
const totalFollow = MONTHS.reduce((a, m) => a + m[3], 0);

export default {
  id: 'dmmonths', group: 'work', track: 'work', title: 'Reading the Monthly Series', icon: 'chart', time: 10, level: 'Intermediate',
  tagline: 'January to October 2026 in three charts: orders, ordered gallons and follow-ups, and what the August-to-September jump can and cannot tell you.',
  stats: [
    { id: 'aug', label: 'Aug gallons', icon: 'droplet' }, { id: 'sep', label: 'Sep gallons', icon: 'droplet' },
    { id: 'd', label: 'Change', icon: 'gauge' }, { id: 'fu', label: 'Follow-ups', icon: 'flag' },
  ],
  legend: [['#bfbfb2', 'orders'], ['#e8a33a', 'gallons'], ['#e5534b', 'follow-ups']],
  learn: [
    { t: 'How a month is assigned to an order', at: 0 }, { t: 'How order counts vary by month', at: 1 },
    { t: 'How ordered gallons vary by month', at: 2 }, { t: 'How the Aug-to-Sep finding is computed', at: 3 },
    { t: 'Why follow-ups are not spread evenly', at: 4 }, { t: 'What a monthly chart cannot establish', at: 5 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    MONTHS.forEach((m, i) => s.box('m' + i, 0.6 + i * 0.86, 4.4 - (m[2] / 54139) * 0.0, 0, 0.7, 0.7, 0.4 + (m[2] / 54139) * 3.0, i === 8 ? 'flame' : i === 7 ? 'yellow' : 'steel', { from: 2, k: 10 + i }));
    s.box('cal', 0.8, 0.8, 0, 3.0, 1.6, 0.8, 'white', { label: { t: 'order cohorts', icon: 'clock' } });
    s.box('rv', 6.6, 0.8, 0, 2.4, 1.6, 0.8, 'red', { from: 4, label: { t: 'follow-ups', icon: 'flag' } });
    s.card('def', 'HOW A MONTH IS CHOSEN', list([['Earliest diesel line', 'its listed DeliveryDate'], ['Cohort month', 'not proof of delivery'], ['Invoice dollars', 'go to the same cohort']], { gap: 36 }), { w: 300, h: 140, from: 0, until: 0 });
    s.card('ord', 'ORDERS PER MONTH', cols(MONTHS.map((m, i) => ({ label: m[0], value: m[1], color: i === 8 ? '#e8a33a' : '#bfbfb2' })), { w: 300, y0: 36, h: 80, fmt: (v) => `${v}` }), { w: 300, h: 150, from: 1, until: 1 });
    s.card('gal', 'ORDERED GALLONS', cols(MONTHS.map((m, i) => ({ label: m[0], value: m[2] / 1000, color: i === 8 ? '#e8a33a' : '#bfbfb2' })), { w: 300, y0: 36, h: 80, fmt: (v) => `${v.toFixed(0)}k` }), { w: 300, h: 150, from: 2, until: 2 });
    s.card('chg', 'AUG TO SEP', table(['', 'Aug', 'Sep'], [['orders', `${aug[1]}`, `${sep[1]}`], ['gallons', fmt0(aug[2]), fmt0(sep[2])], ['gal per order', avgAug.toFixed(0), avgSep.toFixed(0)]], { cols: [12, 130, 214], y0: 34, rowH: 24, W: 292 }), { w: 300, h: 126, from: 3, until: 3 });
    s.card('fol', 'FOLLOW-UPS PER MONTH', cols(MONTHS.map((m) => ({ label: m[0], value: m[3], color: '#e5534b' })), { w: 300, y0: 36, h: 70, fmt: (v) => `${v}`, max: 8 }), { w: 300, h: 150, from: 4, until: 4 });
    s.card('no', 'THE CHART CANNOT SAY', list([['Why', 'order count rose'], ['Whether', 'city demand changed'], ['When', 'invoices posted']], { gap: 36 }), { w: 300, h: 140, from: 5, until: 5 });
  },
  steps: [
    { short: 'Cohorts', tag: 'METHOD', title: 'Months are order cohorts, not delivery months', focus: ['cal', 'def'], flows: [],
      body: ['Each order is placed in a month using the listed date of its earliest main diesel line. That is a purchase-order cohort month, not proof of delivery. Matched invoice dollars are assigned to the same cohort month, so the chart does not show when invoice dollars posted.', 'The source invoice date stays visible on each order’s record.'], callout: { k: 'warn', t: 'Name the date behind every time chart. Order date, delivery date and invoice date tell three different stories.' } },
    { short: 'Orders', tag: 'NUMBERS', title: 'Order counts move between 25 and 55', focus: ['cal', 'ord'], flows: [],
      body: [`Monthly order counts range from ${Math.min(...MONTHS.map((m) => m[1]))} to ${Math.max(...MONTHS.map((m) => m[1]))}, summing to ${SNAP.orders}. September is the highest month.`, 'The count is of distinct selected purchase orders in each date cohort.'] },
    { short: 'Gallons', tag: 'NUMBERS', title: 'Ordered gallons per month', focus: ['m7', 'm8', 'gal'], flows: [],
      body: [`Ordered diesel gallons by month range from ${fmt0(Math.min(...MONTHS.map((m) => m[2])))} to ${fmt0(Math.max(...MONTHS.map((m) => m[2])))}, totalling ${fmt0(SNAP.gallons)}. June has the most gallons although September has the most orders.`, 'More orders do not always mean more gallons: the average gallons per order changes from month to month.'], stats: { aug: fmt0(aug[2]), sep: fmt0(sep[2]) } },
    { short: 'Aug to Sep', tag: 'NUMBERS', title: 'A finding built by subtraction', focus: ['m7', 'm8', 'chg'], flows: [],
      body: [`August has ${aug[1]} orders and ${fmt0(aug[2])} gallons. September has ${sep[1]} orders and ${fmt0(sep[2])} gallons, an increase of ${fmt0(dGal)}. Average gallons per order are ${avgAug.toFixed(0)} in August and ${avgSep.toFixed(0)} in September.`, 'So the jump is mostly more orders at a similar size. The Monitor says these figures describe how the recorded quantity changed; they do not explain why the order count rose or whether citywide demand changed.'],
      callout: { k: 'key', t: 'Decompose a change: count × average size. It shows whether volume rose because of more orders or bigger ones.' }, stats: { d: `+${fmt0(dGal)}` } },
    { short: 'Follow-ups', tag: 'DATA', title: 'Follow-ups cluster in a few months', focus: ['rv', 'fol'], flows: [],
      body: [`${totalFollow} follow-ups are spread unevenly: ${jan[3]} of January’s ${jan[1]} orders (${((jan[3] / jan[1]) * 100).toFixed(0)}%), one in February, none in March, April, June or July, and a few in May, August, September and October.`, 'An uneven distribution is a reason to look at the cause for that month rather than to treat the follow-up rate as a single constant.'], stats: { fu: `${totalFollow}` } },
    { short: 'Limits', tag: 'PROBLEM', title: 'What a monthly chart cannot establish', focus: ['no'], flows: [],
      body: ['Ten months of one supplier’s orders cannot say why volume changed, whether the city used more fuel, or when invoices were posted. The point of the chart is the shape, with every month traceable back to its orders.', 'A later refresh also changes the picture: on November 16 the same exports held 376 orders, though all 348 original orders still reproduced the same quantities and amounts. The site keeps the original dated snapshot.'],
      callout: { k: 'know', t: 'Snapshots need dates. A report that says “data as of” can be re-run later and compared honestly.' } },
  ],
};
