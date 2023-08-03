const express = require("express");
const path = require("path");
const hbs = require("hbs");

const app = express();

app.listen(process.env.PORT || 3000, () => {
  console.log("App is listening ...");
});

// Register Statics
app.use(express.static("public"));

// Register template engine, views and partials
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./template/views"));

hbs.registerPartials(path.join(__dirname, "./template/partials"));

/*
    -->> end points
*/
const { getGeocode } = require("./helpers/geocode");
const { getWeather } = require("./helpers/weather");

let d = new Date();
let todayDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

app.get("/", (req, res) => {
  res.render("index", {
    title: "Home Page",
    img: "illustration1.svg",
  });
});

app.get("/weather", (req, res) => {
  res.render("check_weather", {
    title: "Weather",
    location: {
      city: "Assiut",
      country: "Egypt",
    },
    lat: 25.002,
    lat: 31.252,
    weather: {
      icon: "partial-cloudy.png",
      temp: 21,
    },
    date: todayDate,
  });
});

app.get("/forecast", (req, res) => {
  const { address } = req.query;

  if (!address) {
    res.send({ errors: "You must provide an address" });
  } else {
    getGeocode(address, (err, data) => {
      if (err) {
        res.send({ errors: err });
      } else {
        const { lng, lat } = data;
        getWeather(lat, lng, (err, data) => {
          if (err) {
            res.send({ errors: err });
          } else {
            res.send({
              longitude: lng,
              latitude: lat,
              location: data.location,
              weather: data.weather,
              temp: data.temp,
            });
          }
        });
      }
    });
  }
});

app.get("*", (req, res) => {
  res.status(404).render("not_found", {
    title: "404 | Not Found",
  });
});
