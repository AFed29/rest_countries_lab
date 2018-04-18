document.addEventListener('DOMContentLoaded', () => {
  const url = 'http://restcountries.eu/rest/v2/all';
  makeRequest(url, requestComplete);
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

const populateList = function (countries) {
  const select = document.querySelector('#country-list');
  countries.forEach((country) => {
    const option = document.createElement('option');
    option.textContent = country.name;
    select.appendChild(option);
  })

}
