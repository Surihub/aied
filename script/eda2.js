import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Load the data from the CSV file
d3.csv("https://raw.githubusercontent.com/seaborn/seaborn-data/master/penguins.csv").then(data => {
    // 데이터 전처리
    data = data.filter(d => d.bill_length_mm !== "" && d.bill_depth_mm !== "" && d.flipper_length_mm !== "" && d.body_mass_g !== "");

    data.forEach(d => {
        d.bill_depth_mm = +d.bill_depth_mm;
        d.bill_length_mm = +d.bill_length_mm;
        d.body_mass_g = +d.body_mass_g;
        d.flipper_length_mm = +d.flipper_length_mm;
        d.species = d.species;
        d.island = d.island;
        d.sex = d.sex;
    });


    
    // 각 차트를 그리는 함수를 호출
    drawScatterPlot(data, 'bill_length_mm', 'bill_depth_mm', 'species');
    drawPieChart(data, 'species');
    drawHistogram(data, 'body_mass_g', 'sex', 2500, 100, 0.3);
});


function drawScatterPlot(data, xVar, yVar, category) {
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
        .domain(d3.extent(data, d => d[xVar]))
        .range([0, width - margin.left - margin.right]);
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[yVar]))
        .range([height - margin.top - margin.bottom, 0]);

    // 색상 스케일 설정
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

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
        .attr('cx', d => xScale(d[xVar]))
        .attr('cy', d => yScale(d[yVar]))
        .attr('r', 5)
        .attr('fill', d => colorScale(d[category]));
}
function drawPieChart(data, category) {
    // SVG 크기 설정
    const width = 450, height = 450;
    const radius = Math.min(width, height) / 2;

    // SVG 생성
    const svg = d3.select('#pie-chart').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // 범주별 데이터 집계
    const categoryCount = d3.rollup(data, v => v.length, d => d[category]);

    // 파이 생성
    const pie = d3.pie().value(d => d[1]);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    // 색상 스케일 설정
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // 파이 차트 조각 그리기
    svg.selectAll('path')
        .data(pie(Array.from(categoryCount)))
        .enter().append('path')
        .attr('d', arc)
        .attr('fill', d => colorScale(d.data[0]))
        .attr('stroke', 'white')
        .style('stroke-width', '2px');

    // 라벨 추가
    const labelArc = d3.arc().innerRadius(radius - 40).outerRadius(radius - 40);
    svg.selectAll('text')
        .data(pie(Array.from(categoryCount)))
        .enter().append('text')
        .attr('transform', d => `translate(${labelArc.centroid(d)})`)
        .attr('dy', '0.35em')
        .text(d => `${d.data[0]} (${d.data[1]})`)
        .style('text-anchor', 'middle');
}

function drawHistogram(data, numericVar, categoryVar, binStart, binSize, opacity) {
    // SVG 크기 설정
    const width = 600, height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    // SVG 생성
    const svg = d3.select('#histogram').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // 색상 스케일 설정
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // x축 스케일 및 히스토그램 생성기 설정
    const xMax = d3.max(data, d => d[numericVar]);
    const xScale = d3.scaleLinear()
        .domain([binStart, xMax])
        .range([0, width - margin.left - margin.right]);

    const histogram = d3.histogram()
        .value(d => d[numericVar])
        .domain(xScale.domain())
        .thresholds(d3.range(binStart, xMax, binSize));

    // 범주별로 히스토그램 데이터 생성
    const histograms = Array.from(new Set(data.map(d => d[categoryVar]))).map(category => {
        return {
            category: category,
            histogram: histogram(data.filter(d => d[categoryVar] === category))
        };
    });

    // y축 스케일 설정
    const yMax = d3.max(histograms, cat => d3.max(cat.histogram, d => d.length));
    const yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([height - margin.top - margin.bottom, 0]);

    // 축 추가
    svg.append('g')
        .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(xScale));
    svg.append('g').call(d3.axisLeft(yScale));

    // 히스토그램 그리기
    histograms.forEach((catHistogram, i) => {
        svg.selectAll(`.bar-${i}`)
            .data(catHistogram.histogram)
            .enter().append('rect')
            .attr('class', `bar-${i}`)
            .attr('x', d => xScale(d.x0))
            .attr('y', d => yScale(d.length))
            .attr('width', d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
            .attr('height', d => height - margin.top - margin.bottom - yScale(d.length))
            .attr('fill', colorScale(catHistogram.category))
            .style('opacity', opacity); // 투명도 설정
    });
}
