// 'use strict';
//
// // function load_d3_graph(x_vals, names) {
// //     // loader settings
// //     let target = document.getElementById('#chart');
// //
// //     function init() {
// //         // trigger loader
// //         var spinner = new Spinner().spin(target);
// //
// //         // load json data
// //         function make_d3_graph_spinner(x_vals, names) {
// //             make_d3_graph(x_vals, names);
// //             //stop loader
// //             spinner.stop()
// //         }
// //
// //         make_d3_graph_spinner(x_vals, names)
// //
// //     }
// //
// //     init();
// // }
//
// function new_upload(obj) {
//     console.log('started new upload');
//
//     // console.log(obj.id)
//     console.log(obj.files);
//     let files = obj.files; // FileList object
//     let name_list = [];
//     for (let i = 0, f; f = files[i]; i++) {
//         let reader = new FileReader();
//         var extension = f.name.split('.').pop().toLowerCase();//file extension from input file
//         if (extension === 'csv') {
//             reader.onload = e => {
//                 read_csv(e, f.name);
//             };
//             reader.readAsText(f);
//         }
//         else if (extension === 'json') {
//             reader.onload = e => {
//                 read_json(e, f.name);
//             }
//         }
//         reader.onerror = error_handler;
//         name_list.push(f.name);
//     }
//     let nextSibling = obj.nextElementSibling;
//     nextSibling.innerText = name_list;
//     console.log('data dict arr', data_dict_arr)
//
//     setTimeout(function () {
//         console.log('make d3 graph called')
//         // let y_vals = Array(x_vals[0].datapoints.length);
//         console.log('x', data_dict_arr);
//         console.log('names', name_list);
//
//         let y_vals = {};
//
//         for (let el of Object.keys(data_dict_arr)) {
//             console.log('el', data_dict_arr[el]);
//             let transpose = [];
//             for (let point of Object.keys(data_dict_arr[el].datapoints)) {
//                 if (!isNaN(data_dict_arr[el].datapoints[point])) {
//                     transpose.push(data_dict_arr[el].datapoints[point])
//                 }
//             }
//             // console.log(transpose);
//             y_vals[data_dict_arr[el].name] = transpose
//         }
//         console.log('y vals', y_vals);
//
//         let x_vals = [...Array(Object.values(y_vals)[0].length).keys()];
//         console.log('x_vals', x_vals);
//
//         // Reformat data
//         // data = An array of objects, each of which contains an array of objects
//         var data = name_list.map(function (name) {
//             let xy_arr = [];
//             for (let i = 0; i < x_vals.length; i++) {
//                 xy_arr.push({
//                     'x': x_vals[i],
//                     'y': y_vals[name][i]
//                 })
//             }
//             return {
//                 name: name,
//                 vals: xy_arr
//             };
//         });
//         console.log("data", data);
//
//
//         // Define margins
//         let margin = {top: 20, right: 80, bottom: 30, left: 50},
//             width = window.innerWidth - margin.left - margin.right,
//             height = 0.8 * window.innerHeight - margin.top - margin.bottom;
//
//         let all_in_one = Object.keys(y_vals).map(key => y_vals[key])[0];
//
//
//         // Place the axes on the chart
//         // Define svg canvas
//         let svg = d3
//             .select("#chart")
//             .attr("width", width + margin.left + margin.right)
//             .attr("height", height + margin.top + margin.bottom)
//             .append("g")
//             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//         var x = d3.scaleLinear()
//             .domain(d3.extent(x_vals))
//             .range([0, width]);
//
//         let y = d3.scaleLinear()
//             .domain(d3.extent(all_in_one))
//             .range([height - margin.top - margin.bottom, 0]);
//
//
//         console.log("data", data);
//         // console.log(min, max);
//
//         // console.log(y.domain(), y(-20), y(0), y(20));
//
//         let line = d3.line()
//             .x((d, i) => {
//                 console.log('d i x', d, i, x);
//                 return x.vals(i)
//             })
//             .y((d) => {
//                 return y.vals(d)
//             });
//
//         svg.append("g")
//             .attr("id", "xAxis")
//             .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
//             .call(d3.axisBottom(x));
//
//         svg.append("g")
//             .attr("id", "yAxis")
//             .call(d3.axisLeft(y));
//
//         svg.append("path")
//             .data(data)
//             .attr("d", function(d, i){
//                 console.log('woo000ii00jio', d.vals[i])
//                 return d3.line()
//                     .x((d,i) => x(i))
//                     .y((d,i) => y(i))
//             })
//             .style("stroke", d => {
//                 console.log("yeee", d, line, line(d));
//                 return "steelblue"
//             })
//             .style("stroke-width", 2)
//             .style("fill", "none")
//             .style("opacity", 1);
//
//         // // Define scales
//         // let xScale = d3.scaleLinear().range([0, width]);
//         // let yScale = d3.scaleLinear().range([height, 0]);
//         // // console.log('xscale', xScale)
//         // // console.log('yscale', yScale)
//         //
//         // let color = d3.scaleOrdinal().range(d3.schemeCategory10);
//         //
//         // // Define axes
//         // let xAxis = d3.axisBottom().scale(xScale);
//         // let yAxis = d3.axisLeft().scale(yScale);
//         //
//         // let all_in_one = Object.keys(y_vals).map(key => y_vals[key])[0];
//         //
//         // // console.log('all in one', all_in_one);
//         // // Set the color domain equal to the three product categories
//         // color.domain(d3.keys(name_list));
//         // // Set the domain of the axes
//         // xScale.domain(d3.extent(x_vals));
//         // yScale.domain(d3.extent(all_in_one));
//         //
//         //
//         // svg
//         //     .append("g")
//         //     .attr("class", "x axis")
//         //     .attr("transform", "translate(0," + height + ")")
//         //     .call(xAxis);
//         //
//         // svg
//         //     .append("g")
//         //     .attr("class", "y axis")
//         //     .call(yAxis)
//         //     .append("text")
//         //     .attr("class", "label")
//         //     .attr("y", 6)
//         //     .attr("dy", ".71em")
//         //     .attr("dx", ".71em")
//         //     .style("text-anchor", "beginning")
//         //     .text("Signal Values");
//         //
//         // // Define lines
//         // var line = d3
//         //     .line()
//         //     .curve(d3.curveMonotoneX)
//         //     .x(function (d) {
//         //         return xScale(d.x);
//         //     })
//         //     .y(function (d) {
//         //         return yScale(d.y);
//         //     });
//         //
//         // var lines = svg
//         //     .selectAll(".category")
//         //     .data(data)
//         //     .enter()
//         //     .append("g")
//         //     .attr("class", "category")
//         //     .style("stroke", function (d) {
//         //         return color(d.name);
//         //     });
//         //
//         //
//         // lines
//         //     .append("path")
//         //     .attr("class", "line")
//         //     // .data(data)
//         //     .attr("d", function (d) {
//         //         return line(d.vals);
//         //     })
//
//
//         // console.log("d3", d3.values(data)); // to view the structure
//
//         // Define responsive behavior
//         function resize() {
//             let width = parseInt(d3.select("#chart").style("width")) - margin.left - margin.right,
//                 height = parseInt(d3.select("#chart").style("height")) - margin.top - margin.bottom;
//
//             // Update the range of the scale with new width/height
//             x.range([0, width]);
//             y.range([height, 0]);
//
//
//             // Update the axis and text with the new scale
//             svg
//                 .select(".x.axis")
//                 .attr("transform", "translate(0," + height + ")")
//                 .call(d3.axisBottom(x));
//
//             svg.select(".y.axis").call(d3.axisLeft(x));
//
//             // Force D3 to recalculate and update the line
//             svg.selectAll(".line").attr("d", function (d) {
//                 return d3.line()
//                     .x(function (e, i) {
//                         return d.vals.x[i]
//                     })
//                     .y(function (e, i) {
//                         return d.vals.y[i]
//                     })
//                     .curve(d3.curveMonotoneX)
//                     (Array(d.vals.x.length))
//             });
//
//             // Update the tick marks
//             xAxis.ticks(Math.max(width / 75, 2));
//             yAxis.ticks(Math.max(height / 50, 2));
//
//         }
//
//         // Call the resize function whenever a resize event occurs
//         // d3.select(window).on("resize", resize);
//         // // Call the resize function
//         // resize();
//
//     }, 1500);
//
//
// }
//
