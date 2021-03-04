let buttonEl = $('#button');
let cityInputEl = $('#cityname');
let resultsContainerEl= $('#results-container')
let weatherContainerEl = $('#weather-container');
let timeEl = $('#now');
let citiesEl = $('#list')
let weatherEl
let city
let cities=[]
let lat
let long
let list


let renderCities = function () {
 let remember = localStorage.getItem("cities");
  if (remember) {
  cities.unshift(remember)
    list = cities.toString().split(",");
  for (let i=0; i < list.length; i++) {
    $('<div><input type="button" value ="'+ list[i] +'"class="btn button" id=' + i + '></div>').appendTo(citiesEl);
}}else {
  list=cities
}
}
renderCities();


let formSubmitHandler = function (event) {
  event.preventDefault();
  city = cityInputEl.val();
  if (city) {
    getWeatherInfo(city);
  } else {
    alert('Please enter a city name');
  }};


  $(".button").on('click', function() {
    city = $(this).attr('value')
    getWeatherInfo(city);
  })

  buttonEl.on('click', formSubmitHandler);

let getWeatherInfo = function (city) {
  let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+ city +'&appid=a44ecc08aa9edc3aa5c949e9fa36e888&units=imperial'
 
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
         displayWeather(data, city);
         })}
      else {
        alert('Error: ' + response.statusText);
    }})
  .catch(function (error) {
        alert('Unable to find weather');
  })}  

let displayWeather = function (weather, searchTerm) {
 timeEl.text(moment().format("MMMM Do YYYY, h:mm a"))
  weatherContainerEl.append(timeEl)

  weatherEl = $('<div>');
  weatherEl.classList = ' card-header card flex-row justify-center align-center';
  weatherContainerEl.append(weatherEl);

    let cityEl=$('<div>').text("City: "+ weather.name +"");   
    let iconEl=$('<span class="icon"><img height=100px src="http://openweathermap.org/img/w/'+ weather.weather[0].icon + '.png"></span>');
    let tempEl=$('<div>').text("Temperature: " + weather.main.temp + "F");
    let humidEl=$('<div>').text("Humidity: " + weather.main.humidity + "%");
    let windEl=$('<div>').text("Wind Speed: " + weather.wind.speed +"mph");
    
   weatherEl.append(cityEl,tempEl, humidEl, windEl);
   cityEl.append(iconEl)

    lat= weather.coord.lat
    long= weather.coord.lon

    console.log(cities)
    


    list.unshift(weather.name)  
    console.log(list)
    if(list.length> 1) {
    for ( i = 0; i < list.length; i++) {
      for ( k = i + 1; k < list.length; k++) {
          if (list[i] != list[k]) {
            console.log(list)
             localStorage.setItem("cities", (list));
          }else {
            list.shift()
            localStorage.setItem("cities", list)
    }}}}else {
      localStorage.setItem("cities", list)
    }
    getForecast()
}
  
  let getForecast= function () {    
   
    let forecastUrL= 'https://api.openweathermap.org/data/2.5/onecall?lat='+ lat +'&lon='+ long +'&appid=a44ecc08aa9edc3aa5c949e9fa36e888&units=imperial'
    fetch(forecastUrL)
        .then(function (answer) {
          if (answer.ok) {
            answer.json().then(function (info) {
             displayForecast(info, city);  
          })} else {
            alert('Error: ' + answer.statusText);
          }})
    .catch(function (error) {
        alert('Unable to find weather');
      })}

  let displayForecast = function (forecast, searchTerm) {
    let uvEl=$('<div>').text('UV Index: '); 
      weatherEl.append(uvEl)
    let uvI=$('<span id="uv">').text(forecast.daily[0].uvi)
      uvEl.append(uvI)
    if(forecast.daily[0].uvi<3) {
      uvI.addClass('low')
    }else if (forecast.daily[0].uvi<6) {
      uvI.addClass('moderate')
    }else if (forecast.daily[0].uvi<8) {
      uvI.addClass('high')
    }else {
      uvI.addClass('very-high')
    }

    titleEl=$('<h2>').text("5-Day Forecast:");
    resultsContainerEl.append(titleEl);
    let forecastEl = $('<div class="card-group">')
    resultsContainerEl.append(forecastEl)
    
      for (i=1; i<6; i++) {
      let fDate=(moment(forecast.daily[i].dt, "X").format("M/D/YY"))
    
    let cardEl=$('<div class="card ">')
    forecastEl.append(cardEl)
    let bodyEl=$('<div class="card-body text-center">')
    cardEl.append(bodyEl)
    dateEl=$('<p class="card-header">'+ fDate +'</p>')
    let fIcon=$('<span class="icon card-text"><img height=100px src="http://openweathermap.org/img/w/'+ forecast.daily[i].weather[0].icon + '.png"></span>')
    let fTemp=$('<p class="card-text">Temp: '+forecast.daily[i].temp.day +'F</p>')
    let fHum=$('<p class="card-text">Humidity:'+ forecast.daily[i].humidity +'%</p>')
    bodyEl.append(dateEl)
    bodyEl.append(fIcon)
    bodyEl.append(fTemp)
    bodyEl.append(fHum)
          
  }}



