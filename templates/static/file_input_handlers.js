'use strict';

let final_arr = []

//

//---------------------------USER UPLOADS HERE---------------------------------
//gets called when new upload happens
async function new_upload(obj) {

    console.log('started new upload');

    // console.log(obj.id)
    console.log(obj.files);
    let files = obj.files; // FileList object
    let name_list = [];
    let data_dict_arr = [];

    for (let i = 0, f; f = files[i]; i++) {
        let reader = new FileReader();
        reader.onerror = error_handler;
        name_list.push(f.name.split(".")[0]);
        var extension = f.name.split('.').pop().toLowerCase();//file extension from input file
        reader.onload = async e => {
            if (extension === 'csv') {
                data_dict_arr = read_csv(e, f.name)
            }
            else if (extension === 'json') {
                data_dict_arr = read_json(e, f.name)
            }
            //this will get the data as an array of dicts with x and y values nicely organized
            // await post_process_data(data_dict_arr, f.name)
        };
        reader.readAsText(f);
        console.log('hii', final_arr)
    }
    setTimeout(function () {
        load_all_graphs()
    }, 800)
}


//handles what happens on json file load
function read_json(event, filename) {
    let data_dict_arr = [];
    data_dict_arr.push(JSON.parse(event.target.result));
    return data_dict_arr
}

//handles what happens on csv file load
function read_csv(event, filename) {

    let csv = event.target.result;
    let allTextLines = csv.split(/\r\n|\n/);
    let vals = []
    //iterate through all lines to get the data and add to an array
    for (let el of allTextLines) {
        let split = el.split(',');
        let x = parseFloat(split[1]);
        let y = parseFloat(split[2]);
        let event = parseInt(split[3])
        if (!isNaN(x) && !isNaN(y)) {
            vals.push({
                'x': x,
                'y': y,
                'event': event
            })
        }
    }
    //get id
    let name = allTextLines[1].split(',')[0];
    //remove first element because it's the headers of the csv
    vals.shift()

    // console.log('datapoints', datapoints)
    // console.log('events', events)

    //put all the info onto a dicitonary and return
    let data_dict = {
        'name': name,
        'vals': vals,
    };

    final_arr.push(data_dict)

    // make_d3_graph(data_dict)
    return data_dict
}

//  handles errors
function error_handler(evt) {
    console.log('error');
    if (evt.target.error.name === "NotReadableError") {
        alert("Cannot read file !");
    }
}

// //
// // function post_process_data(data_dict_arr, name) {
// //     console.log('data dict arr', data_dict_arr);
// //     console.log('name', name);
// //
// //     return new Promise((resolve, reject) => {
// //         let y_vals = [];
// //         for (let el of Object.keys(data_dict_arr)) {
// //             console.log('el', data_dict_arr[el]);
// //             let transpose = [];
// //             for (let point of Object.keys(data_dict_arr[el].datapoints)) {
// //                 if (!isNaN(data_dict_arr[el].datapoints[point])) {
// //                     transpose.push(data_dict_arr[el].datapoints[point])
// //                 }
// //             }
// //             // console.log(transpose);
// //             y_vals = transpose
// //         }
// //         resolve(y_vals)
// //
// //     }).then(y_vals => {
// //         console.log('y vals', y_vals);
// //
// //         let x_vals = [...Array(y_vals.length).keys()];
// //         console.log('x_vals', x_vals);
// //
// //         // Reformat data
// //         // data = An array of objects, each of which contains an array of objects
// //         let xy_arr = []
// //         for (let i = 0; i < y_vals.length; i++) {
// //             xy_arr.push({
// //                 'x': x_vals[i],
// //                 'y': y_vals[i]
// //             })
// //         }
// //
// //         let data = {
// //             name: name,
// //             vals: xy_arr
// //         };
// //         console.log("data", data);
// //         final_arr.push(data)
// //         return data
// //     })
// }


// function get_data() {
//     console.log('heres all the data', final_arr)
//     let o = document.getElementById("overlap-range").value
//     let s = document.getElementById("step-range").value
//     console.log("o s", o, s)
//     horizon_graph(parseInt(o), parseInt(s))
// }

//congratulations on overcoming the Comment Void
//---------------------------------------------------------------------------------------
//-----------------------------------OUR FILES HERE---------------------------------------
function load_local(num) {
    if (num === 1) {
        //load petras data
        let path = "templates/static/data/set_1";
        read_files(path)

    }
    else if (num === 2) {
        //load philippes data
    }
}


function read_files(dirname) {


    for (let i = 0; i < 16; i++) {
        let cur_dirname = dirname + "/chan_" + String(i) + ".csv"

        d3.csv(cur_dirname).then(data => {

            console.log('first data', data)

            //make arrays for all columns we need
            let data_arr = Array.from(data, d => parseFloat(d.value))
            let x_arr = Array.from(data, d => parseInt(d.time))
            let events_arr = Array.from(data, d => parseFloat(d.event))

            //map them to the array of dictionaries we want
            let points = x_arr.map(function (e, i) {
                if (!isNaN(e) && !isNaN(data_arr[i])) {
                    return {'x': e, 'y': data_arr[i], 'event': events_arr[i]};
                }
            });
            //complete dictionary
            let dict = {
                'name': "chan_" + String(i),
                'vals': points
            }
            //push to global array
            final_arr.push(dict)
            console.log('dict post process', dict)
        })
    }
    setTimeout(function () {
        load_all_graphs()
    }, 800)
}


//csv file handling functions