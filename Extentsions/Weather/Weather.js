import { fetchWeatherApi } from "openmeteo";

/*   
returned object format
   {
	"hourly": {
		"time": [
			"2025-11-28T00:00:00.000Z",
			"2025-11-28T01:00:00.000Z",
			"2025-11-28T02:00:00.000Z",
      .
      .
      .

		],
		"temperature_2m": {
			"0": 54,
			"1": 53,
			"2": 54,
			"3": 54,
      .
      .
      .
		},
		"rain": {
			"0": 0,
			"1": 0,
			"2": 0,
			"3": 0,
      .
      .
      .
		}
	},
	"daily": {
		"time": [
			"2025-11-28T00:00:00.000Z"
		],
		"temperature_2m_max": 64,
		"temperature_2m_min": 51,
		"sunrise": [
			"2025-11-28T06:38:04.000Z"
		],
		"sunset": [
			"2025-11-28T16:45:16.000Z"
		]
	}
}  */
async function Weather() {
  const params = {
    latitude: 33.763726,
    longitude: -118.383093,
    daily: ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset"],
    hourly: ["temperature_2m", "rain"],
    timezone: "America/Los_Angeles",
    forecast_days: 1,
    temperature_unit: "fahrenheit",
    precipitation_unit: "inch",
  };
  try {
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    const response = responses[0];

    // ------ the API returns a serialized binary, have to use its own
    // ------ methods to extract the data
    // ------ https://open-meteo.com/en/docs

    // Attributes for timezone and location
    const latitude = response.latitude();
    const longitude = response.longitude();
    const elevation = response.elevation();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    console.log(
      `\nCoordinates: ${latitude}°N ${longitude}°E`,
      `\nElevation: ${elevation}m asl`,
      `\nTimezone: ${timezone} ${timezoneAbbreviation}`,
      `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`
    );

    const hourly = response.hourly();
    const daily = response.daily();

    // Define Int64 variables so they can be processed accordingly
    const sunrise = daily.variables(2);
    const sunset = daily.variables(3);
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Add 1 because months are 0-indexed
    const day = currentDate.getDate();
    const formattedDate = `${day}/${month}/${year}`; // Example: "28/11/2025"
    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      hourly: {
        time: Array.from(
          {
            length:
              (Number(hourly.timeEnd()) - Number(hourly.time())) /
              hourly.interval(),
          },
          (_, i) =>
            new Date(
              (Number(hourly.time()) +
                i * hourly.interval() +
                utcOffsetSeconds) *
                1000
            )
        ),
        temperature_2m: Int16Array.from(hourly.variables(0).valuesArray()),
        rain: Int16Array.from(hourly.variables(1).valuesArray()),
      },
      daily: {
        time: formattedDate,
        temperature_2m_max: Math.round(daily.variables(0).valuesArray()[0]),
        temperature_2m_min: Math.round(daily.variables(1).valuesArray()[0]),
        // Map Int64 values to according structure
        sunrise: [...Array(sunrise.valuesInt64Length())].map(
          (_, i) =>
            new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
        ),
        // Map Int64 values to according structure
        sunset: [...Array(sunset.valuesInt64Length())].map(
          (_, i) =>
            new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
        ),
      },
    };

    // The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information
    //console.log("\nHourly data:\n", weatherData.hourly);
    //console.log("\nDaily data:\n", weatherData.daily);

    return weatherData;
  } catch (e) {
    console.log("error in weather function", e);
    return e;
  }
}

export default Weather;
