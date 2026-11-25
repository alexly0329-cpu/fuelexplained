// Real figures from the public Columbus Diesel Order Monitor snapshot (data as of Nov 5, 2026), copied from its data.json.
// Source: github.com/alexly0329-cpu/cmh_diesel_monitor (site/data.json, docs/methodology.md, docs/verification.md). Public City Auditor records only.
export const SNAP = {
  asOf: 'Nov 5, 2026', orders: 348, matched: 332, unmatched: 16, gallons: 379459, fuel: 1458092.55, poTotal: 2031326.82, invTotal: 1951588.40,
  exact: 7, minor: 325, material: 0, threshold: 25, annualBid: 600000,
};
export const MONTHS = [
  ['Jan', 26, 34326, 7], ['Feb', 25, 23903, 1], ['Mar', 32, 39537, 0], ['Apr', 47, 51037, 0], ['May', 31, 32700, 3],
  ['Jun', 42, 54139, 0], ['Jul', 35, 38036, 0], ['Aug', 25, 21665, 1], ['Sep', 55, 48734, 1], ['Oct', 30, 35382, 3],
]; // [month, orders, ordered gallons, follow-up records]
// The 16 orders with no invoice in the loaded 2026 journal: [PO, listed date, ordered gallons, PO total]
export const UNMATCHED = [
  ['PO545874', '2026-01-02', 3201, 11770.12], ['PO545876', '2026-01-02', 2941, 10813.58], ['PO545879', '2026-01-02', 501, 1330.50], ['PO545882', '2026-01-02', 160, 549.33],
  ['PO545887', '2026-01-02', 551, 1463.81], ['PO545888', '2026-01-02', 404, 1479.47], ['PO545890', '2026-01-02', 3189, 11739.26], ['PO551373', '2026-02-12', 701, 2099.54],
  ['PO567092', '2026-05-14', 200, 1489.72], ['PO567097', '2026-05-14', 2577, 19184.75], ['PO567122', '2026-05-14', 969, 7214.35], ['PO580798', '2026-08-07', 196, 1163.21],
  ['PO584696', '2026-09-01', 627, 2696.69], ['PO589764', '2026-10-02', 245, 1733.37], ['PO593348', '2026-10-26', 288, 1560.33], ['PO593351', '2026-10-26', 608, 3291.25],
];
// The worked example the Monitor uses to check its own build.
export const PO = {
  id: 'PO585255', date: '2026-09-03', gallons: 503, fuel: 2152.94, tax: 399.00, total: 2551.94,
  invoice: '118456COC26', invDate: '2026-09-09', invTotal: 2551.76, voucher: 'APIN111539324', header: '5642473923', acct: [398.82, 2152.94],
};
// Invoice lag in days from the listed PO-line date to the invoice date, for the 332 matched orders.
// Computed for this lesson from the public snapshot; it is not published on the Monitor itself.
export const LAG = { n: 332, min: 1, median: 4, mean: 4.7, p90: 6, max: 59, bins: [['1-3 days', 93], ['4-7 days', 228], ['8-14 days', 9], ['15-30 days', 1], ['over 30', 1]] };
export const fmt$ = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
export const fmt0 = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });
