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
        let tabletooltip = null;

        header.addEventListener('mouseover', function() {
            const columnName = this.innerText.toLowerCase().replace(/ /g, "_");
            const tooltipText = columnInfo[columnName];

            // 툴팁 생성 및 스타일 설정
            tabletooltip = document.createElement('div');
            tabletooltip.style.position = 'absolute';
            tabletooltip.style.background = 'orange';
            tabletooltip.style.padding = '5px';
            tabletooltip.style.zIndex = '1000';
            tabletooltip.innerText = tooltipText;

            // 툴팁 위치 설정
            tabletooltip.style.left = header.getBoundingClientRect().left + 'px';
            tabletooltip.style.top = (header.getBoundingClientRect().bottom + window.scrollY) -80 + 'px';
            document.body.appendChild(tabletooltip);
        });

        header.addEventListener('mouseout', function() {
            if (tabletooltip) {
                document.body.removeChild(tabletooltip);
                tabletooltip = null;
            }
        });
    });
}


// // 열 통계 정보 계산 함수
// function getColumnStatistics(columnData) {
//     // 수치형 데이터 검사
//     const isNumeric = columnData.every(item => !isNaN(item) && item !== '');
//     let content;

//     if (isNumeric) {
//         const numbers = columnData.map(Number).filter(n => !isNaN(n));
//         const min = Math.min(...numbers);
//         const max = Math.max(...numbers);
//         const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
//         content = `최소: ${min}, 최대: ${max}, 평균: ${avg.toFixed(2)}`;
//     } else {
//         // 고유값 추출
//         const uniqueValues = [...new Set(columnData)].join(', ');
//         content = `고유값: ${uniqueValues}`;
//     }
//     return content;
// }


const myColors = ['#f49f30', '#e0353d', '#b20089','#6600a7'];


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

    // 팔레트
    const colorScale = d3.scaleOrdinal(myColors);

    // 파이 차트 조각 그리기
    const path = svg.selectAll('path')
        .data(pie(Array.from(categoryCount)))
        .enter().append('path')
        .attr('d', arc)
        .attr('fill', d => colorScale(d.data[0]))
        .attr('stroke', 'white')
        .style('stroke-width', '2px');

    // 각 조각에 범주 이름 추가
    svg.selectAll('text.label')
        .data(pie(Array.from(categoryCount)))
        .enter().append('text')
        .attr('class', 'label')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('dy', '0.35em')
        .style('text-anchor', 'middle')
        .text(d => d.data[0]);

    // 툴팁을 위한 SVG 그룹 추가
    const tooltipGroup = svg.append('g')
        .attr('class', 'tooltip-group')
        .style('display', 'none');

    tooltipGroup.append('text')
        .attr('class', 'tooltip-text')
        .style('text-anchor', 'middle')
        .attr('dy', '-1.5em');

    // 마우스 오버 및 아웃 이벤트
    path.on('mouseover', function(event, d) {
        // 나머지 조각들 회색 처리
        svg.selectAll('path').style('opacity', 0.3);
        d3.select(this).style('opacity', 1);

        // 툴팁 위치 및 텍스트 업데이트
        const percent = (d.data[1] / d3.sum(Array.from(categoryCount), d => d[1]) * 100).toFixed(1);
        tooltipGroup.style('display', null)
            .attr('transform', `translate(${arc.centroid(d)})`);
        tooltipGroup.select('.tooltip-text')
            .text(`${d.data[1]} (${percent}%)`);
        }).on('mouseout', function(d) {
        // 원래 색상 복원 및 툴팁 숨김
        svg.selectAll('path').style('opacity', 1);
        tooltipGroup.style('display', 'none');
    
        // 여기에 범주 이름만 다시 표시하는 코드 추가
        svg.selectAll('text.label').text(d => d.data[0]);
    })
};

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

    // 툴팁을 위한 div 요소 생성
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    
    // 막대 그리기
    svg.selectAll('.bar')
        .data(categoryCount)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.key))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => height - margin.top - margin.bottom - y(d.value))
        .attr('fill', myColors[0]);

    // 빈도수 텍스트를 위한 그룹
    const freqTextGroup = svg.append('g')
        .attr('class', 'freq-text-group');

    // 마우스 오버 이벤트
    svg.selectAll('.bar')
        .on('mouseover', function(event, d) {
            // 나머지 막대 연한 회색 처리
            svg.selectAll('.bar').style('fill', 'lightgray');
            d3.select(this).style('fill', myColors[0]);

            // 빈도수 텍스트 추가
            freqTextGroup.append('text')
                .attr('class', 'freq-text')
                .attr('x', x(d.key) + x.bandwidth() / 2)
                .attr('y', y(d.value) - 5)
                .style('text-anchor', 'middle')
                .text(d.value);
        })
        .on('mouseout', function(d) {
            // 모든 막대 원래 색상 복원
            svg.selectAll('.bar').style('fill', myColors[0]);

            // 빈도수 텍스트 제거
            freqTextGroup.select('.freq-text').remove();
        });

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
    const margin = { top: 30, right: 30, bottom: 70, left: 60 }; // Adjusted for label space

    // Palette
    const color = d3.scaleOrdinal(myColors);

    // Scales
    const x = d3.scaleLinear()
                .domain(d3.extent(data, d => parseFloat(d[xval])))
                .range([margin.left, width - margin.right]);
    const y = d3.scaleLinear()
                .domain(d3.extent(data, d => parseFloat(d[yval])))
                .range([height - margin.bottom, margin.top]);

    // Canvas setup
    const canvas = d3.select(".canvas-scatter");
    const svg = canvas.append('svg')
                      .attr('height', height)
                      .attr('width', width);

    // Circles
    svg.selectAll("circle")
        .data(data)
        .join('circle')
          .attr('cx', d => x(parseFloat(d[xval])))
          .attr('cy', d => y(parseFloat(d[yval])))
          .attr('r', 5)
          .attr('fill', d => color(d[cat]))
          .on('mouseover', mouseover)
          .on('mouseout', mouseout);

    // X Axis
    const xAxis = d3.axisBottom(x);
    svg.append('g')
       .attr('transform', `translate(0, ${height - margin.bottom})`)
       .call(xAxis)
       .append('text') // X Axis Label
       .attr('class', 'axis-label')
       .attr('x', width - margin.right)
       .attr('y', margin.bottom / 2)
       .style('fill', 'black')
       .style('text-anchor', 'end')
       .text(xval);

    // Y Axis
    const yAxis = d3.axisLeft(y);
    svg.append('g')
       .attr('transform', `translate(${margin.left}, 0)`)
       .call(yAxis)
       .append('text') // Y Axis Label
       .attr('class', 'axis-label')
       .attr('transform', 'rotate(-90)')
       .attr('y', -margin.left + 20)
       .attr('x', -height / 2 + margin.top)
       .style('fill', 'black')
       .style('text-anchor', 'end')
       .text(yval);

    // Tooltip
    const tooltip = d3.select('body').append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0);

    // Mouseover Event
    function mouseover(event, d) {
        tooltip
          .html(`${xval}: ${d[xval]}<br/>${yval}: ${d[yval]}<br/>${cat}: ${d[cat]}`)
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY}px`)
          .style('opacity', 1); // Show tooltip without transition
    }
    
    // Mouseout Event
    function mouseout() {
        tooltip
          .style('opacity', 0); // Hide tooltip without transition
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
        .style("fill", myColors[2]);
}


////////////////////////////////////////////////////////////////////




d3.csv("./data/penguins_dropna.csv").then(data => {
    data.forEach(d => {
        d.bill_depth_mm = +d.bill_depth_mm;
        d.bill_length_mm = +d.bill_length_mm;
        d.body_mass_g = +d.body_mass_g;
        d.flipper_length_mm = +d.flipper_length_mm;
        d.species = d.species;
        d.island = d.island;
        d.sex = d.sex;
    });



    console.log('hi', getColumnStatistics(data));
    addColumnTooltips(data);

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

// histogram update

document.addEventListener('DOMContentLoaded', (event) => {
    const startSlider = document.getElementById('startSlider');
    const rangeSlider = document.getElementById('rangeSlider');
    const startValue = document.getElementById('startValue');
    const rangeValue = document.getElementById('rangeValue');

    startSlider.addEventListener('input', function() {
        startValue.textContent = this.value;
    });

    rangeSlider.addEventListener('input', function() {
        rangeValue.textContent = this.value;
    });
});

// D3.js를 사용하여 CSV 파일 로드 및 표 생성
var allData;
var visibleRows = 5; // 초기에 표시할 행 수

// 전체 데이터를 토글하는 함수
function toggleTable() {
    var table = d3.select("#data-table");
    
    // 현재 표시된 데이터 개수 업데이트
    visibleRows = (visibleRows === allData.length) ? 5 : allData.length;

    // 새로운 데이터 선택
    var newData = allData.slice(0, visibleRows);

    // 표 업데이트
    var rows = table.select("tbody").selectAll("tr")
        .data(newData, d => d);
    
    rows.exit().remove(); // 이전에 표시된 행 제거

    rows.enter().append("tr")
        .selectAll("td")
        .data(d => Object.values(d))
        .enter().append("td")
        .text(d => d); // 새로운 행 추가

    rows.selectAll("td")
        .data(d => Object.values(d))
        .text(d => d); // 기존 행 업데이트
}

// D3.js를 사용하여 CSV 파일 로드 및 표 생성
d3.csv("./data/penguins_dropna.csv").then(function(data){
    allData = data; // 모든 데이터 저장

    // 초기에 표시할 데이터 선택
    var initialData = data.slice(0, visibleRows);

    // 표 생성을 위한 테이블 요소 선택
    var table = d3.select("#data-table");

    // 헤더 행 추가
    table.append("thead")
        .append("tr")
        .selectAll("th")
        .data(Object.keys(initialData[0]))
        .enter().append("th")
        .text(d => d);

    // 데이터 행 추가
    var tbody = table.append("tbody");
    var rows = tbody.selectAll("tr")
        .data(initialData)
        .enter().append("tr")
        .selectAll("td")
        .data(d => Object.values(d))
        .enter().append("td")
        .text(d => d);
});