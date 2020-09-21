$(document).ready(function () {

    $("#date").text(moment().format("MMMM Do YYYY"));


    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?q=Phoenix&appid=c61145b4fc397c4d9a55e08f94847531",
        method: "GET"
    }).then(function (response) {
        console.log(response);

        let temperature = response.main.temp;
        // console.log(temperature);
        $("#temp").text("Temperature: " + (((temperature - 273.15) * 1.8) + 32).toFixed(2) + "°F");
        $("#humidity").text("Humidty: " + response.main.humidity + "%");
        $("#city").text(response.name);

        //UV index api call
        let uvIndexUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=c61145b4fc397c4d9a55e08f94847531&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
        // console.log(uvIndexUrl);
        $.ajax({
            url: uvIndexUrl,
            method: "GET"
        }).then(function (uvResponse) {
            // console.log(uvResponse);
            $("#UV").text("UV Index: " + uvResponse.value)

        })

        //5 day forecast api call
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast?q=Phoenix&appid=c61145b4fc397c4d9a55e08f94847531",
            method: "GET"
        }).then(function (fiveDayResponse) {
            console.log(fiveDayResponse);

        })


    });







})