'use strict';

let final_arr = []


//gets called when new upload happens
async function new_upload_temp(obj) {

    console.log('started new upload');

    // console.log(obj.id)
    console.log(obj.files);
    let files = obj.files; // FileList object
    let name_list = [];
    let data_dict_arr = [];

    for (let i = 0, f; f = files[i]; i++) {
        let reader = new FileReader();
        reader.onerror = error_handler;
        name_list.push(f.name);
        var extension = f.name.split('.').pop().toLowerCase();//file extension from input file
        reader.onload = async e => {
            if (extension === 'csv') {
                data_dict_arr = read_csv(e, f.name)
            }
            else if (extension === 'json') {
                data_dict_arr = read_json(e, f.name)
            }

            //this will get the data as an array of dicts with x and y values nicely organized
            await post_process_data(data_dict_arr, f.name)
        };
        reader.readAsText(f);
        console.log('hii', final_arr)
    }
}


//handles what happens on json file load
function read_json(event, filename) {
    let data_dict_arr = [];
    data_dict_arr.push(JSON.parse(event.target.result));
    return data_dict_arr
}

//handles what happens on csv file load
function read_csv(event, filename) {

    let data_dict_arr = []
    let csv = event.target.result;
    let allTextLines = csv.split(/\r\n|\n/);
    let datapoints = [];
    let events = [];
    for (let el of allTextLines) {
        let split = el.split(',');
        if (!isNaN(split[0])) {
            datapoints.push(parseFloat(split[0]));
        }

        if (split.length > 1) {
            if (!isNaN(split[1])) {
                events.push(parseFloat(split[1]))
            }
        }
    }
    // console.log('datapoints', datapoints)
    // console.log('events', events)
    let data_dict = {
        'name': filename,
        'start_time': 0,
        'datapoints': datapoints,
        'events': events
    };

    // make_d3_graph(data_dict)
    data_dict_arr.push(data_dict);
    return data_dict_arr
}

//  handles errors
function error_handler(evt) {
    console.log('error');
    if (evt.target.error.name === "NotReadableError") {
        alert("Cannot read file !");
    }
}


function post_process_data(data_dict_arr, name) {
    console.log('data dict arr', data_dict_arr.length);
    console.log('name', name);

    return new Promise((resolve, reject) => {
        let y_vals = [];
        for (let el of Object.keys(data_dict_arr)) {
            console.log('el', data_dict_arr[el]);
            let transpose = [];
            for (let point of Object.keys(data_dict_arr[el].datapoints)) {
                if (!isNaN(data_dict_arr[el].datapoints[point])) {
                    transpose.push(data_dict_arr[el].datapoints[point])
                }
            }
            // console.log(transpose);
            y_vals = transpose
        }
        resolve(y_vals)

    }).then(y_vals => {
        console.log('y vals', y_vals);

        let x_vals = [...Array(y_vals.length).keys()];
        console.log('x_vals', x_vals);

        // Reformat data
        // data = An array of objects, each of which contains an array of objects
        let xy_arr = []
        for (let i = 0; i < y_vals.length; i++) {
            xy_arr.push({
                'x': x_vals[i],
                'y': y_vals[i]
            })
        }

        let data = {
            name: name,
            vals: xy_arr
        };
        console.log("data", data);
        final_arr.push(data)
        return data
    })
}


function get_data() {
    console.log('heres all the data', final_arr)
    let o = document.getElementById("overlap-range").value
    let s = document.getElementById("step-range").value
    console.log("o s", o, s)
    horizon_graph(parseInt(o), parseInt(s))
}


function load_local(num) {
    if (num === 1) {
        //load petras data
        let path = "templates/static/data/set_1";
        read_files(path)

    }
    else if (num === 2) {
        //load philippes data
        let path = "templates/static/data/set_2";
        read_philippe_files(path)
    }
}


function read_files(dirname) {
    for (let i = 0; i < 16; i++) {
        let cur_dirname = dirname + "/chan_" + String(i) + ".csv"
        d3.csv(cur_dirname).then(data => {
            let data_arr = Array.from(data, d => parseFloat(Object.values(d)[0]))
            let x_arr = [...Array(data_arr.length).keys()];
            let points = x_arr.map(function (e, i) {
                return {'x': e, 'y': data_arr[i]};
            });
            let dict = {
                'name': "chan_" + String(i) + ".csv",
                'vals': points
            }
            final_arr.push(dict)
            console.log(dict)
        })
    }
    setTimeout(function () {
        horizon_graph()
        linechart()
        add_ranges()

    }, 2500)
}

function read_philippe_files(dirname) {
    let fs = require('fs');
    let files = fs.readdirSync('/assets/photos/');
    console.log("FILESSS", files)
    for (let i = 0; i < 16; i++) {
        let cur_dirname = dirname + "/chan_" + String(i) + ".csv"
        d3.csv(cur_dirname).then(data => {
            let data_arr = Array.from(data, d => parseFloat(Object.values(d)[0]))
            let x_arr = [...Array(data_arr.length).keys()];
            let points = x_arr.map(function (e, i) {
                return {'x': e, 'y': data_arr[i]};
            });
            let dict = {
                'name': "chan_" + String(i) + ".csv",
                'vals': points
            }
            final_arr.push(dict)
            console.log(dict)
        })
    }
    setTimeout(function () {
        horizon_graph()
        linechart()
        add_ranges()

    }, 2500)
}


//csv file handling functions