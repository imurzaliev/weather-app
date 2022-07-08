import '../src/styles/main.css';

const moment = require('moment');

const icon = document.querySelector('[data-image]');
const windMetric = document.querySelector('[data-wind-metric]');
const windImperial = document.querySelector('[data-wind-imperial]');
const humidity = document.querySelector('[data-humidity]');
const pressure = document.querySelector('[data-pressure]');
const sunrise = document.querySelector('[data-sunrise]');
const sunset = document.querySelector('[data-sunset]');
const main = document.querySelector('[data-main]');
const description = document.querySelector('[data-description]');
const city = document.querySelector('[data-city]');
const temperatureMetric = document.querySelector('[data-temp-metric]');
const temperatureImperial = document.querySelector('[data-temp-imperial]');
const message = document.querySelector('[data-message]');
const metric = document.querySelector('[data-metric]');
const imperial = document.querySelector('[data-imperial]');
const timeEl = document.querySelector('[data-time]');
const dateEl = document.querySelector('[data-date]');
const dayEl = document.querySelector('[data-day]');

let defaultCity = 'Karakol';

let weather = {
  apiKey: 'ec7e40b247926254792b61c39ac1b458',
  fetchWeather: async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=${weather.apiKey}&units=metric`,
        { mode: 'cors' }
      );
      const searchData = await response.json();
      city.placeholder = `${searchData.name}, ${searchData.sys.country}`;
      message.textContent =
        'Click on city name, type city name and hit Enter to search';
      main.textContent = searchData.weather[0].main;
      description.textContent = searchData.weather[0].description;
      icon.src = `http://openweathermap.org/img/wn/${searchData.weather[0].icon}@4x.png`;
      document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${searchData.name}')`;
      const temp = searchData.main.temp;
      temperatureMetric.textContent = Math.round(temp);
      temperatureImperial.textContent = toFarenhit(temp);
      windMetric.textContent = `${searchData.wind.speed} m/h`;
      windImperial.textContent = `${mhToMph(searchData.wind.speed)} mph`;
      humidity.textContent = searchData.main.humidity;
      pressure.textContent = searchData.main.pressure;
      const timezone = searchData.timezone;
      sunrise.textContent = formatTime(searchData.sys.sunrise, timezone);
      sunset.textContent = formatTime(searchData.sys.sunset, timezone);
      renderTime(getLocalTime(timezone));
    } catch {
      message.textContent = 'City not found';
      message.classList.add('error');
    }
  },
};

weather.fetchWeather();

city.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && city.value.lenght != 0) {
    defaultCity = city.value;
    weather.fetchWeather();
    city.value = '';
  }
});

const formatTime = (value, timezone) => {
  return moment.utc(value, 'X').add(timezone, 'seconds').format('H:mm a');
};

const mhToMph = (value) => {
  return Math.round((value * 2.236936 + Number.EPSILON) * 100) / 100;
};

const toFarenhit = (value) => {
  return Math.round(value * 1.8 + 32);
};

const renderTime = (dateData) => {
  setInterval(() => {
    timeEl.textContent = moment(dateData).format('H:mm A');
    dayEl.textContent = moment(dateData).format('dddd');
    dateEl.textContent = moment(dateData).format('MMMM DD, YYYY');
  }, 1000);
};

const getLocalTime = (timezone) => {
  const d = new Date();
  const localTime = d.getTime();
  const localOffset = d.getTimezoneOffset() * 60000;
  const utc = localTime + localOffset;
  const localDate = utc + 1000 * timezone;
  return new Date(localDate);
};

// toggle between units, could have been written better
metric.addEventListener('click', () => {
  windImperial.classList.add('hidden');
  temperatureImperial.classList.add('hidden');
  windMetric.classList.remove('hidden');
  temperatureMetric.classList.remove('hidden');
  metric.classList.remove('text-accent');
  imperial.classList.add('text-accent');
});

imperial.addEventListener('click', () => {
  windMetric.classList.add('hidden');
  temperatureMetric.classList.add('hidden');
  windImperial.classList.remove('hidden');
  temperatureImperial.classList.remove('hidden');
  metric.classList.add('text-accent');
  imperial.classList.remove('text-accent');
});
