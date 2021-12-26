const express = require("express");
const { getLocation } = require("./apis/city");
const { getWeather } = require("./apis/weather");
const { foodItems } = require("./foodItems");
const app = express();

app.use(express.json());

app.get("/weather/details", async (req, res) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  try {
    const locationResponse = await getLocation({ latitude, longitude });
    if (locationResponse.error) {
      throw new Error(locationResponse.error);
    }
    const city = locationResponse.city.toString();
    const weatherResponse = await getWeather(city);
    if (weatherResponse.error) {
      throw new Error(weatherResponse.error);
    }
    res.send({ ...weatherResponse.data, city });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/food/list", async (req, res) => {
  try {
    const weather = req.query.weather.toString();
    const allowedWeathers = ["sunny", "cold", "rainy"];
    if (allowedWeathers.includes(weather)) {
      res.send(foodItems[weather]);
    } else {
      throw new Error("Food details for given weather not available!");
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
