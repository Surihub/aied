import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Load the data from the CSV file
d3.csv("https://raw.githubusercontent.com/seaborn/seaborn-data/master/penguins.csv").then(data => {
    // 데이터 전처리
    data.forEach(d => {
        d.body_mass_g = +d.body_mass_g;
        d.flipper_length_mm = +d.flipper_length_mm;
        // 다른 필요한 데이터 변환
    });

    // 각 차트를 그리는 함수를 호출
    drawScatterPlot(data);
    drawPieChart(data);
    drawBoxPlot(data);
});

function drawScatterPlot(data) {
// SVG 크기 설정
const width = 600, height = 400;
const margin = { top: 20, right: 20, bottom: 30, left: 50 };

// SVG 생성
const svg = d3.select('#scatter-plot').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// 스케일 설정
const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.bill_length_mm))
    .range([0, width - margin.left - margin.right]);
const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.body_mass_g))
    .range([height - margin.top - margin.bottom, 0]);

// 축 추가
svg.append('g')
    .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
    .call(d3.axisBottom(xScale));
svg.append('g').call(d3.axisLeft(yScale));

// 데이터 점 그리기
svg.selectAll('.dot')
    .data(data)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('cx', d => xScale(d.bill_length_mm))
    .attr('cy', d => yScale(d.body_mass_g))
    .attr('r', 5)
    .attr('fill', 'blue');
}

function drawPieChart(data) {
// SVG 크기 설정
const width = 450, height = 450;
const radius = Math.min(width, height) / 2;

// SVG 생성
const svg = d3.select('#pie-chart').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

// 종별 데이터 집계
const speciesCount = d3.rollup(data, v => v.length, d => d.species);

// 파이 생성
const pie = d3.pie().value(d => d[1]);
const arc = d3.arc().innerRadius(0).outerRadius(radius);

// 파이 차트 그리기
svg.selectAll('path')
    .data(pie(Array.from(speciesCount)))
    .enter().append('path')
    .attr('d', arc)
    .attr('fill', d => d3.schemeCategory10[d.index])
    .attr('stroke', 'white')
    .style('stroke-width', '2px');
}

function drawBoxPlot(data) {
// SVG 크기 설정
const width = 600, height = 400;
const margin = { top: 20, right: 20, bottom: 30, left: 50 };

// SVG 생성
const svg = d3.select('#box-plot').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// 스케일 및 축 설정
const xScale = d3.scaleBand()
    .range([0, width - margin.left - margin.right])
    .padding(0.1)
    .domain(data.map(d => d.species));
const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.body_mass_g)])
    .range([height - margin.top - margin.bottom, 0]);

svg.append('g')
    .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
    .call(d3.axisBottom(xScale));
svg.append('g').call(d3.axisLeft(yScale));

// 상자그림 로직 (중앙값, IQR 등 계산 필요)

// 여기에 상자그림 로직을 추가하세요. 상자그림은 좀 더 복잡하므로, 추가 계산이 필요합니다.
}

