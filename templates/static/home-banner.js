function load_background(num) {
    let colors = ["#b55774", "#ffb862", "#179ea8", "#339c38"];
    var lineGenerator = d3.line()
        .curve(d3.curveCardinal);

    let svg_height = document.getElementById("background-viz").clientHeight
    console.log(svg_height)
    svg_height = svg_height/num;

    let svg = d3.selectAll("#background-viz")


    for (let i = 0; i < num; i++) {
        let arr_x = Array.from(Array(Math.round(window.innerWidth / 70) + 3), (x, index) => index * 70)
        // let height = Math.round(parseInt(document.getElementById("background-viz").getBBox().height))
        let height = Math.round(svg_height * (i + 1))
        let arr_y = Array(arr_x.length).fill(1).map(d => d3.randomUniform(height * 0.6, height * 0.9)());
        let points = arr_x.map(function (e, i) {
            return [e, arr_y[i]];
        });
        // console.log(points)

        let line = svg.append("path")
            .attr("class", "line")
            .attr("id", function (d, i) {
                return "line" + i;
            })
            .attr("stroke-linecap", "round")
            .attr("d", lineGenerator(points))
            .attr('fill', 'none')
            .attr("stroke", colors[i])
            .attr("opacity", 0.3)
            .attr("stroke-width", 4)

        var totalLength = line.node().getTotalLength()
        line
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .delay(200 * (i + 1))
            .duration(4000)
            .attr("stroke-dashoffset", 0);
    }
}