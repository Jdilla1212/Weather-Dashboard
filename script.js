$(document).ready(function () {

    $("#forecastdiv").css("display", "none");

    let searchHistory = JSON.parse(window.localStorage.getItem("city")) || [];

    $("#searchbtn").on("click", function (event) {
        event.preventDefault();
        $("#forecastcard").empty();
        $("#date").text(moment().format("MMMM Do YYYY"));
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
        $("#forecastdiv").css("display", "block");
    })


    for (i = 0; i < searchHistory.length; i++) {

        let newCity = $("<li>");
        let newCityBtn = $("<button>").text(searchHistory[i]).val(searchHistory[i]);
        newCity.append(newCityBtn);
        $("#citylist").append(newCity);

    }

    $("#citylist").on("click", "button", function (event) {
        event.preventDefault();
        $("#date").text(moment().format("MMMM Do YYYY"));
        currentWeather($(this).val());

    })





    function currentWeather(city) {
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=c61145b4fc397c4d9a55e08f94847531&units=imperial",
            method: "GET"
        }).then(function (response) {
            console.log(response); 
            $("#forecastcard").empty();
            let temperature = response.main.temp;
            let weatherIcon = $("<img>");
            weatherIconUrl = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"
            weatherIcon.attr("src", weatherIconUrl)
            // console.log(temperature);
            $("#temp").text("Temperature: " + temperature + "°F");
            $("#humidity").text("Humidty: " + response.main.humidity + "%");
            $("#windspeed").text("Windspeed: " + response.wind.speed + " mph")
            $("#city").text(response.name);
            $("#city").append(weatherIcon);

            uvIndex(response.coord.lat, response.coord.lon);
            fiveDayForecast(city);
            $("#forecastdiv").css("display", "block");
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
            let uvIndexDisplay = $("<span>")

            if (uvResponse.value < 3) {
                $(uvIndexDisplay).css("background-color", "green");
            } else if (uvResponse.value >= 3 && uvResponse.value < 6) {
                $(uvIndexDisplay).css("background-color", "yellow");
            } else {
                $(uvIndexDisplay).css("background-color", "red");
            };

            $("#UV").text("UV Index: ");
            $("#UV").append(uvIndexDisplay.text(uvResponse.value));
            
        })

    };

    function fiveDayForecast(city) {
        //5 day forecast api call
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=c61145b4fc397c4d9a55e08f94847531&units=imperial",
            method: "GET"
        }).then(function (fiveDayResponse) {
            // console.log(fiveDayResponse);
            let filteredArray = fiveDayResponse.list.filter((time) => {
                return time.dt_txt.includes("15:00:00");
            });
            console.log(filteredArray);

            for (let i = 0; i < filteredArray.length; i++) {

                let date = filteredArray[i].dt_txt.split(" ", 1);
                let temp = filteredArray[i].main.temp;
                let humidity = filteredArray[i].main.humidity;
                let iconUrl = "http://openweathermap.org/img/wn/" + filteredArray[i].weather[0].icon + "@2x.png";

                let card = $("<div>").addClass("card").css("width", "10rem").css("background-color", "dodgerblue");
                let cardBody = $("<div>").addClass("card-body");
                let cardDate = $("<h6>").addClass("card-title").text("Date: " + date);
                let cardIcon = $("<img>").attr("src", iconUrl);
                let cardTemp = $("<p>").addClass("card-text").text("Temp: " + temp + "°F");
                let cardHumidity = $("<p>").addClass("card-text").text("Humidity: " + humidity + "%");

                cardBody.append(cardDate, cardIcon, cardTemp, cardHumidity);
                card.append(cardBody)
                $("#forecastcard").append(card);
                

            }
        })

    };


})