//find in html
const weather = document.getElementById('weather');

//get location
//https://gist.github.com/varmais/74586ec1854fe288d393
var getPosition = function (options) {
	return new Promise(function (resolve, reject) {
	  navigator.geolocation.getCurrentPosition(resolve, reject, options);
	});
}

let lat;
let long;
let timezone;
//convert and save position info
function positionToLatLong(position){
	lat = position.coords.latitude;
	long = position.coords.longitude;
	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
}

//get weather from api
function getWeather(){

	// let lat = position.coords.latitude;
	// let long = position.coords.longitude;
	// let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
	let todayIcon = convertWeatherCode(data.daily.weather_code[0])[1];

	let willRain = willItRain(data.hourly.rain);
	let uvMsg = calcUV(data.daily.uv_index_max[0]);

	weather.innerHTML = `
		<div>
			<div>
				<section class='min'>
					<li class='iconAndTempFlex'>
						<span class="material-symbols-outlined bigIcon">${icon}</span>
						<div>
							<p class="degree">${data.current.temperature_2m}&nbsp;${data.current_units.temperature_2m}</p>
							<p>${data.daily.temperature_2m_min[0]}&nbsp;${data.daily_units.temperature_2m_min} – ${data.daily.temperature_2m_max[0]}&nbsp;${data.daily_units.temperature_2m_max}</p>
							<div class='iconAndTempFlex'>${willRain}</div>
						</div>
					</li>
				</section>
				<section class='max'>
					<li>
						<p class='label'>Currently${cityName}</p>
						<div class='iconAndTempFlex'>
							<span class="material-symbols-outlined bigIcon">${icon}</span>
							<div>
								<p class="degree">${data.current.temperature_2m}&nbsp;${data.current_units.temperature_2m}</p>
								<p>${currentWeather}</p>
								<p>Feels like ${data.current.apparent_temperature}&nbsp;${data.current_units.apparent_temperature}</p>
							</div>
						</div>
					</li>
					<li>
						<p class='label'>Today</p>
						<div class='iconAndTempFlex'>
							<span class="material-symbols-outlined bigIcon">${todayIcon}</span>
							<div>
								<p class="degree">${data.daily.temperature_2m_min[0]}&nbsp;${data.daily_units.temperature_2m_min} – ${data.daily.temperature_2m_max[0]}&nbsp;${data.daily_units.temperature_2m_max}</p>
								<p>${todayWeather}</p>
								<div class='iconAndTempFlex'>${willRain}</div>
							</div>
						</div>
					</li>
					<li>
						<p class='label'>Max UV index</p>
						<div class='iconAndTempFlex'>
							<span class="material-symbols-outlined bigIcon">heat</span>
							<div>
								<p class="degree">${data.daily.uv_index_max[0]}</p>
								<p>${uvMsg[0]}</p>
								<div class='iconAndTempFlex'>${uvMsg[2]}</div>
							</div>
						</div>
					</li>
				</section>
			</div>
			<span class="material-symbols-outlined">keyboard_arrow_down</span>
		</div>
		`
		//

		// <section id='weather-desktop'>
		// 	<li>
		// 		<p class='label'>Currently${cityName}</p>
		// 		<div class='iconAndTempFlex'>
		// 			<span class="material-symbols-outlined bigIcon">${icon}</span>
		// 			<div>
		// 				<p class="degree">${data.current.temperature_2m}&nbsp;${data.current_units.temperature_2m}</p>
		// 				<p>${currentWeather}</p>
		// 				<p>Feels like ${data.current.apparent_temperature}&nbsp;${data.current_units.apparent_temperature}</p>
		// 			</div>
		// 		</div>
		// 	</li>
		// 	<li>
		// 		<p class='label'>Today</p>
		// 		<div class='iconAndTempFlex'>
		// 			<span class="material-symbols-outlined bigIcon">${todayIcon}</span>
		// 			<div>
		// 				<p class="degree">${data.daily.temperature_2m_min[0]}&nbsp;${data.daily_units.temperature_2m_min} – ${data.daily.temperature_2m_max[0]}&nbsp;${data.daily_units.temperature_2m_max}</p>
		// 				<p>${todayWeather}</p>
		// 				<div class='iconAndTempFlex'>${willRain}</div>
		// 			</div>
		// 		</div>
		// 	</li>
		// 	<li>
		// 		<p class='label'>Max UV index</p>
		// 		<div class='iconAndTempFlex'>
		// 			<span class="material-symbols-outlined bigIcon">heat</span>
		// 			<div>
		// 				<p class="degree">${data.daily.uv_index_max[0]}</p>
		// 				<p>${uvMsg[0]}</p>
		// 				<div class='iconAndTempFlex'>${uvMsg[2]}</div>
		// 			</div>
		// 		</div>
		// 	</li>
		// </section>
		
	document.querySelector('#weather').onclick = () =>{
		document.getElementById('weather').classList.toggle('open')
	}
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
		return '<span class="material-symbols-outlined" id="rainicon">rainy</span>' + '<p>' + output + '</p>';
	} else {
		return '<span class="material-symbols-outlined" id="rainicon">block</span><p>No rain today</p>'
	}
}

function calcUV(uv){
	let level;
	let msg;
	if (uv < 3){ //1-2
		level = 'Low'
		msg = 'No protection needed. You can safely stay outside using minimal sun protection.'
		sunscreen = '<span class="material-symbols-outlined" id="rainicon">block</span><p>No protection needed</p>'
	} else if (uv < 6){ //3-5
		level = 'Moderate'
		msg = 'Protection needed. Seek shade during late morning through mid-afternoon.'
		sunscreen = '<span class="material-symbols-outlined" id="rainicon">sanitizer</span><p>Wear sunscreen</p>'
	} else if (uv < 8){ //6-7
		level = 'High'
		msg = 'Protection needed. Seek shade during late morning through mid-afternoon.'
		sunscreen = '<span class="material-symbols-outlined" id="rainicon">sanitizer</span><p>Wear sunscreen</p>'
	}else if (uv < 11){ //8-10
		level = 'Very high'
		msg = 'Extra protection needed. Be careful outside, especially during late morning through mid-afternoon.'
		sunscreen = '<span class="material-symbols-outlined" id="rainicon">sanitizer</span><p>Wear sunscreen</p>'
	} else { //11+
		level = 'Extreme!'
		msg = 'Extra protection needed. Be careful outside, especially during late morning through mid-afternoon.'
		sunscreen = '<span class="material-symbols-outlined" id="rainicon">sanitizer</span><p>Wear sunscreen</p>'
	}
	return [level,msg,sunscreen]
}


//========== on load ==========

//set sticky position
let mql = window.matchMedia("(min-width: 768px)");

function setWeatherSticky(){
	if (mql.matches){

		const ypos = document.querySelector("header").offsetHeight + ( 24 * 1.618 * 2)+5;
		// console.log(ypos);

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
function loadWeather(){
	getPosition()
	.then((position) => {
		// console.log(position);
		positionToLatLong(position);
		getCity();
	})
	.then((position) => {
		getWeather();
	})
	.catch((err) => {
		console.error(err.message);
	});
};
loadWeather();
setWeatherSticky();

//refresh weather every 10 min
let weatherTimer = setInterval(function() {
	console.log('weather refreshed');
	getWeather();
}, 600000);

//get city
let cityName = ``;
function getCity(position){

	// let lat = position.coords.latitude;
	// let long = position.coords.longitude;

	//set api url
	const key = 'pk.ff4f279b214a572b8785dddb4a1e1ded'
	const url = `https://us1.locationiq.com/v1/reverse?key=${key}&lat=${lat}&lon=${long}&format=json`

	fetch(url, {cache: 'no-store',})
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		// console.log(data.address.suburb);
		// console.log(data.address.city);
		cityName = ` in ${data.address.suburb}, ${data.address.city}`
	})
}

