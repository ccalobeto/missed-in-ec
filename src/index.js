import * as topojson from 'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm'
import { csv, json } from 'https://cdn.skypack.dev/d3-fetch@3'
import * as array from 'https://cdn.jsdelivr.net/npm/d3-array@3/+esm'
import * as scale from 'https://cdn.skypack.dev/d3-scale@4'
import { pieChart } from './js/piechart.js'
import { barChart } from './js/barchart.js'
import { choropleth } from './js/choropleth.js'
import { monthToName, colorData, width, height, colorSexData, colorAgeData } from './js/constants.js'
import { colorBars, join } from './js/transform.js'
import { percentageAggregations, spatialAggregation } from './js/math.js'
import * as geo from 'https://cdn.jsdelivr.net/npm/d3-geo@3/+esm'

const url = 'https://cdn.jsdelivr.net/npm/ec-atlas@0.0.7/ecuador-transverse_mercator-50k.json'
const path = './src/nb/data/output/missed_ec_prep.csv'
const pathWithIds = './src/nb/data/output/missed_ec_prep_with_parish_id.csv'
const pathCat = './src/nb/data/support/categories.csv'
const pathPop = './src/nb/data/support/proyeccion_cantonal_total_2010-2020.csv'

const ec = await json(url)
const rawData = await csv(path)
const dataWithLevelsId = await csv(pathWithIds)
const categories = await csv(pathCat)
const population = await csv(pathPop)
const categoriesMap = array.group(categories, d => d.motivo_desaparicion_obs)

// preparing data
const data = rawData.map((d, i) => ({
  index: i,
  province: d.provincia,
  latitude: d.latitud,
  longitude: d.longitud,
  sex: d.sexo,
  disappearance_reason: d.motivo_desaparicion_obs,
  state: d.situacion_actual,
  year: d.year,
  month: monthToName[d.month],
  age_group: d.age_group,
  days_gone: d.days_gone,
  tipology: categoriesMap.get(d.motivo_desaparicion_obs)[0].tipology,
  category: categoriesMap.get(d.motivo_desaparicion_obs)[0].category
}))
const foundPeople = data.filter(d => d.tipology !== 'SIN_DATO')
const donutData = percentageAggregations(foundPeople, 'tipology')
const barData = percentageAggregations(foundPeople, 'category')
const donutSexData = percentageAggregations(data, 'sex')
const donutAgeData = percentageAggregations(data, 'age_group')

const parishes = topojson.feature(ec, ec.objects.level4)
const cantons = topojson.feature(ec, ec.objects.level3)
const provinces = topojson.feature(ec, ec.objects.level2)
const provincemap = new Map(provinces.features.map(d => [d.id, d]))
const provinceMesh = topojson.mesh(ec, ec.objects.level2)
const nation = topojson.mesh(ec, ec.objects.level1)

const cantonPopulationBy2020 = population.map(d => ({
  cantonId: d.Codigo,
  cantonName: d['Nombre de canton'],
  population: d['2020']
}))
const aggData = spatialAggregation(dataWithLevelsId, 'cantonId', 'cantonId')
const joined = join(aggData, cantonPopulationBy2020, 'id', 'cantonId')
const dataMap = joined.map(d => ({
  id: d.id,
  value: d.value,
  valuePer10k: Math.round((d.value / d.population) * 10000)
}))

const donutColorScale = scale.scaleOrdinal().domain(colorData.map(d => d.tipology)).range(colorData.map(d => d.color))
const barColors = colorBars(categories, colorData)
const colors = barColors.map(d => d.color)
const barColorScale = scale.scaleOrdinal().domain(barColors.map(d => d.category)).range(colors)
const donutSexColorScale = scale.scaleOrdinal().domain(colorSexData.map(d => d.sex)).range(colorSexData.map(d => d.color))
const donutAgeColorScale = scale.scaleOrdinal().domain(colorAgeData.map(d => d.sex)).range(colorAgeData.map(d => d.color))

// observable Inhye Lee
const projection = geo
  .geoIdentity()
  .reflectY(true)
  .fitSize([width, height], nation)

pieChart('#donutchart1', donutData, donutColorScale)
barChart('#barchart', barData, barColorScale)
pieChart('#donutchart2', donutSexData, donutSexColorScale)
pieChart('#donutchart3', donutAgeData, donutAgeColorScale)
choropleth('#choropleth', dataMap, {
  id: 'id',
  value: 'valuePer10k',
  statemap: provincemap,
  features: cantons.features,
  borders: provinceMesh,
  legendTitle: 'Missing People per 10k',
  projection,
  domain: [0, 10]
})
