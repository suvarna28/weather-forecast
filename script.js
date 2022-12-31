var cityName = $('#city');


$('#search').click(function (e) {
    e.preventDefault();
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName.val()}&appid=c75448beb04f6b5c8390f36f01f5e846`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("Data Lon: " + data["coord"]["lon"]);
            console.log("Data Lat: " + data["coord"]["lat"]);
        })
        .catch(function (err) {
            console.error(err);
        });
});


