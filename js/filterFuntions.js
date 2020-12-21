const filterByUserInputElement = document.getElementById('search');
const filterByContinentElement = document.getElementById('filter');

const borderFilter = (alpha3CodeValue) => {
  for (let i = 0; i < fullListOfCountries.length; i++) {
    if (fullListOfCountries[i].alpha3Code === alpha3CodeValue) {
      return fullListOfCountries[i];
    }
  }
};

const resetFilter = () => {
  for (let i = 0; i < fullListOfCountries.length; i++) {
    cardSectionElement.children[i].style.display = '';
  }
};

const inputFilter = (inputValue) => {
  for (let i = 0; i < fullListOfCountries.length; i++) {
    if (
      fullListOfCountries[i].name
        .toLowerCase()
        .includes(inputValue.toLowerCase())
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

const filterByUserInputHandler = (value) => {
  return value !== '' ? inputFilter(value) : resetFilter();
};

const filterByContinentHandler = (value = false) => {
  return value ? regionFilter(value) : resetFilter();
};

filterByUserInputElement.addEventListener('keyup', (event) => {
  filterByUserInputHandler(event.target.value.toLowerCase());
});

filterByContinentElement.addEventListener('change', (event) => {
  switch (event.target.value) {
    case 'ALL':
      filterByContinentHandler();
      break;
    case 'AF':
      filterByContinentHandler('Africa');
      break;
    case 'AM':
      filterByContinentHandler('Americas');
      break;
    case 'AS':
      filterByContinentHandler('Asia');
      break;
    case 'EU':
      filterByContinentHandler('Europe');
      break;
    case 'OC':
      filterByContinentHandler('Oceania');
      break;
  }
});
