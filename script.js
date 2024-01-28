var locations = [];
const APIKEY = "6001746542f4083b5c882c0d51f514fd";

function displayWeatherInfo (event) {
    $("#forecast").empty();
    event.preventDefault();
    const location = $(this).attr('data-name') || $(".form-input").val().trim();
    console.log(location)

    // TAKES LOCATION
    var queryURL1 = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${APIKEY}`;

    fetch(queryURL1)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
      
        console.log(data[0].lat, data[0].lon)
        return {
            lat: data[0].lat,
            lon: data[0].lon,
        }
    })
    .then(function (coordinates){

        // TAKES FORCAST
        var queryURL2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&cnt=50&appid=${APIKEY}`;

        fetch(queryURL2)
        .then(function (response) {
            console.log('response', response);
            return response.json();
        })
        .then(function (forecast) {
            $('#today').empty();
            // Top box
            var date = forecast.list[0].dt_txt;
            var temp = forecast.list[0].main.temp;
            var wind = forecast.list[0].wind.speed;
            var humidity = forecast.list[0].main.humidity;
            let locationInfo = $('#today').append($(`<h3>${location} ${date}</h3>`));
            let tempInfo = locationInfo.append(`<div>Temp: ${(temp-273).toFixed(2)} °C</div>`);
            let windInfo = tempInfo.append(`<div>Wind: ${wind} KPH</div>`);
            let humidityInfo = windInfo.append(`<div>Humidity: ${humidity} %</div>`);
            console.log('forecast', forecast);
            
            

            // Cards
            const forecastCardData = [];
            let currentDate = new Date(forecast.list[0].dt_txt).getDate();
            for (let i = 1; i < forecast.list.length; i++ ) {
                const nextHours = new Date(forecast.list[i].dt_txt).getHours();
                if (nextHours == 0) {
                    forecastCardData.push(forecast.list[i]);
                }
            }
            console.log('forecastCardData', forecastCardData)

            for (let i = 0; i < forecastCardData.length; i ++) {

                let cardDiv = $(`<div class="card"></div>`);
                let cardBody = $(`<div class="card-body"></div>`);
                let cardTitle = $(`<h5 class="card-title">${forecastCardData[i].dt_txt}</h5>`);
                let cardInfo = $(`<p class="card-text">Temp: ${(forecastCardData[i].main.temp-273).toFixed(2)} °C</p>
                            <p class="card-text">Wind: ${forecastCardData[i].wind.speed} KPH</p>
                            <p class="card-text">Humidity: ${forecastCardData[i].main.humidity} %</p>`);

                $('#forecast').append($(cardDiv));
                cardDiv.append(cardBody);
                cardBody.append(cardTitle);
                cardBody.append(cardInfo); 
            }
        
        })
    });

    
}

function displayButtons() {

    $(".list-group").empty();

    for (var i = 0; i < locations.length; i++) {
      
          var btn = $("<button>");
          btn.addClass("location");
          btn.attr("data-name", locations[i]);
          btn.text(locations[i]);
          $(".list-group").append(btn);
          $('.location').on("click", displayWeatherInfo);
    }
    
}

$("#search-button").on("click", function (event) {
    event.preventDefault();
    var newLocation = $(".form-input").val().trim();
    locations.push(newLocation);
    displayButtons();
  
  });

$(document).on("click", "#search-button", displayWeatherInfo);
displayButtons();

// Sort layout with CSS/Bootstrap

// Display next 5 days with cards

// Display date correctly

// Display weather icon according to the weather