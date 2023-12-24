import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// 열 통계 정보 계산 함수
function getColumnStatistics(data) {
    let columnInfo = {};

    // 각 열에 대한 통계 정보 계산
    for (let column in data[0]) {
        if (["species", "island", "sex"].includes(column)) {
            // 범주형 데이터 처리
            columnInfo[column] = [...new Set(data.map(d => d[column]))].join(', ');
        } else {
            // 수치형 데이터 처리
            const values = data.map(d => parseFloat(d[column])).filter(v => !isNaN(v));
            columnInfo[column] = `최소: ${Math.min(...values)}, 최대: ${Math.max(...values)}`;
        }
    }
    return columnInfo;
}

// HTML 테이블 열 제목에 툴팁 추가 함수
function addColumnTooltips(data) {
    const columnInfo = getColumnStatistics(data);
    const headers = document.querySelectorAll('th');

    headers.forEach(header => {
        let tooltip = null;

        header.addEventListener('mouseover', function() {
            const columnName = this.innerText.toLowerCase().replace(/ /g, "_");
            const tooltipText = columnInfo[columnName];

            // 툴팁 생성 및 스타일 설정
            tooltip = document.createElement('div');
            tooltip.style.position = 'absolute';
            tooltip.style.border = '1px solid black';
            tooltip.style.background = 'yellow';
            tooltip.style.padding = '5px';
            tooltip.style.zIndex = '1000';
            tooltip.innerText = tooltipText;

            // 툴팁 위치 설정
            tooltip.style.left = header.getBoundingClientRect().left + 'px';
            tooltip.style.top = (header.getBoundingClientRect().bottom + window.scrollY) + 'px';
            document.body.appendChild(tooltip);
        });

        header.addEventListener('mouseout', function() {
            if (tooltip) {
                document.body.removeChild(tooltip);
                tooltip = null;
            }
        });
    });
}


function drawPieChart(data, category) {
    // SVG 크기 설정
    const container = document.getElementById(`pie-${category}`);
    const width = container.clientWidth; // 컨테이너의 너비
    const height = width; // 원 그래프의 높이를 너비와 동일하게 설정
    const radius = Math.min(width, height) / 2;

    // 각 범주별 컨테이너에 SVG 생성
    const svg = d3.select(`#pie-${category}`).append('svg')
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

function drawBarChart(data, category) {
    // 컨테이너 요소의 크기를 기준으로 SVG 크기 설정
    const container = document.getElementById(`bar-${category}`);
    const width = container.clientWidth;
    const height = 300; // 막대 그래프의 고정된 높이
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // SVG 생성
    const svg = d3.select(`#bar-${category}`).append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // 범주별 데이터 집계
    const categoryCount = Array.from(d3.rollup(data, v => v.length, d => d[category]))
        .map(([key, value]) => ({ key, value }));

    // X 스케일 설정
    const x = d3.scaleBand()
        .range([0, width - margin.left - margin.right])
        .padding(0.1)
        .domain(categoryCount.map(d => d.key));

    // Y 스케일 설정
    const y = d3.scaleLinear()
        .range([height - margin.top - margin.bottom, 0])
        .domain([0, d3.max(categoryCount, d => d.value)]);

    // 막대 그리기
    svg.selectAll('.bar')
        .data(categoryCount)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.key))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => height - margin.top - margin.bottom - y(d.value))
        .attr('fill', 'steelblue');

    // X 축 추가
    svg.append('g')
        .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(x));

    // Y 축 추가
    svg.append('g')
        .call(d3.axisLeft(y));
}


async function drawScatterPlot(data, xval, yval, cat) {
    const width = 500;
    const height = 500;
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const x = d3.scaleLinear()
                .domain(d3.extent(data, d => parseFloat(d[xval])))
                .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
                .domain(d3.extent(data, d => parseFloat(d[yval])))
                .range([height - margin.bottom, margin.top]);

    const canvas = d3.select(".canvas-scatter");
    const svg = canvas.append('svg')
                      .attr('height', height)
                      .attr('width', width);

    svg.selectAll("circle")
        .data(data)
        .join('circle')
          .attr('cx', d => x(parseFloat(d[xval])))
          .attr('cy', d => y(parseFloat(d[yval])))
          .attr('r', 5)
          .attr('fill', d => color(d[cat]))
          .on('mouseover', mouseover)
          .on('mouseout', mouseout);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.append('g')
       .attr('transform', `translate(0, ${height - margin.bottom})`)
       .call(xAxis);

    svg.append('g')
       .attr('transform', `translate(${margin.left}, 0)`)
       .call(yAxis);

    const tooltip = d3.select('.canvas').append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0);

    function mouseover(event, d) {
        tooltip
          .style('opacity', 1)
          .html(`${xval}: ${d[xval]}<br/>${yval}: ${d[yval]}<br/>${cat}: ${d[cat]}`)
          .style('left', `${d3.pointer(event)[0] + 30}px`)
          .style('top', `${d3.pointer(event)[1]}px`);
    }

    function mouseout() {
        tooltip
          .style('opacity', 0)
          .style('left', '0px')
          .style('top', '0px');
    }
}

/////////////////
function updateHistogram(data, attribute, start, binSize) {
    d3.select("#histogram").selectAll("*").remove();

    const margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 560 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#histogram")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Calculate max value for the selected attribute
    const maxValue = d3.max(data, d => +d[attribute]);
    console.log('maxvalue', maxValue);

    // X axis: scale and draw
    const x = d3.scaleLinear()
        .domain([start, maxValue])  // Set domain from start to max value
        .range([0, width]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Set the parameters for the histogram
    const histogram = d3.histogram()
        .value(d => +d[attribute])
        .domain(x.domain())  // Use the updated domain
        .thresholds(d3.range(start, maxValue, binSize));  // Use start to maxValue for thresholds

    const bins = histogram(data);
    
    console.log('bins', bins);

    // Y axis: scale and draw
    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(bins, d => d.length)]);

    svg.append("g")
        .call(d3.axisLeft(y));

    // Append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", d => x(d.x0) + 1)
        .attr("transform", d => `translate(0,${y(d.length)})`)
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("height", d => height - y(d.length))
        .style("fill", "#69b3a2");
}


////////////////////////////////////////////////////////////////////




d3.csv("/data/penguins_dropna.csv").then(data => {
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
    drawPieChart(data, 'species');
    drawPieChart(data, 'island');
    drawPieChart(data, 'sex');

    drawBarChart(data, 'species');
    drawBarChart(data, 'island');
    drawBarChart(data, 'sex');

    drawScatterPlot(data, 'bill_length_mm', 'bill_depth_mm', 'species');
    drawScatterPlot(data, 'flipper_length_mm', 'body_mass_g', 'sex');


// Slider elements
const startSlider = document.getElementById('startSlider');
const rangeSlider = document.getElementById('rangeSlider');
const columnSelect = document.getElementById('columnSelect');

// Function to update slider ranges and initial values based on the selected column
function updateSliderRanges(selectedColumn) {
    const values = data.map(d => +d[selectedColumn]);
    const m1 = Math.min(...values);
    const m2 = Math.max(...values);
    const range = m2 - m1;

    // Set start slider range and initial value
    startSlider.min = m1 - range / 10;
    startSlider.max = m1;
    startSlider.value = startSlider.min;

    // Set range slider range and initial value
    rangeSlider.min = range / 100;
    rangeSlider.max = range / 5;
    rangeSlider.value = range / 20;
}

// Function to update the histogram
function updateChart() {
    const selectedColumn = columnSelect.value;
    updateHistogram(data, selectedColumn, +startSlider.value, +rangeSlider.value);
}

// Event listeners for sliders and dropdown
startSlider.addEventListener('input', updateChart);
rangeSlider.addEventListener('input', updateChart);
columnSelect.addEventListener('change', () => {
    updateSliderRanges(columnSelect.value);
    updateChart();
});

// Initial setup
updateSliderRanges(columnSelect.value);
updateChart();



});

