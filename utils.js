// util
function makeElementInDiv({el_name, el_id=null, el_class_li=null, el_text=null, div_id=null, div_class_li=null}) {
    let the_div = document.createElement("div");
    if (div_id !== null) {
        the_div.id = div_id;
    }
    if (div_class_li !== null) {
        for ( let i = 0; i < div_class_li.length; i++ ) {
            the_div.classList.add(div_class_li[i])
        }
    }
    
    let the_el = document.createElement(el_name);
    if ( el_id !== null ) {
        the_el.id = el_id;
    }
    if ( el_class_li !== null ) {
        for ( let i = 0; i < el_class_li.length; i++ ) {
            the_el.classList.add(el_class_li[i])
        }
    }
    if ( el_text !==null ) {
        // console.log(el_text);
        the_el.innerText = el_text;
    }
    the_div.appendChild(the_el);

    return [the_div, the_el];
}

function makeSelect(select_id, opt_value_map) {
    let select = document.createElement("select");
    select.id = select_id;

    let temp = document.createElement("option");
    // temp.textContent = "";
    temp.value = "unselect";
    select.appendChild(temp);

    Object.keys(opt_value_map).sort().forEach( (key) => {
        temp = document.createElement("option");
        temp.textContent = key;
        temp.value = opt_value_map[key];
        select.appendChild(temp);
    });

    return select;
}


function checkSame(a, b) {

    a = a.split(/ |\\/);
    b = b.split(/ |\\/);
    if ( a[a.length - 1] === "District" ) { a.pop() }
    if ( b[b.length - 1] === "District" ) { b.pop() }

    const a_len = a.length;
    const b_len = b.length;
    let num_of_match = 0;
    // console.log(a, b);
    switch(true) {
        // case ( a_len !== b_len ):
        case ( a[0][0] === b[0][0] ):
        case ( a[a_len-1][a_len-1] === b[b_len-1][b_len-1] ):
            for ( let i = 0; i < Math.min(a_len, b_len); ++i ) {
                if ( a[i] === b[i] ) {
                    ++num_of_match;
                }
            }
            break;
        default:
            return false;
    }

    if ( Math.min(a_len, b_len) == 1 ) {
        if ( num_of_match == 1 ) { 
            // console.log(b);
            return true; 
        }
    } else {
        if ( num_of_match >= 2 ) { 
            // console.log(b);
            return true; 
        }
    }

    return false;
}

function calDistance(lat, lon, tar_lat, tar_lon) {
    let lambda = lat * Math.PI/180;
    let theta = lon * Math.PI/180;
    let tar_lambda = tar_lat * Math.PI/180;
    let tar_theta = tar_lon * Math.PI/180;

    const x = (tar_lambda - lambda) * Math.cos((tar_theta + theta) / 2);
    const y = (theta - tar_theta);
    const d = Math.sqrt(x * x + y * y) * 6371000;

    return d;
}

function getImage(img, src, alt) {
    img.src = src;
    img.onerror = () => {
        alert("Some images cannot be loaded. ")
        console.log("Some images cannot be loaded: " + url)
    }
    img.alt = alt;
    // return fetch(url)
    //     .then( (response) => {
    //         if (response.ok) {
    //             return response.blob();
    //         } else {
    //             throw new Error("Request failed | status: " + response.status);
    //         }
    //     } )
    //     // .then( (resolved_data) => {console.log(resolved_data)} )
    //     .catch( (error) => {
    //         console.error("Error: " + error.message + "\nurl: " + url);
    //         throw error;
    //     } )
    // return fetch(src)
    //     .then(response => response.blob())
        
    //     .catch(error => {
    //         console.log('发生错误:', error);
    //     });
}

function getData(url) {
    // let data;
    return fetch(url)
        .then( (response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Request failed | status: " + response.status);
            }
        } )
        // .then( (resolved_data) => {console.log(resolved_data)} )
        .catch( (error) => {
            console.error("Error: " + error.message + "\nurl: " + url);
            throw error;
        } )
}

export {makeElementInDiv, makeSelect, checkSame, calDistance, getImage, getData};