import { arc, pie } from 'https://cdn.jsdelivr.net/npm/d3-shape@3/+esm'
import { select } from 'https://cdn.skypack.dev/d3-selection@3'
import { width, height } from './constants.js'

export function pieChart (id, data, colorScale) {
  const svg = select(id) // 975, 610
    .append('svg')
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto;')

  const arc_ = arc()
    .innerRadius(0.5 * height / 2)
    .outerRadius(0.85 * height / 2)

  const pie_ = pie()
    .value(d => d.value)

  const labelArcs = arc()
    .innerRadius(0.95 * height / 2)
    .outerRadius(0.95 * height / 2)

  const pieArcs = pie_(data)

  svg.append('g')
    .attr('class', 'donut-container')
    .attr('transform', `translate(${width / 2},${height / 2})`)
    .selectAll('path')
    .data(pieArcs)
    .join('path')
    .style('stroke', 'white')
    .style('stroke-width', 2)
    .style('fill', d => colorScale(d.data.key))
    .attr('d', d => arc_(d))

  const text = svg.append('g')
    .attr('class', 'labels-container')
    .attr('transform', `translate(${width / 2},${height / 2})`)
    .selectAll('text')
    .data(pieArcs)
    .join('text')
    .attr('transform', d => `translate(${labelArcs.centroid(d)})`)
    .attr('text-anchor', 'middle')

  text.selectAll('tspan')
    .data(d => {
      const percentage = d.data.value * 100
      return [d.data.key, percentage.toFixed(2) + ' %'
      ]
    })
    .join('tspan')
    .attr('x', 0)
    .style('font-family', 'sans-serif')
    .style('font-size', 12)
    .style('font-weight', (d, i) => i ? undefined : 'bold')
    .style('fill', '#222')
    .attr('dy', (d, i) => i ? '1.2em' : 0)
    .text(d => d)

  return svg.node()
}
