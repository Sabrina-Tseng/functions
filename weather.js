//find in html
const weather = document.getElementById('weather');

//get location
//https://gist.github.com/varmais/74586ec1854fe288d393
var getPosition = function (options) {
	return new Promise(function (resolve, reject) {
	  navigator.geolocation.getCurrentPosition(resolve, reject, options);
	});
}

//get weather from api
function getWeather(position){

	let lat = position.coords.latitude;
	let long = position.coords.longitude;
	let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	//set api url
	let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,apparent_temperature,rain,weather_code&hourly=temperature_2m,rain,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max&timezone=${timezone}&forecast_days=1`
	// let url = 'https://api.open-meteo.com/v1/forecast?latitude=40.7143&longitude=-74.006&current=temperature_2m,apparent_temperature,rain,weather_code&hourly=temperature_2m,rain,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max&timezone=America%2FNew_York&forecast_days=1'

	fetch(url, {cache: 'no-store',})
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		displayWeather(data);
	})
}

function displayWeather(data){

	let currentWeather = convertWeatherCode(data.current.weather_code)[0];
	let icon = convertWeatherCode(data.current.weather_code)[1];

	let todayWeather = convertWeatherCode(data.daily.weather_code[0])[0];
	let willRain = willItRain(data.hourly.rain);
	let uvMsg = calcUV(data.daily.uv_index_max[0]);

	weather.innerHTML = `
		<li>
			<p>Currently</p>
			<span class="material-symbols-outlined">${icon}</span>
			<p>${currentWeather}</p>
			<p>${data.current.temperature_2m} ${data.current_units.temperature_2m}</p>
			<p>Feels like</p>
			<p>${data.current.apparent_temperature} ${data.current_units.apparent_temperature}</p>
		</li>
		<li>
			<p>Today</p>
			<p>${todayWeather}</p>
			<p>${data.daily.temperature_2m_min[0]} ${data.daily_units.temperature_2m_min} – ${data.daily.temperature_2m_max[0]} ${data.daily_units.temperature_2m_max}</p>
			<p>${willRain}</p>
		</li>
		<li>
			<p>Max UV index</p>
			<p>${data.daily.uv_index_max[0]}</p>
			<p>${uvMsg[0]}</p>
			<p>${uvMsg[1]}</p>
		</li>
	`
}

function convertWeatherCode(code){
	let currentWeather;
	let icon;
	switch (code) {
		case 0: 
			currentWeather = 'Clear sky';
			icon = 'sunny';
			break;
		case 1:
			currentWeather = 'Mainly clear';
			icon = 'sunny';
			break;
		case 2:
			currentWeather = 'Partly cloudy';
			icon = 'cloud';
			break;
		case 3:
			currentWeather = 'Overcast';
			icon = 'cloud';
			break;
		case 45:
		case 48:
			currentWeather = 'Fog';
			icon = 'foggy';
			break;
		case 51:
		case 53:
		case 55:
			currentWeather = 'Drizzle';
			icon = 'rainy';
			break;
		case 56:
		case 57:
			currentWeather = 'Freezing drizzle';
			icon = 'weather_hail';
			break;
		case 61:
		case 63:
		case 65:
			currentWeather = 'Rainy';
			icon = 'rainy';
			break;
		case 66:
		case 67:
			currentWeather = 'Freezing Rain';
			icon = 'weather_hail';
			break;
		case 71:
		case 73:
		case 75:
		case 77:
			currentWeather = 'Snow fall';
			icon = 'ac_unit';
			break;
		case 80:
		case 81:
		case 82:
			currentWeather = 'Rain showers';
			icon = 'rainy_heavy';
			break;
		case 85:
		case 86:
			currentWeather = 'Snow showers';
			icon = 'severe_cold';
			break;
	}
	return [currentWeather, icon];
}

function willItRain(array){

	let rainyHour = [];

	for (let i in array) {
		if (array[i] != 0){
			rainyHour.push(i)
		}
	}
	//********** why need pop! **************************************************
	rainyHour.pop();
	// console.log(rainyHour);
	// console.log(rainyHour.length);

	//if it will rain, export the hour
	if (rainyHour.length > 0){
		
		let output = 'It will rain on '
		rainyHour.forEach(hour => {
			if (hour > 12){
				hour -= 12;
				hour += 'pm '
			} else if (hour == 12){
				hour = '12pm '
			} else {
				hour += 'am '
			}
			output += hour
		});
		return output
	} else {
		return 'No rain today'
	}
}

function calcUV(uv){
	let level;
	let msg;
	if (uv <= 2){
		level = 'Low'
		msg = 'No protection needed. You can safely stay outside using minimal sun protection.'
	} else if (uv <= 5){
		level = 'Moderate'
		msg = 'Protection needed. Seek shade during late morning through mid-afternoon.'
	} else if (uv <= 7){
		level = 'High'
		msg = 'Protection needed. Seek shade during late morning through mid-afternoon.'
	}else if (uv <= 10){
		level = 'Very high'
		msg = 'Extra protection needed. Be careful outside, especially during late morning through mid-afternoon.'
	} else {
		level = 'Extreme!'
		msg = 'Extra protection needed. Be careful outside, especially during late morning through mid-afternoon.'
	}
	return [level,msg]
}


//========== on load ==========

//set sticky position
let mql = window.matchMedia("(min-width: 768px)");

function setWeatherSticky(){
	if (mql.matches){

		const ypos = document.querySelector("header").offsetHeight + ( 24 * 1.618 * 2)+5;
		console.log(ypos);

		weather.style.position = "sticky";
		weather.style.top = ypos + "px";
	} else {
		weather.style.position = "static";
	}
}
mql.addEventListener("change", function() {
	setWeatherSticky();
});

//wait for the position before loading weather
function refreshWeather(){
	getPosition()
	.then((position) => {
		console.log(position);
		getWeather(position);
	})
	.catch((err) => {
		console.error(err.message);
	});
};
refreshWeather();
setWeatherSticky();

//refresh weather every 10 min
let weatherTimer = setInterval(function() {
	console.log('weather refreshed');
	refreshWeather();
}, 600000);