import { list, table } from './cards.js';

// Core. The role as described in the public Cenovus posting (Marketing Operations Data Analyst, Columbus/Dublin, Ohio). Public information only: no interview material, no names.
// The posting wording can change, so the lesson says to re-read the current posting. Refinery and market facts come from Cenovus public pages and trade press.
export default {
  id: 'role', group: 'role', title: 'The Role: Marketing Operations Data Analyst', icon: 'target', time: 9, level: 'Beginner',
  tagline: 'What a marketing operations data analyst at a refiner and marketer does, what data it touches, which tools the posting names and which lessons here map to each duty.',
  stats: [
    { id: 'ref', label: 'US refineries', icon: 'factory' }, { id: 'sites', label: 'Home refineries', icon: 'pin' },
    { id: 'tools', label: 'Tool families', icon: 'layers' }, { id: 'path', label: 'Lessons here', icon: 'book' },
  ],
  legend: [['#b8c940', 'product'], ['#7c63d0', 'data'], ['#2a9d8f', 'report']],
  learn: [
    { t: 'The job in one sentence', at: 0 }, { t: 'Where marketing operations sits in the fuel chain', at: 1 },
    { t: 'Which data an analyst works with', at: 2 }, { t: 'Which questions the reports answer', at: 3 },
    { t: 'Which tools the posting names, grouped by job', at: 4 }, { t: 'A study path through this site', at: 5 }, { t: 'What this site does and does not claim', at: 6 },
  ],
  build(s) {
    s.floor(10, 10, 'cream');
    s.cyl('rf', 1.4, 1.6, 0, 1.0, 1.7, 'steel', { label: { t: 'refineries', icon: 'factory' } });
    s.box('tm', 4.4, 1.2, 0, 1.6, 1.6, 0.8, 'blue', { from: 1, label: { t: 'terminals', icon: 'pin' } });
    s.box('cu', 7.2, 2.4, 0, 1.6, 1.6, 0.8, 'cream', { from: 1, label: { t: 'customers', icon: 'truck' } });
    s.box('mo', 4.0, 5.4, 0, 2.6, 1.8, 1.1, 'white', { from: 0, label: { t: 'marketing ops data', icon: 'database' } });
    s.box('rp', 7.2, 6.8, 0, 1.6, 1.4, 0.8, 'teal', { from: 3, label: { t: 'reports', icon: 'chart' } });
    s.flow('p1', [[2.4, 2.4, 0.05], [4.4, 2.0, 0.05]], 'gasoline', { from: 1 });
    s.flow('p2', [[6.0, 2.0, 0.05], [7.2, 3.0, 0.05]], 'diesel', { from: 1 });
    s.flow('d1', [[2.0, 3.2, 0.05], [4.0, 6.2, 0.05]], 'data', { from: 2 });
    s.flow('d2', [[6.6, 6.2, 0.05], [7.2, 7.4, 0.05]], 'data', { from: 3 });
    s.card('job', 'THE JOB', list([['Build', 'reports, dashboards, KPIs'], ['Improve', 'Marketing Support processes and tools'], ['Explain', 'what the numbers mean']], { gap: 36 }), { w: 300, h: 140, from: 0, until: 0 });
    s.card('chain', 'THE FUEL CHAIN', list([['Refine', 'Lima, Toledo, Superior'], ['Move', 'pipeline, rail, truck'], ['Sell', 'rack, contract, spot'], ['Bill', 'invoice and ledger']], { gap: 32 }), { w: 300, h: 160, from: 1, until: 1 });
    s.card('data', 'DATA IT TOUCHES', list([['Orders', 'who, what, how much'], ['Loadings', 'what left the terminal'], ['Prices', 'benchmark and contract'], ['Invoices', 'what was billed']], { gap: 32 }), { w: 300, h: 160, from: 2, until: 2 });
    s.card('kpi', 'QUESTIONS REPORTS ANSWER', list([['How much?', 'volume by product, customer'], ['At what price?', 'against a benchmark'], ['Is it billed?', 'match rate, invoice lag'], ['What moved?', 'variance and drivers']], { gap: 32 }), { w: 300, h: 160, from: 3, until: 3 });
    s.card('tool', 'TOOLS BY JOB', table(['job', 'named in posting'], [['report', 'Power BI, Tableau, Spotfire'], ['paginated', 'SSRS, BusinessObjects'], ['prep / ETL', 'SQL, R, Alteryx, Oracle'], ['automate', 'UiPath, VBScript, PowerShell']], { cols: [12, 84], y0: 34, rowH: 24, W: 292 }), { w: 300, h: 150, from: 4, until: 4 });
    s.card('path', 'STUDY PATH', list([['1', 'The role and the tools'], ['2', 'The barrel and the chain'], ['3', 'Order data and KPIs'], ['4', 'SQL and BI desk'], ['5', 'Work: Diesel Monitor']], { gap: 30 }), { w: 300, h: 176, from: 5, until: 5 });
    s.card('scope', 'SCOPE OF THIS SITE', list([['Public sources', 'posting, company pages, trade press'], ['No inside info', 'no interview material'], ['Check', 'the current posting yourself']], { gap: 36 }), { w: 300, h: 140, from: 6, until: 6 });
  },
  steps: [
    { short: 'The job', tag: 'ROLE', title: 'Build the reports, improve the process', focus: ['mo', 'job'], flows: [],
      body: ['In the public posting, a marketing operations data analyst designs BI reports, dashboards and KPIs for the refined-products marketing team, and helps improve the processes and tools of the Marketing Support group.', 'It is a data job inside a commercial team. The analyst is not setting prices or trading; the analyst makes the numbers about orders, volumes, prices and invoices trustworthy and easy to read for the people who do.'],
      callout: { k: 'know', t: 'Re-read the current posting before you rely on any detail here. Postings change, and this lesson summarises a public version.' }, stats: { path: '26' } },
    { short: 'The chain', tag: 'CONCEPT', title: 'Where marketing operations sits', focus: ['rf', 'tm', 'cu', 'chain'], flows: ['p1', 'p2'],
      body: ['Cenovus refines at Lima and Toledo in Ohio and at Superior in Wisconsin, and its public pages say refined products move by pipeline and rail to markets in Ohio, Illinois, Indiana, Pennsylvania and southern Michigan. Products are loaded at terminals, sold at rack, contract or spot prices, then invoiced.', 'Marketing operations is the data and process layer around that sale: it keeps the order, loading, price and invoice records consistent so the commercial team can report on them.'], stats: { ref: '3', sites: '3' } },
    { short: 'Data', tag: 'DATA', title: 'Four kinds of records', focus: ['mo', 'data'], flows: ['d1'],
      body: ['Most of the work sits on four record types: orders (customer, product, quantity), loadings (what physically left a terminal), prices (a benchmark plus a contract differential) and invoices (what was billed). They live in different systems, so joining them is a daily task.', 'Later lessons follow each one: Order to Cash, Where Records Break, and the SQL drills.'] },
    { short: 'Questions', tag: 'CONCEPT', title: 'What the reports have to answer', focus: ['rp', 'kpi'], flows: ['d2'],
      body: ['Typical questions are how much was sold by product and customer, at what price against a benchmark, how much is still unbilled, and what moved a number from one period to the next. Each becomes a KPI with a definition, a grain and a known trap.', 'The KPI lesson and the “Why Did the Number Move?” lesson give you a working method for both kinds.'] },
    { short: 'Tools', tag: 'CONCEPT', title: 'The tools named in the posting', focus: ['mo', 'tool'], flows: [],
      body: ['The posting names reporting tools (Power BI, Tableau, Spotfire, SSRS, SAP BusinessObjects), data-preparation and ETL tools (SQL, R, Alteryx, Oracle) and automation (UiPath, VBScript, PowerShell). Nobody is expected to have used all of them.', 'The Analyst Toolbox lesson explains what each family is for, so you can say what you have used and map what you have not.'], stats: { tools: '3' } },
    { short: 'Path', tag: 'METHOD', title: 'A study path through this site', focus: ['path'], flows: [],
      body: ['Start with the Toolbox lesson, then The Barrel and Moving & pricing for the business, then Marketing operations data for the order-to-invoice logic, then the Analyst desk for SQL and BI, and finish with the Work lessons, which put it all on real public records.', 'If you are short of time, the shortest useful path is: Order to Cash, KPIs for Order Data, SQL Matching Drills, Star Schema and Measures, then the Diesel Monitor overview.'] },
    { short: 'Scope', tag: 'PROBLEM', title: 'What this site does and does not claim', focus: ['scope'], flows: [],
      body: ['Everything here comes from public sources or from my own independent portfolio project. It makes no claim about how any company’s internal systems, data or teams work, and the examples that use dollar figures are invented unless a source is named.', 'The site is practice for the data and fuel-marketing concepts behind this kind of role, not a description of the employer.'],
      callout: { k: 'key', t: 'Know the limits of your sources and say them. It is the habit the role itself depends on.' } },
  ],
};
