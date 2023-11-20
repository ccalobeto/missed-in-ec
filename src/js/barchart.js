import * as selection from 'https://cdn.skypack.dev/d3-selection@3'
import * as scale from 'https://cdn.skypack.dev/d3-scale@4'
import * as axis from 'https://cdn.skypack.dev/d3-axis@3'
import * as format from 'https://cdn.skypack.dev/d3-format@3'
import * as array from 'https://cdn.jsdelivr.net/npm/d3@7/+esm'
import { width, height } from './constants.js'

export function barChart (id, data, barColorScale) {
  // pass data with category and value keys

  const margin = ({ top: 10, bottom: 45, left: 160, right: 70 })
  const visWidth = width - margin.left - margin.right
  const visHeight = height - margin.top - margin.bottom
  const maxValue = array.max(data, d => d.value)

  const xScale = scale.scaleLinear()
    .domain([0, maxValue])
    .range([0, visWidth])

  const yScale = scale.scaleBand()
    .domain(data.map(d => d.key))
    .range([0, visHeight])
    .padding(0.2)

  const xAxis = axis.axisBottom(xScale)
  const yAxis = axis.axisLeft(yScale)

  const svg = selection.select(id)
    .append('svg')
    .attr('width', visWidth + margin.left + margin.right)
    .attr('height', visHeight + margin.top + margin.bottom)

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  g.selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', 0)
    .attr('y', d => yScale(d.key))
    .attr('width', d => xScale(d.value))
    .attr('height', yScale.bandwidth())
    .attr('fill', d => barColorScale(d.key))

  g.selectAll('text')
    .data(data)
    .join('text')
    .attr('transform', d => `translate(${xScale(d.value)},${yScale(d.key)})`)
    .attr('fill', d => barColorScale(d.key))
    .attr('font-family', 'sans-serif')
    .attr('x', 3)
    .attr('y', yScale.bandwidth() / 2)
    .text(d => format.format('.2%')(d.value))
    .style('font-size', '12')

  g.append('g')
    .call(yAxis)
    .call(g => g.select('.domain').remove())

  return svg.node()
}
