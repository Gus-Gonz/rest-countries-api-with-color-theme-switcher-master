const filterByUserInputElement = document.getElementById('search');
const filterByContinentElement = document.getElementById('filter');

let activeContinentFilter;

const borderFilter = (alpha3CodeValue) => {
  for (let i = 0; i < fullListOfCountries.length; i++) {
    if (fullListOfCountries[i].alpha3Code === alpha3CodeValue) {
      return { info: fullListOfCountries[i], index: i };
    }
  }
};

const resetFilter = () => {
  for (let i = 0; i < fullListOfCountries.length; i++) {
    cardSectionElement.children[i].style.display = '';
  }
};

const inputFilter = (inputValue, continentFilter) => {
  for (let i = 0; i < fullListOfCountries.length; i++) {
    if (
      (fullListOfCountries[i].name
        .toLowerCase()
        .includes(inputValue.toLowerCase()) &&
        fullListOfCountries[i].region === continentFilter) ||
      (fullListOfCountries[i].name
        .toLowerCase()
        .includes(inputValue.toLowerCase()) &&
        !continentFilter)
    ) {
      cardSectionElement.children[i].style.display = '';
    } else {
      cardSectionElement.children[i].style.display = 'none';
    }
  }
};

const regionFilter = (regionValue) => {
  for (let i = 0; i < fullListOfCountries.length; i++) {
    if (fullListOfCountries[i].region === regionValue) {
      cardSectionElement.children[i].style.display = '';
    } else {
      cardSectionElement.children[i].style.display = 'none';
    }
  }
};

const filterByUserInputHandler = (value, activeContinentFilter) => {
  return value !== '' ? inputFilter(value, activeContinentFilter) : null;
};

const filterByContinentHandler = (value) => {
  filterByUserInputElement.value = '';
  return value ? regionFilter(value) : resetFilter();
};

filterByUserInputElement.addEventListener('keyup', (event) => {
  filterByUserInputHandler(
    event.target.value.toLowerCase(),
    activeContinentFilter
  );
});

filterByContinentElement.addEventListener('change', (event) => {
  activeContinentFilter =
    event.target.value !== '' ? event.target.value : undefined;

  filterByContinentHandler(activeContinentFilter);
});
