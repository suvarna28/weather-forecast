var cityName = $('#city');
var cardShowHide = $('#cardshowhide');
var city = $('#cityname');
var date = $('#date');
var weatherIcon = $('#weathericon');
var temp = $('#temp');
var wind = $('#wind');
var humidity = $('#humidity');
var latitude;
var longitude;
var fiveDayWeatherForecast = [];
var perDay = new Object();
var eachFutureDayForecast = $('#eachfuturedayforecast');

$('#search').click(function (e) {
    e.preventDefault();
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName.val()}&appid=c75448beb04f6b5c8390f36f01f5e846&units=imperial`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            cardShowHide.show();
            latitude = data["coord"]["lon"];
            longitude = data["coord"]["lat"];
            city.text(cityName.val());
            date.text("(" + dayjs().format('DD/MM/YYYY') + ")");
            var iconid = data["weather"][0]["icon"];
            var iconlink = `http://openweathermap.org/img/w/${iconid}.png`;
            weatherIcon.attr('src', iconlink);
            temp.text("Temp: " + data["main"]["temp"] + "\u00B0" + "F");
            wind.text("Wind: " + data["wind"]["speed"] + " MPH");
            humidity.text("Humidity: " + data["main"]["humidity"] + " %");  
            fivedayweather(latitude, longitude);
        })
        .catch(function (err) {
            console.error(err);
        });
});

function fivedayweather(lat,lon){
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=c75448beb04f6b5c8390f36f01f5e846`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var currentHour = dayjs().format("HH");
            for(var i = 0; i < data["list"].length; i++){
                var timeHMS = data["list"][i]["dt_txt"].split(" ")[1];
                var timeH = timeHMS.split(":")[0];
                if((parseInt(currentHour) >= parseInt(timeH)) && (parseInt(currentHour) < parseInt(timeH)+3)){
                    var iconidVal = data["list"][i]["weather"][0]["icon"];
                    console.log("Temp : " + data["list"][i]["main"]["temp"]);
                    perDay = {
                        date: data["list"][i]["dt_txt"].split(" ")[0],
                        icon: `http://openweathermap.org/img/w/${iconidVal}.png`,
                        temp: data["list"][i]["main"]["temp"],
                        wind: data["list"][i]["wind"]["speed"],
                        humidity: data["list"][i]["main"]["humidity"]
                    }
                    fiveDayWeatherForecast.push(perDay);
                }
            }
            displayFiveDayWeather();
        })
        .catch(function (err) {
            console.error(err);
        });
}

function displayFiveDayWeather(){
    for(var i = 0; i < fiveDayWeatherForecast.length; i++){
       eachFutureDayForecast.append('<div class="col cardgap"><p>'+fiveDayWeatherForecast[i].date+
       '</p><img src='+fiveDayWeatherForecast[i].icon+
       '><p>'+fiveDayWeatherForecast[i].temp+
       '</p><p>'+fiveDayWeatherForecast[i].wind+
       '</p><p>'+fiveDayWeatherForecast[i].humidity+'</p></div>');
    }
}


