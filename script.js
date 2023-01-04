var cityName = $('#city');
var cardShowHide = $('#cardshowhide');
var cityCurrent = $('#cityname');
var searchCity = $('#searchcityname');
var date = $('#date');
var weatherIcon = $('#weathericon');
var temp = $('#temp');
var wind = $('#wind');
var humidity = $('#humidity');
var latitude;
var longitude;
var perDay = new Object();
var eachFutureDayForecast = $('#eachfuturedayforecast');
var cityNamesArray = [];


/* Search button click event */
$('#search').click(function (e) {
    e.preventDefault();
    currentWeather(cityName.val());
});

/* Function to get current day's weather for the entered city name */
function currentWeather(cityname){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=c75448beb04f6b5c8390f36f01f5e846&units=imperial`)
        .then(function (response) {
            if (!response.ok) {
                alert("Please enter a valid city name.");
            }
            return response.json();
        })
        .then(function (data) {
            cardShowHide.show();
            latitude = data["coord"]["lat"];
            longitude = data["coord"]["lon"];
            cityCurrent.text(cityname);
            date.text("(" + dayjs().format('DD/MM/YYYY') + ")");
            var iconid = data["weather"][0]["icon"];
            var iconlink = `http://openweathermap.org/img/w/${iconid}.png`;
            weatherIcon.attr('src', iconlink);
            temp.text("Temp: " + data["main"]["temp"] + "\u00B0" + "F");
            wind.text("Wind: " + data["wind"]["speed"] + " MPH");
            humidity.text("Humidity: " + data["main"]["humidity"] + " %");  
            fivedayweather(latitude, longitude);
            if ($('#'+cityname).length == 0) {
                searchCity.append("<button id="+cityname+">"+cityname+"</button>");
            }
            cityNamesArray.push(cityname);
            localStorage.setItem("cities", JSON.stringify(cityNamesArray));
        })
        .catch(function (err) {
            console.error(err);
        });
}

/* Function to get current city's 5 day weather forecast data */
function fivedayweather(lat,lon){
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=c75448beb04f6b5c8390f36f01f5e846&units=imperial`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var currentHour = dayjs().format("HH");
            var fiveDayWeatherForecast = [];
            for(var i = 0; i < data["list"].length; i++){
                var timeHMS = data["list"][i]["dt_txt"].split(" ")[1];
                var timeH = timeHMS.split(":")[0];
                if((parseInt(currentHour) >= parseInt(timeH)) && (parseInt(currentHour) < parseInt(timeH)+3)){
                    var iconidVal = data["list"][i]["weather"][0]["icon"];
                    var dateformatted = data["list"][i]["dt_txt"].split(" ")[0];
                    dateformatted = dateformatted.split("-").reverse().join("/");
                    perDay = {
                        date: dateformatted,
                        icon: `http://openweathermap.org/img/w/${iconidVal}.png`,
                        temp: data["list"][i]["main"]["temp"]+ "\u00B0" + "F",
                        wind: data["list"][i]["wind"]["speed"] + " MPH",
                        humidity: data["list"][i]["main"]["humidity"] + " %"
                    }
                    fiveDayWeatherForecast.push(perDay);
                }
            }
            displayFiveDayWeather(fiveDayWeatherForecast);
            fiveDayWeatherForecast.length = 0;
        })
        .catch(function (err) {
            console.error(err);
        });
}

/* Function that displays the data for 5 day weather forecast */
function displayFiveDayWeather(fivadaydata){
    eachFutureDayForecast.empty();

    for(var i = 0; i < fivadaydata.length; i++){
        eachFutureDayForecast.append('<div class="col-sm col-6"><div class="card stylingcard"><p>'+fivadaydata[i].date+
        '</p><p><img src='+fivadaydata[i].icon+
        '></p><p>Temp: '+fivadaydata[i].temp+
        '</p><p>Wind: '+fivadaydata[i].wind+
        '</p><p>Humidity: '+fivadaydata[i].humidity+'</p></div></div>');
    }       
}

/* Button click events for the search history cities */
document.addEventListener("click", function(e){  
    var cities = [];
    cities = JSON.parse(localStorage.getItem("cities"));
    for(var i = 0; i < cities.length; i++){
        if(e.target.id === cities[i]){
            currentWeather(cities[i]);
        }
    } 
})





