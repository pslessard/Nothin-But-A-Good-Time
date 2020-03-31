let color_schemes= {
        'blues': d3.scaleSequential()
        .domain([0, 4])
        .interpolator(d3.interpolateRgb("#b4c6e7", "#093077")),
    'purples': d3.scaleSequential()
        .domain([0, 5])
        .interpolator(d3.interpolateRgb("#ccc6ff","#450f4e")),
    'viridis': d3.scaleSequential()
        .domain([0, 5])
        .interpolator(d3.interpolateViridis)

}



function load_all_graphs() {

    let line_div = document.getElementById('line-div')
    // let horizon_div = document.getElementById('horizon-div')
    line_div.classList.remove = 'closed';
    line_div.style.position = 'relative'
    line_div.style.visibility = 'visible'
    // horizon_div.classList.remove = 'closed';
    //     horizon_div.style.position = 'relative'
    // horizon_div.style.visibility = 'visible'
            // document.getElementById('-container').classList.remove = 'closed';
    //
    document.getElementById("line-chart").innerHTML = "";
    // document.getElementById("horizon-chart").innerHTML = "";
    // document.getElementById("line-chart").innerHTML = "";



    add_options();
    let op = document.getElementById("tsc-range").value;
    linechart(parseInt(op));
    // add_ranges();
    // let o = document.getElementById("overlap-range").value;
    // let s = document.getElementById("step-range").value;
    // console.log("o s", o, s);
    // horizon_graph(parseInt(o), parseInt(s))

    // ridgeline_chart()
}


window.onload = function () {
    AOS.init();
    load_background(3)
    let all_imgs = document.getElementsByClassName('thumbnails')
    for(let i=0; i<all_imgs.length; i++){
        let img = all_imgs[i]
        img.addEventListener("mouseover", function(e){
            img.style.filter = "brightness(50%)"
            let text = document.createElement("DIV")
            text.className = "centered"
            text.id = 'text_'+String(i)
            switch (i) {
                case 0:
                    text.innerText = "Line Chart";
                    break;
                case 1:
                    text.innerText = "Horizon Chart";
                    break;
                case 2:
                    text.innerText = "Density Matrix";
                    break;
            }
            img.parentElement.append(text)

        });
        img.addEventListener("mouseout", function(e){
            img.style.filter = "brightness(100%)"
            document.getElementById("text_"+String(i)).remove()
        });

    }
}

