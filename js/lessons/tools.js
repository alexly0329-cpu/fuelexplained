import { list, table, code } from './cards.js';

// Core. Tool families are described by what they are for, in general terms. Nothing here claims how any employer uses them.
export default {
  id: 'tools', group: 'role', title: 'The Analyst Toolbox: ETL, BI and Automation', icon: 'layers', time: 11, level: 'Beginner',
  tagline: 'What ETL means and what each tool in the posting is for, grouped by job, with the Diesel Monitor as the worked example of one pipeline.',
  stats: [
    { id: 'e', label: 'Extract', icon: 'download' }, { id: 't', label: 'Transform', icon: 'filter' },
    { id: 'l', label: 'Load', icon: 'database' }, { id: 'r', label: 'Report', icon: 'chart' },
  ],
  legend: [['#b8c940', 'source'], ['#7c63d0', 'prep'], ['#2a9d8f', 'report']],
  learn: [
    { t: 'What ETL means in one picture', at: 0 }, { t: 'What extract, transform and load each do', at: 1 },
    { t: 'What BI tools are for and how they differ', at: 2 }, { t: 'When paginated and enterprise reports fit', at: 3 },
    { t: 'What automation tools add', at: 4 }, { t: 'How to map your tools to the ones you have not used', at: 5 },
  ],
  build(s) {
    s.floor(10, 10, 'concrete');
    s.box('src', 0.6, 3.0, 0, 1.6, 2.2, 0.8, 'cream', { label: { t: 'source files', icon: 'file' } });
    s.box('etl', 3.4, 3.0, 0, 2.0, 2.2, 1.0, 'violet', { from: 0, label: { t: 'ETL', icon: 'filter' } });
    s.box('db', 6.2, 1.2, 0, 1.6, 1.6, 0.8, 'blue', { from: 1, label: { t: 'data model', icon: 'database' } });
    s.box('bi', 6.6, 5.2, 0, 2.0, 2.0, 1.0, 'teal', { from: 2, label: { t: 'BI report', icon: 'chart' } });
    s.box('auto', 2.8, 7.0, 0, 2.0, 1.4, 0.7, 'yellow', { from: 4, label: { t: 'automation', icon: 'clock' } });
    s.flow('a', [[2.2, 4.1, 0.05], [3.4, 4.1, 0.05]], 'data', { from: 0 });
    s.flow('b', [[5.4, 3.6, 0.05], [6.2, 2.4, 0.05]], 'data', { from: 1 });
    s.flow('c', [[7.0, 2.8, 0.05], [7.4, 5.2, 0.05]], 'data', { from: 2 });
    s.card('cetl', 'ETL', list([['Extract', 'pull from source systems'], ['Transform', 'clean, join, define'], ['Load', 'write to a model']], { gap: 36 }), { w: 300, h: 140, from: 0, until: 0 });
    s.card('ex', 'WORKED EXAMPLE', code(['Diesel Monitor pipeline', '', 'extract    3 public CSV exports', 'transform  SQL joins on PurchId,', '           SourceDocumentHeader', 'load       data.json for the site', 'report     static dashboard'], { y0: 38, gap: 15 }), { w: 300, h: 148, from: 1, until: 1 });
    s.card('cbi', 'BI TOOLS', table(['tool', 'known for'], [['Power BI', 'DAX, Microsoft stack'], ['Tableau', 'visual exploration'], ['Spotfire', 'interactive analytics']], { cols: [12, 90], y0: 34, rowH: 26, W: 292 }), { w: 300, h: 130, from: 2, until: 2 });
    s.card('ent', 'ENTERPRISE REPORTING', table(['tool', 'known for'], [['SSRS', 'paginated, scheduled'], ['BusinessObjects', 'SAP reporting layer'], ['Excel', 'pivot tables, models']], { cols: [12, 100], y0: 34, rowH: 26, W: 292 }), { w: 300, h: 130, from: 3, until: 3 });
    s.card('aut', 'AUTOMATION', table(['tool', 'known for'], [['Alteryx', 'visual data workflows'], ['UiPath', 'robotic process automation'], ['PowerShell, VBScript', 'Windows scripting']], { cols: [12, 120], y0: 34, rowH: 26, W: 292 }), { w: 300, h: 130, from: 4, until: 4 });
    s.card('map', 'IF YOU HAVE NOT USED IT', list([['Name the family', 'prep, BI, automation'], ['Name your tool', 'SQL, Python, Power BI'], ['Say the idea', 'same steps, new screen']], { gap: 36 }), { w: 300, h: 140, from: 5, until: 5 });
  },
  steps: [
    { short: 'ETL', tag: 'CONCEPT', title: 'ETL is extract, transform, load', focus: ['src', 'etl', 'cetl'], flows: ['a'], stats: { e: 'pull', t: 'clean, join', l: 'store', r: 'show' },
      body: ['Every reporting job follows the same loop: extract data from source systems, transform it (clean, join, define), load it into a model, and report from that model. “ETL” is the name for the first three steps.', 'The tools in the posting are different ways to do one of these four steps. Once you can place a tool in the loop, you can talk about it without having used it.'] },
    { short: 'E, T, L', tag: 'METHOD', title: 'The loop on a real pipeline', focus: ['src', 'etl', 'db', 'ex'], flows: ['a', 'b'],
      body: ['The Diesel Monitor is a small ETL pipeline. It extracts three public CSV exports, transforms them with SQL joins on the published keys, loads the result into a data file, and reports from that file in a static dashboard.', 'Work lessons on the joins and flags show each step with real records.'],
      callout: { k: 'know', t: 'Most of the effort is in transform: definitions, joins and checks, not in drawing the chart.' } },
    { short: 'BI tools', tag: 'CONCEPT', title: 'BI tools: Power BI, Tableau, Spotfire', focus: ['db', 'bi', 'cbi'], flows: ['c'],
      body: ['These tools connect to a data model and let people explore it with charts and filters. Power BI has DAX measures and ties into the Microsoft stack, Tableau is known for visual exploration, and Spotfire for interactive analytics. The ideas carry across all three: a model, measures, filters and a refresh.', 'If you know star schemas, measures versus calculated columns and scheduled refresh, you can describe any of them. The lessons in the Analyst desk group cover those.'] },
    { short: 'Reports', tag: 'CONCEPT', title: 'Paginated and enterprise reporting', focus: ['bi', 'ent'], flows: [],
      body: ['Some reporting is not exploratory. SSRS is Microsoft’s tool for fixed-layout, paginated reports that run on a schedule, and SAP BusinessObjects is a reporting layer over enterprise data. Excel with PivotTables sits underneath nearly all of it.', 'The difference to remember: a dashboard invites questions, a paginated report answers a known one the same way every time.'] },
    { short: 'Automation', tag: 'CONCEPT', title: 'Automation: Alteryx, UiPath, scripts', focus: ['auto', 'aut'], flows: [],
      body: ['Alteryx builds data-preparation workflows visually, so repeated clean-and-join steps become a saved flow. UiPath is robotic process automation, which drives screens and files the way a person would. PowerShell and VBScript are scripting languages used on Windows for file and job automation.', 'All three exist to remove a repeated manual step. The question to ask about any task is: how often does it run, and what happens when it breaks?'] },
    { short: 'Mapping', tag: 'ROLE', title: 'Mapping what you know to what you do not', focus: ['src', 'etl', 'bi', 'map'], flows: [],
      body: ['A clear way to answer “have you used X?” is to name the family, name the tool you have used for the same job, and describe the idea. For example: Alteryx is visual data prep; I do the same joins and cleaning in SQL and Python and have built a repeatable pipeline.', 'Say plainly what you have not used. Pair it with how you would learn it and what you would build first.'],
      callout: { k: 'key', t: 'Honest mapping beats bluffing. A named gap with a learning plan is a stronger answer than a vague yes.' } },
  ],
};
