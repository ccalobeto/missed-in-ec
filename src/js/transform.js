import * as array from 'https://cdn.jsdelivr.net/npm/d3-array@3/+esm'

export function join (arr1, arr2, key1, key2) {
  // keep the index of arr1
  const result = []
  for (let i = 0; i < arr1.length; i++) {
    result.push({
      ...arr1[i],
      ...(arr2.find((item) => item[key2] === arr1[i][key1]))
    })
  }
  return result
}

export function colorBars (support, colorData) {
  const categoriesFlat = array.flatRollup(support, d => d.length,
    g => g.tipology, g => g.category)
  const categories = Array.from(categoriesFlat, d => ({
    category: d[1],
    tipology: d[0]
  }))
  const results = join(categories, colorData, 'tipology', 'tipology')
  return results
}
