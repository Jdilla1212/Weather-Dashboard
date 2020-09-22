$(document).ready(function () {

    $("#date").text(moment().format("MMMM Do YYYY"));

    let searchHistory = JSON.parse(window.localStorage.getItem("city")) || [];

    $("#searchbtn").on("click", function (event) {
        event.preventDefault();
        let usersearch = $("#searchbar").val();
        console.log(usersearch);
        currentWeather(usersearch);
        $("#searchbar").val("");
        searchHistory.push(usersearch);
        window.localStorage.setItem("city", JSON.stringify(searchHistory));
        let newCity = $("<li>");
        newCity.attr("class", "list-group-item");
        let newCityBtn = $("<button>").text(usersearch).val(usersearch);
        newCity.append(newCityBtn);
        $("#citylist").append(newCity);
    })


    for (i = 0; i < searchHistory.length; i++) {

        let newCity = $("<li>");
        let newCityBtn = $("<button>").text(searchHistory[i]).val(searchHistory[i]);
        newCity.append(newCityBtn);
        $("#citylist").append(newCity);

    }

$("#citylist").on("click", "button", function(event) {
    event.preventDefault();
    currentWeather($(this).val());

})





    function currentWeather(city) {
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=c61145b4fc397c4d9a55e08f94847531",
            method: "GET"
        }).then(function (response) {
            console.log(response);

            let temperature = response.main.temp;
            // console.log(temperature);
            $("#temp").text("Temperature: " + (((temperature - 273.15) * 1.8) + 32).toFixed(2) + "°F");
            $("#humidity").text("Humidty: " + response.main.humidity + "%");
            $("#city").text(response.name);

            uvIndex(response.coord.lat, response.coord.lon);
            fiveDayForecast(city);
        });
    };

    function uvIndex(lat, lon) {
        //UV index api call 
        let uvIndexUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=c61145b4fc397c4d9a55e08f94847531&lat=" + lat + "&lon=" + lon;
        // console.log(uvIndexUrl);
        $.ajax({
            url: uvIndexUrl,
            method: "GET"
        }).then(function (uvResponse) {

            //add if else statement for styling page for background color
            console.log(uvResponse);
            $("#UV").text("UV Index: " + uvResponse.value)

        })

    };

    function fiveDayForecast(city) {
        //5 day forecast api call
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=c61145b4fc397c4d9a55e08f94847531",
            method: "GET"
        }).then(function (fiveDayResponse) {
            console.log(fiveDayResponse);
            let filteredArray = fiveDayResponse.list.filter((time) => {
                return time.dt_txt.includes("15:00:00");
            });
            console.log(filteredArray);

            for (let i = 0; i < filteredArray.length; i++) {

                console.log(filteredArray[i].main.temp);

            }
        })

    };


})