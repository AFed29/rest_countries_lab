let countriesData = [];
let selectedRegion;
let regions = [];
let subRegions = [];

document.addEventListener('DOMContentLoaded', () => {
  const url = 'http://restcountries.eu/rest/v2/all';
  makeRequest(url, requestComplete);

  const regionSelect = document.querySelector('#region-list');
  regionSelect.addEventListener('change', handleRegionChange);

  const subRegionSelect = document.querySelector('#sub-region-list');
  subRegionSelect.addEventListener('change', handleSubRegionChange);

  const countrySelect = document.querySelector('#country-list');
  countrySelect.addEventListener('change', handleCountryChange);

});

const getRegions = function () {
  const uniqueRegions = new Set();
  for (country of countriesData) {
    uniqueRegions.add(country.region);
  }
  regions = Array.from(uniqueRegions);
  populateRegionList();
}

const getSubRegions = function (region) {
  const uniqueSubRegions = new Set();
  for (country of countriesData) {
    if (region === country.region) {
      uniqueSubRegions.add(country.subregion);
    }
  }
  subRegions = Array.from(uniqueSubRegions);
  populateSubRegionList();
}

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
  countriesData = countries;
  getRegions();
}

const populateRegionList = function () {
  const select = document.querySelector('#region-list');
  regions.forEach((region) => {
    const option = document.createElement('option');
    if (region === "") {
      option.textContent = "other"
    }
    else {
      option.textContent = region;
    }
    select.appendChild(option);
  })
}

const populateSubRegionList = function () {
  const select = document.querySelector('#sub-region-list');
  select.innerHTML = "<option disabled selected>Please select a sub-region</option>"
  select.disabled = false;
  subRegions.forEach((subRegion) => {
    const option = document.createElement('option');
    if (subRegion === "") {
      option.textContent = "other"
    }
    else {
      option.textContent = subRegion;
    }
    select.appendChild(option);
  })
}

const populateCountryList = function (subRegion) {
  const select = document.querySelector('#country-list');
  select.innerHTML = "<option disabled selected>Please select a country</option>";
  select.disabled = false;
  countriesData.forEach((country) => {
    const option = document.createElement('option');
    if (selectedRegion === 'other') {
      selectedRegion = "";
    }
    if (selectedRegion === 'other') {
      selectedRegion = "";
    }
    if (subRegion === country.subregion && country.region === selectedRegion) {
      option.textContent = country.name;
      option.value = country.alpha3Code;
      select.appendChild(option);
    }
  });
}

const handleRegionChange = function (event) {
  selectedRegion = this.value;
  if (this.value === 'other') {
    populateCountryList('')
  } else {
    getSubRegions(this.value);
  }
}

const handleSubRegionChange = function (event) {
  populateCountryList(this.value);
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
