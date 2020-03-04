'use strict'

//literally identical to horizon

function small_multiples_graph() {
    horizon_graph(1)
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