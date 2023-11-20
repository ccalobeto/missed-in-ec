// Released under the ISC license.
// Adaptation of https://observablehq.com/@d3/choropleth/2?intent=fork
import * as scale from 'https://cdn.skypack.dev/d3-scale@4'
import * as geo from 'https://cdn.jsdelivr.net/npm/d3-geo@3/+esm'
import * as selection from 'https://cdn.skypack.dev/d3-selection@3'
import { width, height } from './constants.js'
import * as chromactic from 'https://cdn.skypack.dev/d3-scale-chromatic@3'

export function choropleth (idContainer, data, {
  id,
  value,
  statemap,
  features,
  borders,
  legendTitle,
  projection,
  domain
} = {}) {
  // const range = d3.extent(data, d => d[value])
  // const color = d3.scaleQuantize(domain, d3.schemeReds[9]);
  // console.log(interpolate.interpolateReds)
  const color = scale.scaleSequential(domain, chromactic.interpolateReds)
  const path = geo.geoPath(projection)
  const format = d => `${d}%`
  const valuemap = new Map(data.map(d => [d[id], d[value]]))

  const svg = selection.select(idContainer) // 975, 610
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto;')

  //   svg.append('g')
  //     .attr('transform', 'translate(610,20)')
  //     .append(() => Legend(color, { title: legendTitle, width: 260 }))

  svg.append('g')
    .selectAll('path')
    .data(features)
    .join('path')
    .attr('fill', d => valuemap.get(d.id) !== undefined ? color(valuemap.get(d.id)) : '#E0E1E2')
    .attr('d', path)
    .append('title')
    .text(d => `${d.properties.name}(canton Id:${d.id}), ${statemap.get(d.id.slice(0, 2)).properties.name}\nRelativa: ${valuemap.get(d.id)}`)

  svg.append('path')
    .datum(borders)
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-linejoin', 'round')
    .attr('d', path)

  return svg.node()
}
