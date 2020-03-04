'use strict'

function horizon_graph(overlap = 3) {
    new Promise((resolve => {
        // console.log('final arr here')
        let prelim_data = [];
        console.log('final arr', final_arr);
        final_arr.forEach(d => {
            // console.log('hi', d);
            let adict = {};
            // console.log('hey', d.vals)
            for (let v of d.vals) {
                prelim_data.push({
                    'name': d.name,
                    'x': v.x,
                    'y': v.y
                })
            }
        });
        let data = d3.nest()
            .key(d => d.name)
            .sortValues((a, b) => a.x - b.x)
            .entries(prelim_data)
            .map(d => (d.sum = d3.sum(d.values, d => d.y), d))
            .sort((a, b) => b.sum - a.sum);
        console.log('this data right here', data);
        resolve(data)
    })).then((data) => {

        let step = 50;
        let color = i => d3['schemeBlues'][Math.max(3, overlap)][i + Math.max(0, 3 - overlap)]
        let margin = ({top: 30, right: 10, bottom: 0, left: 10});
        let width = window.innerWidth - margin.left - margin.right;
        let height = data.length * (step + 1) + margin.top + margin.bottom;

        console.log(data[0].values);

        const svg = d3.selectAll('#chart')
            .attr("viewBox", [0, 0, width, height])
            .style("font", "10px sans-serif");

        let area = d3.area()
            .curve(d3.curveBasis)
            .defined(d => !isNaN(d.y))
            .x(d => x(d.x))
            .y0(0)
            .y1(d => y(d.y));

        let y0 = [0, d3.max(data, d => d3.max(d.values, d => d.y))];
        let y = d3.scaleLinear()
            .domain(y0)
            .range([0, -overlap * step])


        let x0 = [data[0].values[0].x, data[0].values[data[0].values.length - 1].x]
        let x = d3.scaleLinear()
            .domain(x0)
            .range([0, width])


        let xAxis = svg.append("g")
            .attr("transform", `translate(0,${margin.top})`)
            .call(d3.axisTop(x).ticks(width / 80).tickSizeOuter(0))
            .call(g => g.selectAll(".tick").filter(d => x(d) < margin.left || x(d) >= width - margin.right).remove())
            .call(g => g.select(".domain").remove())


        const g = svg.append("g")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("transform", (d, i) => `translate(0,${i * (step + 1) + margin.top})`);


        g.append("clipPath")
            .attr("id", d => {
                d.clip = "aclip" + gen_class(d.key);
                return d.clip
            })
            .append("rect")
            .attr("width", width)
            .attr("height", step);


        g.append("defs")
            .append("path")
            .attr("id", d => {
                d.path = "apath" + gen_class(d.key);
                return d.path
            })
            .attr("d", d => area(d.values));

        g.append("g")
            .attr("clip-path", d => "url(#" + d.clip + ")")
            .selectAll("use")
            .data(d => new Array(overlap).fill(d))
            .join("use")
            .attr("fill", (d, i) => color(i))
            .attr("transform", (d, i) => `translate(0,${(i + 1) * step})`)
            .attr("xlink:href", d => "#" + d.path);

        g.append("text")
            .attr("x", 4)
            .attr("y", step / 2)
            .attr("dy", "0.35em")
            .text(d => d.key);

        // svg.append("g")
        // .call(xAxis);

        data_on_mouseover() //shows values of arrays as the mouse moves


        console.log('data at the end of horizon chart', data)
        return svg.node();


//mouse interactions
        function data_on_mouseover() {
            //preparing svg elements needed for text on mouseover
            let texts = d3.selectAll('svg')
                .append('g')
                .attr('x', x - 30)
                .attr('y', 0)
                .attr('height', height - margin.top);

            for (let i = 0; i < data.length; i++) {
                console.log(data[i])
                texts.append("text")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("id", "text_" + String(i))
                    .attr("dy", ".35em")
            }

            let guideline = d3.selectAll('svg')
                .append('line')
                .style("stroke", "black")
                .style("stroke-opacity", 1)


            //mouse interaction
            let svg_obj = document.getElementById("chart")
            svg_obj.onmousemove = function (e) {
                var cur_target = e.currentTarget

                var x = e.offsetX
                var y = e.offsetY - margin.top

                let height_offset = (cur_target.getBoundingClientRect().height - margin.top) / data.length;
                //also equal to step+1
                let strip_no = Math.floor(y / height_offset)

                // console.log((cur_target.getBoundingClientRect().height - margin.top) / final_arr.length);
                // console.log('x', x);
                // console.log('y', y);
                // console.log('strip', strip_no)

                for (let i = 0; i < data.length; i++) {
                    d3.selectAll("#text_" + String(i))
                        .transition()
                        .duration(10)
                        .attr("x", x - 50)
                        .attr("y", height_offset * (i + 1))
                        .text(data[i]['values'][x]['y'].toFixed(3))
                    guideline
                        .attr("x1", x)
                        .attr("x2", x)
                        .attr('y1', margin.top)
                        .attr('y2', height)

                }
            }
        }
    })
}


function gen_class(d) {
    d = d.split(" ").join("");
    d = d.split("t/F").join("");
    d = d.split("n/F").join("");
    d = d.split("s/F").join("");
    d = d.split("&").join("");
    if (d === "") {
        d = "sample"
    }

    return d
}


  // //zooming
        //
        // let idleTimeout, idleDelay = 350;
        // let zoom = () => {
        //
        //
        //     var selection = d3.event.selection;
        //     console.log(selection);
        //     if (!selection) {
        //         if (!idleTimeout) return idleTimeout = setTimeout(() => {
        //             idleTimeout = null
        //         }, idleDelay);
        //         x.domain(x0);
        //         y.domain(y0);
        //     } else {
        //         x.domain([selection[0][0], selection[1][0]].map(x.invert, x));
        //         y.domain([selection[1][1], selection[0][1]].map(y.invert, y));
        //         brushG.call(brush.move, null);
        //     }
        //
        //     d3.selectAll("path")
        //         .transition().duration(500)
        //         .attr("d", d => area(d.values))
        //
        //     // d3.selectAll("use")
        //     //     .data(d => new Array(overlap).fill(d))
        //     //     .attr("fill", (d, i) => color(i))
        //     //     .attr("transform", (d, i) => `translate(0,${(i + 1) * step})`)
        //
        //     xAxis
        //     // .transition()
        //     // .duration(500)
        //         .call(d3.axisTop(x).ticks(width / 80).tickSizeOuter(0))
        //         .call(g => g.selectAll(".tick").filter(d => x(d) < margin.left || x(d) >= width - margin.right).remove())
        //         .call(g => g.select(".domain").remove())
        //
        //     // yAxis.transition().duration(500).call(d3.axisLeft(y));
        // };
        //
        // let brush = d3.brush()
        //     .extent([[0, 0], [width, height]])
        //     .on("end", zoom);
        //
        // let brushG = svg.append("g")
        //     .attr("class", "brush")
        //     .call(brush)
