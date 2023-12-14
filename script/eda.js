import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const data = d3.csvParse(e.target.result); // 파일 내용을 D3 형식으로 파싱
    visualizeData(data); // 시각화 함수 호출
  };

  reader.readAsText(file); // 파일 내용 읽기
});

function visualizeData(data) {
  const width = 500;
  const height = 500;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  const x = d3.scaleLinear()
              .domain(d3.extent(data, d => +d.x)) // 'x'는 x축 데이터 필드명
              .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
              .domain(d3.extent(data, d => +d.y)) // 'y'는 y축 데이터 필드명
              .range([height - margin.bottom, margin.top]);

  const svg = d3.select(".canvas").append("svg")
                .attr("width", width)
                .attr("height", height);

  svg.append("g")
     .attr("transform", `translate(0,${height - margin.bottom})`)
     .call(d3.axisBottom(x));

  svg.append("g")
     .attr("transform", `translate(${margin.left},0)`)
     .call(d3.axisLeft(y));

  svg.append("g")
     .selectAll("circle")
     .data(data)
     .join("circle")
       .attr("cx", d => x(+d.x))
       .attr("cy", d => y(+d.y))
       .attr("r", 5);
}
