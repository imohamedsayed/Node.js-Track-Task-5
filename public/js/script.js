const form = document.querySelector("form");
const err = document.querySelector(".search .address-error");
const loc = document.querySelector(".search .location-info");
const lat_lng = document.querySelector(".search .lat-lng");
const weatherInfo = document.querySelector(".search .weather-info");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const address = form.address.value;
  fetch_weather(address);
});

const fetch_weather = async (address) => {
  const res = await fetch("http://localhost:3000/forecast?address=" + address);
  const data = await res.json();

  if (data.errors) {
    err.innerHTML = data.errors;

    loc.innerHTML = "";
    weatherInfo.innerHTML = "";
    lat_lng.innerHTML = "";
  } else {
    const { location, temp, weather, latitude, longitude } = data;
    err.innerHTML = "";
    loc.innerHTML = `${location} `;
    setTimeout(() => {
      lat_lng.innerHTML = `${latitude}, ${longitude}`;
    }, 500);
    setTimeout(() => {
      weatherInfo.innerHTML = `<img src=${weather.icon} /><span>${weather.text}   ${temp}<sup>o</sup> </span>`;
    }, 1000);
  }

  console.log(data);
};
