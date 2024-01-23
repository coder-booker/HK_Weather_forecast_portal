import * as utils from "./utils.js";

// main
function makeBasicHtml() {
    let the_body = window.document.getElementsByTagName("body")[0];
    let main_title = document.createElement("h1");
    main_title.id = "main-title";
    main_title.textContent = "My Weather Portal";
    the_body.appendChild(main_title);
    
    let main_content = document.createElement("div");
    main_content.id = "main-content"
    
    let header = utils.makeElementInDiv({
        el_name: "p", el_class_li: ["sub-title"], el_text: "Hong Kong", 
        div_id: "header", 
    })[0];
    
    let my_data = utils.makeElementInDiv({
        el_name: "p", el_class_li: ["sub-title"], el_text: "My location", 
        div_id: "my-data", 
    })[0];

    let tem = utils.makeElementInDiv({
        el_name: "p", el_class_li: ["sub-title"], el_text: "Temperature", 
        div_id: "tem", div_class_li: ["item-1"], 
    })[0];
    
    let rain = utils.makeElementInDiv({
        el_name: "p", el_class_li: ["sub-title"], el_text: "Rainfall", 
        div_id: "rain", div_class_li: ["item-1"], 
    })[0];
    
    let air = utils.makeElementInDiv({
        el_name: "p", el_class_li: ["sub-title"], el_text: "Air Quality", 
        div_id: "air", div_class_li: ["item-1"], 
    })[0];
    
    let forecast = utils.makeElementInDiv({
        el_name: "p", el_id: "forecast-title", el_class_li: ["sub-title"], el_text: "9-day Forecast", 
        div_id: "forecast"
    })[0];

    main_content.appendChild(header);
    main_content.appendChild(my_data);
    main_content.appendChild(tem);
    main_content.appendChild(rain);
    main_content.appendChild(air);
    main_content.appendChild(forecast);
    
    the_body.appendChild(main_content);
    
    return {
        the_body, 
        main_title, 
        main_content, 
        header, 
        my_data, 
        tem, 
        rain, 
        air, 
        forecast
    };
}

function setHeader(header, data) {
    
    let img = document.createElement("img");
    // const img_data = utils.getData("https://www.hko.gov.hk/images/HKOWxIconOutline/pic"+data.icon[0]+".png");
    // img_data.then( (blob) => {
    //     // const img = document.createElement('img');
    //     img.src = URL.createObjectURL(blob);
    //     img.alt = data.icon[0];
    //     img.classList.add("img-1");
    // });
    utils.getImage(img, "https://www.hko.gov.hk/images/HKOWxIconOutline/pic"+data.icon[0]+".png", data.icon[0]);
    img.classList.add("img-1");
    
    let current_tem = utils.makeElementInDiv({
        el_name: "p", el_class_li: ["tem-1", "txt-1"], el_text: data.temperature.data[1].value, 
        div_class_li: ["txt-div"]
    })[0];
    
    let current_hum = utils.makeElementInDiv({
        el_name: "p", el_class_li: ["hum-1", "txt-1"], el_text: data.humidity.data[0].value, 
        div_class_li: ["txt-div"]
    })[0];

    let current_rain = utils.makeElementInDiv({
        el_name: "p", el_class_li: ["rain-1", "txt-1"], el_text: data.rainfall.data[13].max, 
        div_class_li: ["txt-div"]
    })[0];
    
    let current_time = document.createElement("p");
    current_time.textContent = "Last update: " + data.updateTime.slice(11, 16);
    current_time.id = "time-1";
    
    // let url_1;
    let url_2;
    let current_uv;
    if (6 < parseInt(data.updateTime.slice(11, 13), 10) && parseInt(data.updateTime.slice(11, 13), 10) < 18) {
        // if (data.rainfall.data[13].max > 0) {
        //     url_2 = "./images/water-drops-glass-day.jpg";
        //     // header.style.zIndex = "0";
        // }
        // console.log(data.updateTime.slice(11, 13));
        // url_1 = "./images/blue-sky.jpg";
        url_2 = (data.rainfall.data[13].max > 0) ? "./images/water-drops-glass-day.jpg" : "./images/blue-sky.jpg";
        // url_2
        header.style.color = "black";
        current_uv = utils.makeElementInDiv({
            el_name: "p", el_class_li: ["uv-1", "txt-1"], el_text: data.uvindex.data[0].value, 
            div_class_li: ["txt-div"]
        })[0];
    } else {
        // if (data.rainfall.data[13].max > 0) {
        url_2 = (data.rainfall.data[13].max > 0) ? "./images/water-drops-glass-night.jpg" : "./images/night-sky.jpg";
        // url_2 = (true) ? "./images/water-drops-glass-night.jpg" : "./images/night-sky.jpg";
        header.style.color = "white";
    }
    // let raining;
    header.style.backgroundImage = `url('${url_2}')`;

    let current_warning;
    if ( data.warningMessage !== "" ) {
        current_warning = utils.makeElementInDiv({
            el_name: "p", el_id: "warn-1", el_text: "Warning", 
            div_id: "warn-div"
        })[0];
        
        let temp = document.createElement("p");
        temp.id = "warn-2";
        for ( const warn_i in data.warningMessage ) {
            if ( data.warningMessage.hasOwnProperty(warn_i) ) {
                temp.innerText += "\n" + data.warningMessage[warn_i];
            }
        }
        temp.style.display = "none";
        current_warning.appendChild(temp);
        let clicked = false;
        current_warning.addEventListener("click", (event) => {
            if ( !clicked ) {
                temp.style.display = "block";
            } else {
                temp.style.display = "none";
            }
            clicked = !clicked;
        });
    }

    header.appendChild(img);
    header.appendChild(current_tem);
    header.appendChild(current_hum);
    header.appendChild(current_rain);
    if ( current_uv !== undefined ) { header.appendChild(current_uv); }
    header.appendChild(current_time);
    if ( current_warning !== undefined ) { header.appendChild(current_warning); }
}


function getLoc_succ(my_data, pos_data, data) {
    const [WR, AIR] = data;
    const current_lat = pos_data.coords.latitude;
    const current_lon = pos_data.coords.longitude;
    const url = 
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${current_lat}&lon=${current_lon}&zoom=18&addressdetails=1`
    
    let location_data = utils.getData(url);
    location_data.then( (location_data) => {
        let temp = document.createElement("p");
        let exact_loc = "";
        let suburb;
        switch(true) {
            case ( location_data.address.hasOwnProperty("suburb") ):
                suburb = location_data.address.suburb;
                break;
                case ( location_data.address.hasOwnProperty("borough") ):
                    suburb = location_data.address.borough;
                break;
                case ( location_data.address.hasOwnProperty("town") ):
                suburb = location_data.address.town;
                break;
                default:
                    suburb = "Unknown";
                break;
            }
            exact_loc += suburb;
            
            exact_loc += ", ";
            let district;
            if ( location_data.address.hasOwnProperty("city_district") ) {
                district = location_data.address.city_district;
            } else {
            const arr = Object.keys(location_data.address);
            let found = false;
            for ( let i = 0; i < arr.length; ++i ) {
                if ( location_data.address[arr[i]].includes("District") ) {
                    district = location_data.address[arr[i]];
                    found = true;
                    break;
                }
            }
            district = found ? district : "Unknown"
        }
        exact_loc += district;
        temp.textContent = exact_loc;
        
        my_data.appendChild(temp);
        
        // get rain fall
        let my_rain;
        const arr = Object.keys(WR.rainfall.data);
        let dist_i;
        for ( dist_i = 0; dist_i < arr.length; ++dist_i ) {
            
            if ( utils.checkSame(WR.rainfall.data[arr[dist_i]].place, district) ) {
                
                my_rain = utils.makeElementInDiv({
                    el_name: "p", el_class_li: ["rain-1", "txt-1"], el_text: WR.rainfall.data[dist_i].max, 
                    div_class_li: ["txt-div"]
                })[0];
                my_data.appendChild(my_rain);
            }
        }

        // get nearest temperature
        let tem_sta = utils.getData("https://ogciopsi.blob.core.windows.net/dataset/weather-station/weather-station-info.json")
        tem_sta.then( (tem_sta_data) => {
            let min = utils.calDistance(
                current_lat, current_lon, 
                tem_sta_data[0].latitude, tem_sta_data[0].longitude
                );
                let min_i = 0;
                let dis = 0;
                for ( const sta_i in tem_sta_data ) {   // find  closest weather station
                if ( tem_sta_data.hasOwnProperty(sta_i) ) {
                    dis = utils.calDistance(
                        current_lat, current_lon, 
                        tem_sta_data[sta_i].latitude, tem_sta_data[sta_i].longitude
                        );
                        if ( min > dis ) {
                        min = dis;
                        min_i = sta_i;
                    }
                }
            }

            for ( const tem_i in WR.temperature.data ) {     // find weather station's same name tem station
                if ( WR.temperature.data.hasOwnProperty(tem_i) ) {
                    if ( utils.checkSame(WR.temperature.data[tem_i].place, tem_sta_data[min_i].station_name_en) ) {
                        let my_tem = utils.makeElementInDiv({
                            el_name: "p", el_class_li: ["tem-1", "txt-1"], el_text: WR.temperature.data[tem_i].value, 
                            div_class_li: ["txt-div"]
                        })[0];
                        my_data.insertBefore(my_tem, my_rain);
                        break;
                    }
                }
            }
        });
        
        // get nearest air
        let air_sta = utils.getData("./data/aqhi-station-info.json");
        air_sta.then( (air_sta_data) => {
            let min = utils.calDistance(
                current_lat, current_lon, 
                air_sta_data[0].latitude, air_sta_data[0].longitude
                );;
                let min_i = 0;
                let dis = 0;
                for ( const sta_i in air_sta_data ) {
                    if ( air_sta_data.hasOwnProperty(sta_i) ) {
                    dis = utils.calDistance(
                        current_lat, current_lon, 
                        air_sta_data[sta_i].latitude, air_sta_data[sta_i].longitude
                        );
                        if ( min > dis ) {
                            min = dis;
                        min_i = sta_i;
                    }
                }
            }
            for ( const air_i in AIR ) {     // find weather station's same name tem station
                if ( AIR.hasOwnProperty(air_i) ) {
                    if ( utils.checkSame(AIR[air_i].station, air_sta_data[min_i].station) ) {
                        let [my_air, t] = utils.makeElementInDiv({
                            el_name: "p", el_class_li: ["air-1", "txt-1"], el_text: AIR[air_i].aqhi + "\n", 
                            div_class_li: ["air-div"]
                        });
                        let temp = document.createElement("span");
                        temp.innerText = AIR[air_i].health_risk;
                        t.appendChild(temp);
                        my_air.style.backgroundImage = `url('./images/aqhi-${AIR[air_i].health_risk.toLowerCase()}.png')`;
                        my_data.appendChild(my_air);
                        break;
                    }
                }
            }
        });
    });
}

function setMyData(my_data, data) {
    navigator.geolocation.getCurrentPosition( 
        (pos_data) => {getLoc_succ(my_data, pos_data, data)},
        (error) => {console.error(error)}
    );
}
    
function setSmallWin(a) {
    let win_wid = window.innerWidth; 
    const children = a.childNodes;
    // let a_clicked = false;
    // let b_clicked = false;
    // let c_clicked = false;
    if ( win_wid <= 500 ) {
        // let clicked = false;
        // const children = a.childNodes;
        for (let i = 1; i < children.length; i++) {
            let child = children[i];
            child.style.display = "none";
        }
        a.firstElementChild.addEventListener("click", (event) => {
            const children = event.target.parentNode.childNodes;
            // console.log(event.target);
            if ( children[1].style.display === "block" ) {
                for (let i = 1; i < children.length; i++) {
                    children[i].style.display = "none";
                }
            } else {
                for ( let temp1 of ["tem", "rain", "air"] ) {
                    // console.log(temp1);
                    let temp = document.getElementById(temp1);
                    // console.log(temp);
                    for (let i = 1; i < temp.childNodes.length; i++) {
                        temp.childNodes[i].style.display = "none";
                    }
                }
                for (let i = 1; i < children.length; i++) {
                    children[i].style.display = "block";
                }
            }
            // if ( !(a_clicked || b_clicked || c_clicked) ) {
            //     for (let i = 1; i < children.length; i++) {
            //         children[i].style.display = "block";
            //     }
            // }
            // if ( !clicked ) {
            //     for (let i = 1; i < children.length; i++) {
            //         let child = children[i];
            //         child.style.display = "block";
            //     }
            // } else {
            //     for (let i = 1; i < children.length; i++) {
            //         let child = children[i];
            //         child.style.display = "none";
            //     }
            // }
            // clicked = !clicked;
        })
    } else {
        // console.log(12345678);
        // let clicked = false;
        window.addEventListener("resize", () => {
            // console.log(window.innerWidth);
            if ( window.innerWidth <= 500 ) {
                for (let i = 1; i < children.length; i++) {
                    let child = children[i];
                    child.style.display = "none";
                }
                a.firstElementChild.addEventListener("click", (event) => {
                    const children = event.target.parentNode.childNodes;
                    // console.log(event.target);
                    if ( children[1].style.display === "block" ) {
                        for (let i = 1; i < children.length; i++) {
                            children[i].style.display = "none";
                        }
                    } else {
                        for ( let temp1 of ["tem", "rain", "air"] ) {
                            // console.log(temp1);
                            let temp = document.getElementById(temp1);
                            // console.log(temp);
                            for (let i = 1; i < temp.childNodes.length; i++) {
                                temp.childNodes[i].style.display = "none";
                            }
                        }
                        for (let i = 1; i < children.length; i++) {
                            children[i].style.display = "block";
                        }
                    }
                })
            } 
            // else {
            //     a.removeEventListner("click", () => {
            //         for (let i = 1; i < children.length; i++) {
            //             let child = children[i];
            //             child.style.display = "block";
            //         }
            //     })
            // }
        })
    }
}

function setTem(tem, data) {
    let t = document.createElement("p");
    t.textContent = "Select the location";
    tem.appendChild(t);

    let dist_tem_map = {};
    let the_district;
    Object.keys(data.temperature.data).forEach( (i) => {
        the_district = data.temperature.data[i]
        dist_tem_map[the_district.place] = the_district.value;
    } );

    let tem_display = document.createElement("p");
    tem_display.classList.add("txt-2");
    tem_display.innerHTML = "&nbsp";

          

    let dropdown = utils.makeSelect("tem_select", dist_tem_map);
    dropdown.addEventListener("change", () => {
        if ( dropdown.value === "unselect" ) {
            tem_display.classList.remove("tem-1");
            tem_display.innerHTML = "&nbsp";
        } else {
            tem_display.classList.add("tem-1");
            tem_display.innerHTML = dropdown.value;
        }
    });
    tem.appendChild(dropdown);
    tem.appendChild(tem_display);
    setSmallWin(tem);    
}

function setRainFall(rain, data) {
    let t = document.createElement("p");
    t.textContent = "Select the district";
    rain.appendChild(t);

    let dist_rain_map = {}

    let the_district;
    Object.keys(data.rainfall.data).forEach( (i) => {
        the_district = data.rainfall.data[i]
        dist_rain_map[the_district.place] = the_district.max;
    } );

    let rain_display = document.createElement("p");
    rain_display.classList.add("txt-2");
    rain_display.innerHTML = "&nbsp";
    
    let dropdown = utils.makeSelect("rain_select", dist_rain_map);
    dropdown.addEventListener("change", () => {
        if ( dropdown.value === "unselect" ) {
            rain_display.classList.remove("rain-2");
            rain_display.innerHTML = "&nbsp";
        } else {
            rain_display.classList.add("rain-2");
            rain_display.textContent = dropdown.value;
            rain.appendChild(rain_display);
        }
    });

    rain.appendChild(dropdown);
    rain.appendChild(rain_display);
    setSmallWin(rain);   
}

function setAirQuality(air, data) {
    let t = document.createElement("p");
    t.textContent = "Select the AQ station";
    air.appendChild(t);

    let dist_air_map = {}

    // let the_district;
    Object.keys(data).forEach( (i) => {
        // the_district = data[i]
        dist_air_map[data[i].station] = data[i].aqhi + data[i].health_risk;
    } );

    let air_display = document.createElement("p");
    air_display.classList.add("txt-2");
    air_display.innerHTML = "&nbsp";
    
    let dropdown = utils.makeSelect("air_select", dist_air_map);
    dropdown.addEventListener("change", () => {
        if ( dropdown.value === "unselect" ) {
            air_display.classList.remove("air-2");
            // air_display.style.display = "none";
            air_display.innerHTML = "&nbsp";
        } else {
            air_display.classList.add("air-2");
            // air_display.style.display = "block";
            air_display.innerText = "Level: " + dropdown.value[0] + "\nRisk: " + dropdown.value.slice(1);
            air.appendChild(air_display);
        }
    });

    // rain.appendChild(dropdown);
    air.appendChild(dropdown);
    air.appendChild(air_display);
    setSmallWin(air);   
}

// function setSmallWin(a, b, d) {
//     window.addEventListener()
// }

function setForecast(forecast, data) {
    let forecast_items = document.createElement("div");
    forecast_items.id = "forecast-items";
    for ( let i = 0; i < 9; ++i ) {
        let the_day = document.createElement("div");
        the_day.classList.add("forecast-item")

        let temp = document.createElement("p");
        temp.textContent = `${data.weatherForecast[i].week.slice(0, 3)} ${data.weatherForecast[i].forecastDate.slice(6)}/${data.weatherForecast[i].forecastDate.slice(4, 6)}`;
        the_day.appendChild(temp);

        let img = document.createElement("img");
        utils.getImage(img, "https://www.hko.gov.hk/images/HKOWxIconOutline/pic"+data.weatherForecast[i].ForecastIcon+".png", data.weatherForecast[i].ForecastIcon);
        img.classList.add("img-2");
        the_day.appendChild(img)

        img = document.createElement("img");
        utils.getImage(img, "./images/PSR"+data.weatherForecast[i].PSR+".png", data.weatherForecast[i].PSR);
        img.classList.add("img-2");
        the_day.appendChild(img)

        temp = document.createElement("p");
        temp.textContent = data.weatherForecast[i].forecastMintemp.value + "-" + data.weatherForecast[i].forecastMaxtemp.value + "℃";
        the_day.appendChild(temp);

        temp = document.createElement("p");
        temp.textContent = data.weatherForecast[i].forecastMinrh.value + "-" + data.weatherForecast[i].forecastMaxrh.value + "%";
        the_day.appendChild(temp);

        forecast_items.appendChild(the_day);
    }
    forecast.appendChild(forecast_items);
}

function main() {
    let basic_html = makeBasicHtml();
    
    // document
    let current_WR = utils.getData("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en");
    // let current_WR = utils.getData("./data/weather.Oct4.json");
    current_WR.then( (data) => {setHeader(basic_html.header, data)} );
    
    let temperatue = current_WR;
    temperatue.then( (data) => {setTem(basic_html.tem, data)} );
    let rain_fall = current_WR;
    rain_fall.then( (data) => {setRainFall(basic_html.rain, data)} );
    let air_quality = utils.getData("https://dashboard.data.gov.hk/api/aqhi-individual?format=json")
    air_quality.then( (data) => {setAirQuality(basic_html.air, data)} );


    
    Promise.all([current_WR, air_quality])
        .then( (data) => {setMyData(basic_html.my_data, data)} );

    let forecast = utils.getData("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en");
    
    forecast.then( (data) => {setForecast(basic_html.forecast, data)} );

    return;
}

window.onload = main
