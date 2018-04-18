document.addEventListener('DOMContentLoaded', () => {
  const url = 'http://restcountries.eu/rest/v2/all';
  makeRequest(url, requestComplete);

  const select = document.querySelector('#country-list');
  select.addEventListener('change', handleCountryChange);
});

const makeRequest = function (url, callback) {
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.send();

  request.addEventListener('load', callback);
}

const requestComplete = function () {
  if (this.status !== 200) return;
  const jsonString = this.responseText;
  const countries = JSON.parse(jsonString);
  populateList(countries)
}

const countryDataReqComplete = function () {
  if (this.status !== 200) return;
  const jsonString = this.responseText;
  const country = (JSON.parse(jsonString))[0];
  populateCountryData(country);
}

const populateList = function (countries) {
  const select = document.querySelector('#country-list');
  countries.forEach((country) => {
    const option = document.createElement('option');
    option.textContent = country.name;
    select.appendChild(option);
  });
}

const handleCountryChange = function (event) {
  getCountryData(this.value);
}

getCountryData = function (countryName) {
  const url = `https://restcountries.eu/rest/v2/name/${ countryName }`
  makeRequest(url, countryDataReqComplete);
}

populateCountryData = function (country) {
  const countryDataList = document.querySelector('#selected-country-data');
  countryDataList.innerHTML = ''
  const countryData = [];

  countryData.push(country.name);
  countryData.push(country.population);
  countryData.push(country.capital);

  console.log(countryData);

  for (const data of countryData) {
    const li = document.createElement('li');
    li.textContent = data;
    countryDataList.appendChild(li);
  }
}
