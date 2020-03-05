// 'use strict'

function ridgeline_chart() {
    let data = final_arr
    console.log('data before ridge chart', data)
    // set the dimensions and margins of the graph
    let margin = ({top: 20, right: 20, bottom: 20, left: 50});
    let width = window.innerWidth - margin.left - margin.right;
    height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svg = d3.select("#matrix-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

//read data
//          d3.csv("https://raw.githubusercontent.com/zonination/perceptions/master/probly.csv", function (data) {

    // Get the different categories and count them
    var categories = Array.from(data, d => d.name)
    var n = categories.length

    // Compute the mean of each group
    allMeans = []
    // for (i in categories) {
    let a = 0
    // let currentGroup = categories[i]
    for (let d of data) {
        // console.log('d', d)
        d.vals.forEach(v => {
            // console.log('v y', v.y)
            a += v.y
        })
        let mean = a / d.vals.length
        // console.log('mean', mean)
        allMeans.push(mean)

    }


    // Create a color scale using these means.
    var color = d3.scaleSequential()
        .domain([0, 100])
        .interpolator(d3.interpolateViridis);

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);
    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickValues([0, 0.25, 0.50, 0.75, 1]).tickSize(-height))
        .select(".domain").remove()

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 40)
    // .text("");

    // Create a Y scale for densities
    var y = d3.scaleLinear()
        .domain([0, 0.25])
        .range([height, 0]);

    // Create the Y axis for names
    var yName = d3.scaleBand()
        .domain(categories)
        .range([0, height])
        .paddingInner(1)
    svg.append("g")
        .call(d3.axisLeft(yName).tickSize(0))
        .select(".domain").remove()

    // Compute kernel density estimation for each column:
    var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(10)) // increase this 40 for more accurate density.

    // console.log('kde',kde)
    var allDensity = []
    for (i = 0; i < n; i++) {
        key = categories[i]
        density = kde(data.map(function (d) {
            // console.log('d key', Array.from(d.vals, e => e.y))
            return Array.from(d.vals, e => e.y);
        }))
        // console.log('key density', key, density)
        allDensity.push({key: key, density: density})
    }

    // Add areas
    svg.selectAll("areas")
        .data(allDensity)
        .enter()
        .append("path")
        .attr("transform", function (d) {
            // console.log('here bro d d.key', d, d.key)
            return ("translate(0," + (yName(d.key) - height) + ")")
        })
        .attr("fill", function (d) {
            grp = d.key;
            index = categories.indexOf(grp)
            value = allMeans[index]
            return color(value)
        })
        .datum(function (d) {
            return (d.density)
        })
        .attr("opacity", 0.7)
        .attr("stroke", "#000")
        .attr("stroke-width", 0.1)
        .attr("d", d3.line()
            .curve(d3.curveBasis)
            .x(function (d) {
                // console.log(d, d[0])
                return x(d[0]);
            })
            .y(function (d) {
                return y(d[1]);
            })
        )


// This is what I need to compute kernel density estimation
    //PROBLEM IS HERE
    function kernelDensityEstimator(kernel, X) {
        console.log('kernel x', kernel, X)
        return function (V) {
            console.log('this ones uppercase', V)
            return X.map(function (x) {
                return [x, d3.mean(V, function (v) {
                    // console.log('whats this myseterious v', v)
                    return kernel(x - v);
                })];
            });
        };
    }

    function kernelEpanechnikov(k) {
        return function (v) {
            return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
        };
    }

    console.log('data at the end of ridgeline', data)


}