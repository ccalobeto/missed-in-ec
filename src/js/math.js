import { rollup, descending, flatRollup } from 'https://cdn.jsdelivr.net/npm/d3-array@3/+esm'

export function percentageAggregations (data, category) {
  const found = data.length
  const aggregation = rollup(data, g => (g.length / found), d => d[category])
  return Array.from(aggregation,
    d => ({ key: d[0], value: d[1] })).sort((a, b) => descending(a.value, b.value))
}

export function spatialAggregation (data, keyFilter, keyAggregate) {
  // complete with sex, state, disappearance_reason
  const filtered = data.filter(d => !isNaN(d[keyFilter]))
  const aggregated = flatRollup(filtered, g => g.length, d => d[keyAggregate])
  return Array.from(aggregated,
    d => ({ id: d[0], value: d[1] }))
}
