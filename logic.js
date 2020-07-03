console.log("javascript loaded");

$(document).ready(function () 
{
    
    //creates the cityList array if it is not already created
    var storageList = localStorage.getItem("cityList")
    if (storageList){cityList = JSON.parse(storageList)} 
    else{cityList = []}
    var lat = "";
    var lon = "";
    //application ID for openweather API
    var wappid = "f4308ec2f06a34c74a83e3073f7c880b"
    
    //when search button is click on main page
    $('#searchCity').click(function (event) 
    {
        event.preventDefault();    

        //create the city variable
        var city = $('#city').val();    

        //add city to cityList array
        cityList.push(city);
        
        //create cityList in local storage
        localStorage.setItem("cityList", JSON.stringify(cityList));

        //call display cities with current city added to the list
        displayCities(cityList);
      

        if (city != '') 
        {


                    //weather data/current conditions call
            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=imperial" + "&appid="+wappid,
                type: "GET",})
                .then(function (response) 
                {
                    lat = response.coord.lat;
                    lon = response.coord.lon;

                    var cicon = response.weather[0].icon;                 
                    var currentIcon = "https://openweathermap.org/img/w/" + cicon + ".png";

                    console.log("lat " + lat);
                    console.log("lon " + lon);

                    var display = displayCurrent(response);
                    $("#cConditions").html(display);
                    $('#currentWind').text("Wind Speed: " + response.wind.speed + " MPH");
                    $('#currentHum').text("Humidity: " + response.main.humidity + "%");
                    $('#currentTemp').text("Temperature: " + response.main.temp + " ˚F");
                

                    //get and display UV index
           $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/uvi?appid=' +wappid + "&lat=" + lat + "&lon=" + lon,
                type: "GET",})
                .then(function (response) 
                {
                    var uvIndex = response.value;
                    $('#uvIndex').text("UV Index: " + uvIndex);           
                });
        }); 

        //forcast call
        $.ajax(
        {
            url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + "&units=imperial" + "&appid="+wappid,
            type: "GET",})
            .then(function (response) 
            {
                var forecastDisplay = displayForcast(response)
            });

        } 
        else {$('#error').html('Enter a city name:');}
    });

           

    //displays list of cities under search bar
    function displayCities(cityList) 
    {
        $('.city-list').empty();

        var list = localStorage.getItem("cityList");
        cityList = (JSON.parse(list));
        

        //loop through the list of entered cities
        if (list) 
        {
            for (var i = 0; i < cityList.length; i++) 
            {

                //still trying to work out how to make the cities into buttons that can be click to dispaly the results again
                
                var container = $("<div class=col-sm-2 id=searchCity></div>").text(cityList[i]);

               
               $('.city-list').prepend(container);
            }
        }
    }

//WEATHER RESULTS DISPLAYS

    //displays forcast for today's date
    function displayCurrent(data) 
    {
        //creates link icon for current conditions
        var cicon = data.weather[0].icon;                 
        var currentIcon = "https://openweathermap.org/img/w/" + cicon + ".png";
                    

        return "<h2>" + data.name 
                      + moment().format(' (MM/DD/YYYY)') 
                      + "</h2>"
                      +`<p><img src=${currentIcon} /></p>
                       `
    }

   
    //gets UV data using lat and long from ajax call
 //   function showUV(data) 
 //   {
      
      
 //   }
 
    //5-Day forcast creation and display, data from forcast ajax call
    function displayForcast(data) 
    {
        //puts the data from the ajax call into a variable
        var forecast = data.list; 

        //creates and displays array of forcast icons, created new each time
        var fivedayForcast = [];

        for (var i = 0; i < forecast.length; i++) 
        {
            //variable to store info from call looped through
            var forcastInfo = forecast[i];

            //gets time separate from the data
            var split_time = forcastInfo.dt_txt.split(' ')[1]; 

            //creates the card with info
            if (split_time === "12:00:00") 
            {
                //sets variable for all info
                var main = forcastInfo.main;

                //set each piece of data to variable
                var temp = main.temp; 
                var humidity = main.humidity;
                var date = moment(forcastInfo.dt_txt).format('l');
                var icon = forcastInfo.weather[0].icon;
                var iconurl = "https://openweathermap.org/img/w/" + icon + ".png";

                var dayDisplay = `<div class="col-sm currentCondition">
                                        <div class="card">
                                            <div class="card-body">
                                              <p><strong>${date}</strong></p>
                                              <div><img src=${iconurl} /></div>
                                              <p>Temp: ${temp} °F</p>
                                              <p>Humidity: ${humidity}%</p>
                                            </div>
                                        </div> 
                                    </div>`;
                fivedayForcast.push(dayDisplay);
            }

        }
            //update HTML
        $("#5-day-forecast").html(fivedayForcast.join(''));
    }
  
});


