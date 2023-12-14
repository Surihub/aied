import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const data = await d3.csv("iris.csv");
console.log(data);

const width = 500;
const height = 500;
const marginTop = 30;
const marginRight = 30;
const marginBottom = 30;
const marginLeft = 30;
const color = d3.scaleOrdinal(d3.schemeTableau10);


const x = d3.scaleLinear()
            .domain([
              d3.min(data, d => d.sepal_length),
              d3.max(data, d => d.sepal_length)
            ])
            .range([marginLeft, width - marginRight])
          
          
const y = d3.scaleLinear()
          .domain([
            d3.min(data, d => d.sepal_width),
            d3.max(data, d => d.sepal_width)
          ])
          .range([height-marginBottom, marginTop])


const canvas = d3.select(".canvas");
const svg = canvas.append('svg')
                  .attr('height', height)
                  .attr('width', width)


const circles = svg.selectAll("circle")
  .data(data)
  .join('circle')
    .attr('cx', d => x(d.sepal_length))
    .attr('cy', d => y(d.sepal_width))
    .attr('r', d => 5)
    .attr('fill', d => color(d.variety))
    .on('mouseover', mouseover)
    .on('mouseout', mouseout);


const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y);

const gx = svg.append('g')
            .attr('transform', translate(0, height-marginBottom))
            .call(xAxis);

const gy = svg.append('g')
            .attr('transform', translate(marginLeft, 0))
            .call(yAxis)

function translate(x, y) {
  return 'translate(' + x + ', ' + y + ')';
}



const tooltip = d3.select('.canvas').append('div')
                .attr('class', 'tooltip')
                .style('opacity', '0')


function mouseover(event, d) {
  tooltip
    .style('opacity', '1')
    .html('Sepal length: ' + d.sepal_length + '<br/> \
            Sepal width: ' + d.sepal_width + '<br/> \
            Variety: ' + d.variety)
    .style('left', (d3.pointer(event)[0] + 30) + 'px')
    .style('top', (d3.pointer(event)[1] + 0) + 'px')
    
}

function mouseout(event) {
  tooltip
    .style('opacity', '0')
    .style('left', '0px')
    .style('top', '0px')
}

                