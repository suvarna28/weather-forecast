var cityName = $('#city');
var cardShowHide = $('#cardshowhide');
var city = $('#cityname');
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

$('#search').click(function (e) {
    e.preventDefault();
    currentWeather(cityName.val());
});

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
            if ($('#'+cityname).length == 0) {
                searchCity.append("<button id="+cityname+">"+cityname+"</button>");
            }
        })
        .catch(function (err) {
            console.error(err);
        });
}

function fivedayweather(lat,lon){
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=c75448beb04f6b5c8390f36f01f5e846`)
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
                    console.log("Temp : " + data["list"][i]["main"]["temp_kf"]);
                    var dateformatted = data["list"][i]["dt_txt"].split(" ")[0];
                    dateformatted = dateformatted.split("-").join("/");
                    perDay = {
                        date: dateformatted,
                        icon: `http://openweathermap.org/img/w/${iconidVal}.png`,
                        temp: data["list"][i]["main"]["temp_kf"] + "\u00B0" + "F",
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

function displayFiveDayWeather(fivadaydata){
    eachFutureDayForecast.empty();

    for(var i = 0; i < fivadaydata.length; i++){
        eachFutureDayForecast.append('<div class="col-sm col-6"><div class="card stylingcard"><p>'+fivadaydata[i].date+
        '</p><p><img src='+fivadaydata[i].icon+
        '></p><p>'+fivadaydata[i].temp+
        '</p><p>'+fivadaydata[i].wind+
        '</p><p>'+fivadaydata[i].humidity+'</p></div></div>');
    }       
}







