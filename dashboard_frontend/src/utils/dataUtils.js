//
// PUBLIC_INTERFACE
// Utilities for Market_Data transformation and aggregation with robustness for messy text/number fields.
//

/** Attempt to parse Acquisition_Cost or numeric text safely */
export function toNumberSafe(val) {
  if (val == null) return null;
  if (typeof val === 'number') return isFinite(val) ? val : null;
  try {
    const s = String(val).replace(/[^0-9.+-eE]/g, ''); // strip currency symbols, commas
    const n = parseFloat(s);
    return isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

/** Normalize string with fallback */
export function toStr(v, fallback = 'Unknown') {
  const s = String(v ?? '').trim();
  return s || fallback;
}

/** Normalize date-like string -> 'YYYY-MM-DD' if possible, else original string */
export function toDateKey(v) {
  if (v == null) return null;
  try {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  } catch {}
  // try common patterns like YYYY-MM-DD already
  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  return s || null;
}

/** Group by a key extractor and aggregate with reducer */
export function groupBy(rows, keyFn, reducer, initFactory) {
  const map = new Map();
  for (const r of rows) {
    const k = keyFn(r);
    if (!map.has(k)) map.set(k, initFactory ? initFactory() : 0);
    const prev = map.get(k);
    map.set(k, reducer(prev, r));
  }
  return map;
}

/** Cross-tabulation: group by rowKey and colKey to numeric aggregate */
export function crosstab(rows, rowKeyFn, colKeyFn) {
  const rowMap = new Map();
  const colSet = new Set();
  rows.forEach(r => {
    const rk = rowKeyFn(r);
    const ck = colKeyFn(r);
    colSet.add(ck);
    if (!rowMap.has(rk)) rowMap.set(rk, {});
    const row = rowMap.get(rk);
    row[ck] = (row[ck] || 0) + 1;
  });
  const columns = Array.from(colSet);
  const data = Array.from(rowMap.entries()).map(([rk, obj]) => {
    const item = { key: rk };
    columns.forEach(c => (item[c] = obj[c] || 0));
    return item;
  });
  return { data, columns };
}

/** Compute Pearson correlation coefficient between two numeric arrays of equal length */
export function pearsonCorrelation(x, y) {
  if (!x || !y || x.length !== y.length || x.length === 0) return null;
  const n = x.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
  for (let i = 0; i < n; i++) {
    const xi = x[i];
    const yi = y[i];
    if (!isFinite(xi) || !isFinite(yi)) return null;
    sumX += xi;
    sumY += yi;
    sumXY += xi * yi;
    sumXX += xi * xi;
    sumYY += yi * yi;
  }
  const num = n * sumXY - sumX * sumY;
  const den = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  if (den === 0) return 0;
  return num / den;
}

/** Bucketing helper for histograms */
export function histogramBuckets(values, bucketCount = 10) {
  const nums = values.filter(v => typeof v === 'number' && isFinite(v));
  if (!nums.length) return [];
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const width = (max - min) / (bucketCount || 1);
  const buckets = Array.from({ length: bucketCount }, (_, i) => ({
    min: min + i * width,
    max: i === bucketCount - 1 ? max : min + (i + 1) * width,
    count: 0,
  }));
  for (const v of nums) {
    let idx = Math.floor((v - min) / (width || 1));
    if (idx >= bucketCount) idx = bucketCount - 1;
    if (idx < 0) idx = 0;
    buckets[idx].count += 1;
  }
  return buckets.map(b => ({
    bucket: `${b.min.toFixed(1)} - ${b.max.toFixed(1)}`,
    count: b.count,
  }));
}
