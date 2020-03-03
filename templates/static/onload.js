'use strict';

//gets called when new upload happens
function new_upload_temp(obj) {

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
        reader.onload = e => {
            if (extension === 'csv') {
                data_dict_arr = read_csv(e, f.name)
            }
            else if (extension === 'json') {
                data_dict_arr = read_json(e, f.name)
            }

            //this will get the data as an array of dicts with x and y values nicely organized
            post_process_data(data_dict_arr, name_list)
        };
        reader.readAsText(f)

    }
}


//handles what happens on json file load
function read_json(event, filename) {
    let data_dict_arr = [];
    data_dict_arr.push(JSON.parse(event.target.result))
    return data_dict_arr
}

//handles what happens on csv file load
function read_csv(event, filename) {
    // let event = e;
    //              let filename = f.name;
    let data_dict_arr = []
    let csv = event.target.result;
    // console.log(event.target);
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


function post_process_data(data_dict_arr, name_list) {
    console.log('data dict arr', data_dict_arr.length);
    console.log('names', name_list);

    new Promise((resolve, reject) => {
        let y_vals = {};
        for (let el of Object.keys(data_dict_arr)) {
            console.log('el', data_dict_arr[el]);
            let transpose = [];
            for (let point of Object.keys(data_dict_arr[el].datapoints)) {
                if (!isNaN(data_dict_arr[el].datapoints[point])) {
                    transpose.push(data_dict_arr[el].datapoints[point])
                }
            }
            // console.log(transpose);
            y_vals[data_dict_arr[el].name] = transpose
        }
        resolve(y_vals)

    }).then(y_vals => {
        console.log('y vals', y_vals);

        let x_vals = [...Array(Object.values(y_vals)[0].length).keys()];
        console.log('x_vals', x_vals);

        // Reformat data
        // data = An array of objects, each of which contains an array of objects
        var data = name_list.map(function (name) {
            let xy_arr = [];
            for (let i = 0; i < x_vals.length; i++) {
                xy_arr.push({
                    'x': x_vals[i],
                    'y': y_vals[name][i]
                })
            }
            return {
                name: name,
                vals: xy_arr
            };
        });
        console.log("data", data);
        return data
    })
}





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
//         if(extension==='csv'){
//             reader.onload = e => {read_csv(e, f.name);};
//             reader.readAsText(f);
//         }
//         else if (extension==='json'){
//             reader.onload = e => {read_json(e, f.name);}
//         }
//         reader.onerror = error_handler;
//         name_list.push(f.name);
//     }
//     let nextSibling = obj.nextElementSibling;
//     nextSibling.innerText = name_list;
//     console.log('data dict arr', data_dict_arr)
//     make_d3_graph(data_dict_arr,name_list)
// }


//csv file handling functions