const modal = document.querySelector('.modal');
const closeBtn = document.querySelector('.close-btn');
const locBtn = document.querySelector('.content__btn');
const form = document.querySelector('#modal-form');
const mainContent = document.querySelector('.content__data');


// DOMCONTENT EventListener
document.addEventListener('DOMContentLoaded', function () {
    const location = getSavedLocation();
    const state = location.state;
    const city = location.city; 
    getWeather(state, city);
});

// form event
form.addEventListener('submit', getLocation);

// close modal
closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';
});

// open modal
locBtn.addEventListener('click', function () {
    modal.style.display = 'block';
});

// get weather data from API
function getWeather(state, city) {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${state},${city}%27&appid=802d52be1a7bd07808a4258f14da2563`)
        .then(res => res.json())
        .then(data => {
            displayWeatherData(data);
        }).catch(err => {
            console.log(err);
        });
}

// Get location from input
function getLocation(e) {
    const state = document.querySelector('#state').value;
    const city = document.querySelector('#city').value;
    const loc = {
        state: state,
        city: city
    }

    if (state === '' || city === '') {
        console.log('Fill all fields');
    } else {
        saveToLs(loc);
        getWeather(state, city);
        modal.style.display = 'none';
        document.querySelector('#state').value = '';
        document.querySelector('#city').value = '';
    }
    e.preventDefault();
}

// display weather data
function displayWeatherData(data) {
    const location = getSavedLocation();
    const city = location.city;
    let html = `
        <h1 class="country primary-heading">${data.sys.country}</h1>
            <h2 class="state secondary-heading">${data.name}, <span class="city">${capitalize(city)}</span></h2>
            <h3 class="description">${data.weather[0].description}</h3>
            <h4 class="temp">${data.main.temp} &#x2109 (<span class="celc">${calcCels(data.main.temp)}</span> &#x2103)</h4>
            <img src="./icons/${data.weather[0].icon}.png" alt="" class="content__icon">
            <div class="content__base">
                <p class="relative-humidity">Relative Humidity: ${data.main.humidity}%</p>
                <p class="feels-like">Feels like: ${data.main.feels_like} &#x2109 (<span class="celc">${calcCels(data.main.feels_like)}</span> &#x2103)</h4></p>
                <p class="wind">Winds: From ${data.wind.deg}&#176 at ${data.wind.speed}MPH</p>
                <!-- Convert sunset and sunrise to time -->
                <p class="sunrise">Sunrise: ${convertTime(data.sys.sunrise)}</p>
                <p class="sunset">Sunset: ${convertTime(data.sys.sunset)}</p>
            </div>
        `;
    mainContent.innerHTML = html;
}

// calculate F to celsius
function calcCels(fh) {
    return ((fh - 32) * 5 / 9).toFixed(2);
}

// capitalize text
function capitalize(text) {
    return text.slice(0, 1).toUpperCase() + text.slice(1);
}

// convert Time
function convertTime(expectedTime) {
    const now = new Date();
    const diff = now - expectedTime;

     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
     const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    const amPm = hours > 12 ? 'PM' : 'AM';
    return `${hours}:${mins}:${secs} ${amPm}`;
}


// save location to local storage
function saveToLs(loc) {
    let location = getSavedLocation();
    location = loc;
    localStorage.setItem('location', JSON.stringify(location));
}

// get saved location
function getSavedLocation() {
    let location;
    if (localStorage.getItem('location') === null) {
        location = {};
    } else {
        location = JSON.parse(localStorage.getItem('location'));
    }
    return location;
}