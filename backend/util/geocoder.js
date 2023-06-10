const config = require("../config");

const getLocationData = async ({ address, city, state }) => {
  const response = await fetch(
    `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
      address + " " + city
    )}&limit=1&apiKey=${config.here.apiKey}`,
    {
      method: "GET",
    }
  );

  //returns an array of items length of 1
  const data = await response.json();

  return data.items[0];
};

//takes in the return value of getLocationData
const getlatitudeAndLongitude = ({ position: { lat, lng } }) => [lat, lng];

module.exports = { getLocationData, getlatitudeAndLongitude };
