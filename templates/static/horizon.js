'use strict'

function graph() {
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

        let counter = 0;
        let step = 50;
        let overlap = 3;
        let color = i => d3['schemeBlues'][Math.max(3, overlap)][i + Math.max(0, 3 - overlap)]
        let margin = ({top: 30, right: 10, bottom: 0, left: 10});
        let width = window.innerWidth - margin.left - margin.right;
        let height = data.length * (step + 1) + margin.top + margin.bottom;

        console.log(data[0].values);

        let area = d3.area()
            .curve(d3.curveBasis)
            .defined(d => !isNaN(d.y))
            .x(d => x(d.x))
            .y0(0)
            .y1(d => y(d.y));


        let xAxis = g => g
            .attr("transform", `translate(0,${margin.top})`)
            .call(d3.axisTop(x).ticks(width / 80).tickSizeOuter(0))
            .call(g => g.selectAll(".tick").filter(d => x(d) < margin.left || x(d) >= width - margin.right).remove())
            .call(g => g.select(".domain").remove())

        let y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d3.max(d.values, d => d.y))])
            .range([0, -overlap * step])

        let x = d3.scaleLinear()
            .domain([data[0].values[0].x, data[0].values[data[0].values.length - 1].x])
            .range([0, width])


        const svg = d3.selectAll('#chart')
            .attr("viewBox", [0, 0, width, height])
            .style("font", "10px sans-serif");

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
            .attr("height", step)


        counter = 0;
        g.append("defs")
            .append("path")
            .attr("id", d => {
                d.path = "apath" + gen_class(d.key);
                return d.path
            })
            .attr("d", d => area(d.values))

        g.append("g")
            .attr("clip-path", d => "url(#" + d.clip + ")")
            .selectAll("use")
            .data(d => new Array(overlap).fill(d))
            .join("use")
            .attr("fill", (d, i) => color(i))
            .attr("transform", (d, i) => `translate(0,${(i + 1) * step})`)
            .attr("xlink:href", d => "#" + d.path)
        // .on("mouseover", (event, d) => {
        //         console.log('mouseover',d, event)
        //     })


        g.append("text")
            .attr("x", 4)
            .attr("y", step / 2)
            .attr("dy", "0.35em")
            .text(d => d.key);

        svg.append("g")
            .call(xAxis)

        // document.getElementById('chart').addEventListener("mouseover", function(event){
        //     // console.log('height', document.getElementById("chart").clientHeight)
        //     let svg_height = document.getElementById("chart").clientHeight
        //     let vertical_split = svg_height/final_arr.length;
        //     console.log('vertical split', vertical_split);
        //     // console.log('mouseover', event)
        // })
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


        console.log('data at the end of horizon chart', data)
        return svg.node();


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