// graph()
function graph() {
    function get_data() {
        let data = d3.csvParse(FileAttachment("traffic_weekly.csv").text(), ({name, date, total_1, total_2}) => ({
            name,
            date: new Date(date * 1000),
            value: +total_1 + +total_2
        }));
        return d3.nest()
            .key(d => d.name)
            .sortValues((a, b) => a.date - b.date)
            .entries(data)
            .map(d => (d.sum = d3.sum(d.values, d => d.value), d))
            .sort((a, b) => b.sum - a.sum);
    }

    let data = get_data()
    let area = d3.area()
        .curve(d3.curveBasis)
        .defined(d => !isNaN(d.value))
        .x(d => x(d.date))
        .y0(0)
        .y1(d => y(d.value))

    let xAxis = g => g
        .attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisTop(x).ticks(width / 80).tickSizeOuter(0))
        .call(g => g.selectAll(".tick").filter(d => x(d) < margin.left || x(d) >= width - margin.right).remove())
        .call(g => g.select(".domain").remove())

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.max(d.values, d => d.value))])
        .range([0, -overlap * step])

    let x = d3.scaleUtc()
        .domain([data[0].values[0].date, data[0].values[data[0].values.length - 1].date])
        .range([0, width])

    let color = i => d3[scheme][Math.max(3, overlap)][i + Math.max(0, 3 - overlap)]
    let margin = ({top: 30, right: 10, bottom: 0, left: 10})
    let height = data.length * (step + 1) + margin.top + margin.bottom

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .style("font", "10px sans-serif");

    const g = svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", (d, i) => `translate(0,${i * (step + 1) + margin.top})`);

    g.append("clipPath")
        .attr("id", d => (d.clip = DOM.uid("clip")).id)
        .append("rect")
        .attr("width", width)
        .attr("height", step);

    g.append("defs").append("path")
        .attr("id", d => (d.path = DOM.uid("path")).id)
        .attr("d", d => area(d.values));

    g.append("g")
        .attr("clip-path", d => d.clip)
        .selectAll("use")
        .data(d => new Array(overlap).fill(d))
        .join("use")
        .attr("fill", (d, i) => color(i))
        .attr("transform", (d, i) => `translate(0,${(i + 1) * step})`)
        .attr("xlink:href", d => d.path.href);

    g.append("text")
        .attr("x", 4)
        .attr("y", step / 2)
        .attr("dy", "0.35em")
        .text(d => d.key);

    svg.append("g")
        .call(xAxis);

    return svg.node();

}