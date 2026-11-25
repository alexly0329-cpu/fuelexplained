import { bars, list, table } from './cards.js';

// Core. Midstream concepts follow the Duke course notes (Oil Midstream); the Cenovus delivery modes are from Cenovus's own operations page.
const CRUDE_MI = 50000, PRODUCT_MI = 87000, EARTH_MI = 24901;
const loops = (CRUDE_MI + PRODUCT_MI) / EARTH_MI;

export default {
  id: 'midstream', group: 'moving', title: 'Pipes, Ships and Tanks', icon: 'ship', time: 11, level: 'Beginner',
  tagline: 'How crude gets to a refinery and how fuel gets from the refinery to a terminal: transmission lines, distribution lines, batches, pigs and storage.',
  stats: [
    { id: 'crude', label: 'Crude pipe (US mi)', icon: 'gauge' }, { id: 'prod', label: 'Product pipe (US mi)', icon: 'gauge' },
    { id: 'loops', label: 'Times round the Earth', icon: 'pin' }, { id: 'stor', label: 'Storage (mil bbl)', icon: 'database' },
  ],
  legend: [['#3b2f26', 'crude'], ['#e8a33a', 'gasoline'], ['#5f9ccb', 'jet'], ['#c2793a', 'diesel'], ['#6a6c64', 'pig']],
  learn: [
    { t: 'Upstream, midstream and downstream', at: 0 }, { t: 'Transmission versus distribution pipelines', at: 1 },
    { t: 'How different fuels share one pipeline', at: 2 }, { t: 'What a pig does', at: 3 },
    { t: 'Short-term and long-term storage', at: 4 }, { t: 'Why big tankers use lightering', at: 5 },
    { t: 'How Cenovus’s Ohio product reaches its markets', at: 6 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    s.cyl('well', 0.9, 1.0, 0, 0.5, 1.6, 'steel', { label: { t: 'field', icon: 'droplet' } });
    s.box('ref', 3.6, 3.4, 0, 2.2, 2.0, 1.6, 'blue', { label: { t: 'refinery', icon: 'factory' } });
    s.cyl('t1', 8.0, 0.9, 0, 0.7, 1.0, 'white', { from: 4, label: { t: 'terminal tanks', icon: 'database' } });
    s.cyl('t2', 8.0, 2.4, 0, 0.7, 1.0, 'white', { from: 4 });
    s.box('ship', 0.4, 6.4, 0, 3.0, 1.2, 0.7, 'navy', { from: 5, label: { t: 'tanker', icon: 'ship' } });
    s.box('rail', 6.4, 6.6, 0, 2.6, 0.9, 0.7, 'dark', { from: 6, label: { t: 'rail cars', icon: 'truck' } });
    s.box('trk', 8.2, 4.2, 0, 1.2, 1.4, 0.8, 'steel', { from: 6, label: { t: 'trucks', icon: 'truck' } });
    s.flow('f-gat', [[1.3, 1.4, 0.05], [3.6, 3.8, 0.05]], 'crude', { pipe: true, from: 0, until: 1 });
    s.flow('f-tr', [[1.3, 1.4, 0.05], [3.6, 3.8, 0.05]], 'crude', { pipe: true, from: 1, until: 1 });
    s.flow('f-gas', [[5.8, 3.8, 0.05], [8.0, 1.2, 0.05]], 'gasoline', { pipe: true, from: 2, until: 3 });
    s.flow('f-jet', [[5.8, 4.2, 0.05], [8.0, 2.6, 0.05]], 'jet', { pipe: true, from: 2, until: 3, cls: 'slow' });
    s.flow('f-dis', [[5.8, 4.6, 0.05], [8.4, 4.8, 0.05]], 'diesel', { pipe: true, from: 6 });
    s.flow('f-rail', [[5.4, 5.4, 0.05], [7.0, 6.8, 0.05]], 'diesel', { pipe: true, from: 6 });
    s.card('net', 'US PIPELINE NETWORK (course notes)', bars([
      { label: 'crude lines', value: CRUDE_MI / 1000, color: '#3b2f26' }, { label: 'product lines', value: PRODUCT_MI / 1000, color: '#e8a33a' },
    ], { w: 300, labelW: 92, max: 90, y0: 38, h: 18, gap: 12, fmt: (v) => `${v}k mi`, note: `about ${loops.toFixed(1)} times around the Earth` }), { w: 300, h: 130, from: 1, until: 1 });
    s.card('slug', 'BATCHES IN ONE PIPE', table(['slug', 'next to', 'rule'], [['gasoline', 'gasoline', 'blends to lower grade'], ['gasoline', 'jet fuel', 'needs a pig'], ['jet fuel', 'diesel', 'needs a pig']], { cols: [12, 82, 150], y0: 34, rowH: 22, W: 292 }), { w: 300, h: 118, from: 2, until: 3 });
    s.card('mode', 'HOW OHIO PRODUCT MOVES', list([['Pipeline', 'bulk, fixed routes'], ['Rail car', 'bulk, flexible routes'], ['Truck', 'last miles from a terminal']], { gap: 36 }), { w: 300, h: 132, from: 6, until: 6 });
  },
  steps: [
    { short: 'Midstream', tag: 'CONCEPT', title: 'The link between the field and the customer', focus: ['well', 'ref'], flows: ['f-gat'],
      body: ['Upstream is finding and producing crude. Downstream is refining and selling. Midstream is everything in between: the pipes, ships and tanks that connect them.', 'The Duke notes use the Trans-Alaska Pipeline, about 800 miles from the North Slope to Port Valdez, as a case study. Small gathering lines from wells feed large transmission lines, which carry crude to refineries, storage hubs or seaports.'], stats: { crude: '' } },
    { short: 'Two pipe types', tag: 'CONCEPT', title: 'Transmission moves crude, distribution moves product', focus: ['well', 'ref', 'net'], flows: ['f-tr'],
      body: ['Transmission pipelines move raw crude long distances. Distribution pipelines carry refined products such as gasoline, jet fuel and diesel from refineries to terminals.', `The notes give the US scale as about 50,000 miles of crude lines and 87,000 miles of product lines, enough to circle the Earth about ${loops.toFixed(1)} times.`], stats: { crude: '50,000', prod: '87,000', loops: loops.toFixed(1) } },
    { short: 'Batches', tag: 'CONCEPT', title: 'Different fuels take turns in the same pipe', focus: ['ref', 'slug', 't1', 't2'], flows: ['f-gas', 'f-jet'],
      body: ['Products travel through the same pipe one after another in distinct batches, which the notes call slugs. Compatible slugs, such as high-octane and low-octane gasoline, can touch, and the small mixed interface is simply blended into the lower grade.', 'Incompatible products cannot mix. Jet fuel and gasoline, for example, must be kept apart.'] },
    { short: 'Pigs', tag: 'CONCEPT', title: 'A pig is the plug between batches', focus: ['ref', 'slug', 't1'], flows: ['f-gas'],
      body: ['To separate incompatible products, operators insert a plastic plug called a pig between the slugs. The name comes from the squealing sound it makes as pressure pushes it through the pipe.', 'A control room tracks every slug and pig so that the right product goes into the right tank at the destination terminal.'],
      callout: { k: 'key', t: 'For a data analyst: a pipeline delivery is a sequence of batches with a product, a volume and a time window. Every later terminal record depends on that being correct.' } },
    { short: 'Storage', tag: 'CONCEPT', title: 'Tanks and caverns are the buffer', focus: ['t1', 't2'], flows: [],
      body: ['Short-term storage is above-ground tanks at refineries and interchange points such as Cushing, Oklahoma, a major trading hub. Long-term storage is the Strategic Petroleum Reserve, held in hollowed-out salt domes along the Gulf Coast as an emergency supply.', 'The notes put total US storage capacity at about 730 million barrels.'], stats: { stor: '730' } },
    { short: 'Ships', tag: 'CONCEPT', title: 'Tankers and lightering', focus: ['ship'], flows: [],
      body: ['An ultra large crude carrier can hold about 3 million barrels, roughly a day of Brazil’s consumption according to the notes. These ships are often too deep for harbors.', 'In lightering, the giant tanker anchors offshore and smaller vessels carry the crude to shore.'] },
    { short: 'Ohio modes', tag: 'CONCEPT', title: 'How Cenovus product reaches customers', focus: ['ref', 'rail', 'trk', 'mode'], flows: ['f-dis', 'f-rail'],
      body: ['Cenovus says its refined products move by pipeline and rail car to primary markets in Ohio, Illinois, Indiana, Pennsylvania and southern Michigan. From a terminal, trucks make the last miles.', 'Each mode produces its own paperwork and data: batch tickets for pipelines, car numbers for rail and bills of lading for trucks. The next lesson looks at the terminal where it all meets customers.'],
      callout: { k: 'know', t: 'The mode summary is from Cenovus’s public operations page. It says nothing about the systems behind it.' } },
  ],
};
