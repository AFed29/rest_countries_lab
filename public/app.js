let countriesData = [];

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
  populateList(countries);
  countriesData = countries;
}

const populateList = function (countries) {
  const select = document.querySelector('#country-list');
  countries.forEach((country) => {
    const option = document.createElement('option');
    option.textContent = country.name;
    option.value = country.alpha3Code;
    select.appendChild(option);
  });
}

const handleCountryChange = function (event) {
  const country = getCountryData(this.value);
  populateCountryData(country);
  populateBorderCountries(country);
}

const getCountryData = function (alpha3Code) {
    return countriesData.find(function (country){
    return country.alpha3Code === alpha3Code;
    });
}

const populateCountryData = function (country) {
  const countryDataList = document.querySelector('#selected-country-data');
  countryDataList.innerHTML = ''
  const countryData = {};

  countryData['Country Name'] = country.name;
  countryData['Population'] = country.population;
  countryData['Capital City'] = country.capital;

  for (const key in countryData) {
    const li = document.createElement('li');
    li.textContent = `${ key }: ${countryData[key]}`;
    countryDataList.appendChild(li);
  }
}

const populateBorderCountries = function (country) {
  const borderCountriesDiv = document.querySelector('#border-countries')
  borderCountriesDiv.innerHTML = '';
  if (country.borders.length === 0) {
    const message = document.createElement('p')
    message.textContent = `No countries border ${ country.name }`;
    borderCountriesDiv.appendChild(message);
  } else {
    const h3 = document.createElement('h3');
    h3.textContent = `Countries Bordering ${ country.name }:`
    borderCountriesDiv.appendChild(h3);

    for (countryCode of country.borders) {

      const ul = document.createElement('ul');
      borderCountriesDiv.appendChild(ul);
      const countryData = {};

      const borderCountry = getCountryData(countryCode);

      countryData['Country Name'] = borderCountry.name;
      countryData['Population'] = borderCountry.population;
      countryData['Capital City'] = borderCountry.capital;

      for (const key in countryData) {
        const li = document.createElement('li');
        li.textContent = `${ key }: ${countryData[key]}`;
        ul.appendChild(li);
      }
    }
  }
}
