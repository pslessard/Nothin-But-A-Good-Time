'use strict';

function new_upload(obj) {
    console.log('started new upload');

    // console.log(obj.id)
    console.log(obj.files);
    let files = obj.files; // FileList object
    let name_list = [];
    for (let i = 0, f; f = files[i]; i++) {
        let reader = new FileReader();
        var extension = f.name.split('.').pop().toLowerCase();//file extension from input file
        if(extension==='csv'){
            reader.onload = e => {read_csv(e, f.name);};
            reader.readAsText(f);
        }else if (extension==='json'){
            reader.onload = e => {read_json(e, f.name);}
        }
        reader.onerror = error_handler;
        name_list.push(f.name);

    }
    let nextSibling = obj.nextElementSibling;
    nextSibling.innerText = name_list;
}


//csv file handling functions

//handles what happens on json file load
function read_json(event, filename){
    console.log(JSON.parse(event.target.result));
    return JSON.parse(event.target.result);
}

//handles what happens on csv file load
function read_csv(event, filename) {
    let csv = event.target.result;
    // console.log(event.target);
    let allTextLines = csv.split(/\r\n|\n/);
    let datapoints = [];
    let events = [];
    for (let el of allTextLines) {
        let split = el.split(',');
        if(!isNaN(split[0])) {
            datapoints.push(parseFloat(split[0]));
        }

        if (split.length > 1) {
            if(!isNaN(split[1])){
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
    console.log('parsed csv data', data_dict)
}


function error_handler(evt) {
    console.log('error');
    if (evt.target.error.name === "NotReadableError") {
        alert("Cannot read file !");
    }
}