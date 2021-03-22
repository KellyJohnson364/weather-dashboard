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
let unique


// Creates buttons for previously searched cities

let renderCities = function () {
  
 let remember = localStorage.getItem("cities");
  if (remember) {
    $('<option value="">Select City</option>').appendTo(citiesEl);
    cities.unshift(remember)
    list = cities.toString().split(",");
    unique = [...new Set(list)];
  for (let i=0; i < unique.length; i++) {
    $('<option value ="'+ unique[i] +'" id=' + i + '>'+ unique[i] +'</option>').appendTo(citiesEl);
}}else {
  $('.history').hide()
  unique=cities
}
}

renderCities();
// Collects info from input, replaces buttons with "new search" button

let formSubmitHandler = function (event) {
  event.preventDefault();
  city = cityInputEl.val();
  cityInputEl.val('')
  $('.history').css('display', '')
  $('.weatherDiv').remove()
  $('.card-group').remove()
  $('.fiveDay').remove()
  if (city) {
    getWeatherInfo(city);
   
  } else {
    alert('Please enter a city name');
  };
  
}

// Event listener for city buttons.  

  $('#list').change(function() { 
    console.log(this.value)
    city = (this.value)
    console.log(city)
    $('.weatherDiv').remove()
    $('.card-group').remove()
    $('.fiveDay').remove()
    getWeatherInfo(city);
   
   
   
  })
  
  buttonEl.on('click', formSubmitHandler);

// Fetches current weather information from API

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

// Displays current weather info for specified city by creating HTML

let displayWeather = function (weather, searchTerm) {
 timeEl.text(moment().format("MMMM Do YYYY, h:mm a"))
  weatherContainerEl.append(timeEl)

  weatherEl = $('<div class="weatherDiv">');
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

  // Adds new city to local storage if it is not already in the list
    
    unique.unshift(weather.name)  
    console.log(unique)
    if(unique.length> 1) {
    for ( i = 0; i < unique.length; i++) {
      for ( k = i + 1; k < unique.length; k++) {
          if (unique[i] != unique[k]) {
           
             localStorage.setItem("cities", (unique));
          }else {
            unique.shift()
            localStorage.setItem("cities", unique)
    }}}}else {
      localStorage.setItem("cities", unique)
    }
    $(citiesEl).children().remove(); 
    getForecast()
}
// Fetches forecast and UVI information from API

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

  // Displays 5 day forecast   

  let displayForecast = function (forecast) {
   
   renderCities();

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

    titleEl=$('<h2 class="col-12 fiveDay">').text("5-Day Forecast:");
    $('main').append(titleEl);
    let forecastEl = $('<div class="card-group">')
    titleEl.append(forecastEl)
    
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

// Reset button and corresponding function ensures reset of page and prevents repeated rendering  

  


