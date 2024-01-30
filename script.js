// var locations = [];
const APIKEY = "6001746542f4083b5c882c0d51f514fd";

function formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return day + "/" + month + "/" + year;
}

function displayWeatherInfo (event) {
    event.preventDefault();

    // Empty elements before displaying new data
    $("#forecast").empty();
    $("#today").empty().removeClass('city');
    const location = $(this).attr('data-name') || $(".form-input").val().trim();
    if (!location) {
        return;
    }

    const storedForecast = localStorage.getItem(location);
    // Retrieves coordinates
    var queryURL1 = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${APIKEY}`;

    fetch(queryURL1)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        return {
            lat: data[0].lat,
            lon: data[0].lon,
        }
    })
    .then(function (coordinates){
        // Retrieves forecast
        var queryURL2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&cnt=50&appid=${APIKEY}`;

        fetch(queryURL2)
        .then(function (response) {
            return response.json();
        })
        .then(function (forecast) {
            $('#today').empty();
            var date = forecast.list[0].dt_txt;
            var wind = forecast.list[0].wind.speed;
            var { temp, humidity } = forecast.list[0].main;        

            // Today's weather display info
            $('#today')
                .addClass('city')
                .append($(`<h3>${location} (${formatDate(new Date(date))})<span><img src="https://openweathermap.org/img/wn/${forecast.list[0].weather[0].icon}.png"></img></span></h3>`))
                .append(`<div>Temp: ${(temp-273).toFixed(2)} °C</div>`)
                .append(`<div>Wind: ${wind} KPH</div>`)
                .append(`<div>Humidity: ${humidity} %</div>`);
            
            
            // Find the forecast for the next 5 days
            const forecastCardData = [];
            for (let i = 1; i < forecast.list.length; i++) {
                const nextHours = new Date(forecast.list[i].dt_txt).getHours();
                if (nextHours == 0) {
                    forecastCardData.push(forecast.list[i]);
                }
            }

            const forecastElem = $('#forecast').append('<h3>5-Day Forecast</h3>').append('<div class="card-container">');
            for (let i = 0; i < forecastCardData.length; i ++) {
                let cardDiv = $(`<div class="card"></div>`);
                let cardBody = $(`<div class="card-body text-white bg-dark"></div>`);
                let cardTitle = $(`<h5 class="card-title">${formatDate(new Date(forecastCardData[i].dt_txt))}</h5>`);
                let cardIcon = $(`<img src="https://openweathermap.org/img/wn/${forecastCardData[i].weather[0].icon}.png"></img>`)
                let cardInfo = $(`<p class="card-text">Temp: ${(forecastCardData[i].main.temp-273).toFixed(2)} °C</p>
                                <p class="card-text">Wind: ${forecastCardData[i].wind.speed} KPH</p>
                                <p class="card-text">Humidity: ${forecastCardData[i].main.humidity} %</p>`);
                
                $('.card-container').append(cardDiv);
                cardDiv.append(cardBody);
                cardBody
                    .append(cardTitle)
                    .append(cardIcon)
                    .append(cardInfo); 
            }
        })
    }); 
};

function displayButtons() {
    $(".list-group").empty();
    const locations = JSON.parse(localStorage.getItem('locations')) || [];

    for (var i = 0; i < locations.length; i++) {    
        var btn = $("<button>")
            .addClass("location")
            .attr("data-name", locations[i])
            .text(locations[i]);
        $(".list-group").append(btn);
    }
    
    $('.location').on("click", displayWeatherInfo);
};

$("#search-button").on("click", function (event) {
    event.preventDefault();
    var newLocation = $(".form-input").val().trim();
    if (!newLocation) {
        return;
    }
    const locations = JSON.parse(localStorage.getItem('locations')) || [];
    locations.push(newLocation);
    localStorage.setItem('locations', JSON.stringify(locations));
    displayButtons();
});

$(document).on("click", "#search-button", displayWeatherInfo);
displayButtons();
