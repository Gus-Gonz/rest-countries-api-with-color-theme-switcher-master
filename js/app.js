const cardTemplateElement = document.getElementById('single-card');
const cardSectionElement = document.getElementById('country-tab-section');
const detailsOfCountrySectionElement = document.getElementById(
  'details-of-country'
);

const filterByUserInputElement = document.getElementById('search');
const filterByContinentElement = document.getElementById('filter');

let fullListOfCountries;

const sendHttpRequest = (method, url, data) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.responseType = 'json';

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject(new Error('Something went wrong!'));
      }

      //   const listOfPosts = JSON.parse(xhr.response);
    };

    xhr.onerror = function () {
      reject(new Error('Failed to sedn request!!'));
    };

    xhr.send(JSON.stringify(data));
  });

  return promise;
};

const createTabFromTemplate = (country) => {
  const template = document.importNode(cardTemplateElement.content, true);

  //changing img tab

  const imgTab = template.querySelector('img');
  imgTab.src = country.flag;
  imgTab.alt = `Flag of ${country.name}`;

  //changing h4 tab

  const h4Tab = template.querySelector('h4');
  h4Tab.textContent = ` ${country.name}`;

  //changing details

  const ulTab = template.querySelector('ul');
  ulTab.querySelector(
    '#population'
  ).textContent = `Population: ${country.population}`;
  ulTab.querySelector('#region').textContent = `Region: ${country.region}`;
  ulTab.querySelector('#capital').textContent = `Capital: ${country.capital}`;

  //pushing the template updated into the DOM

  cardSectionElement.appendChild(template);

  // cardSectionElement.lastElementChild.addEventListener('click', () => {
  //   console.log('clicked!!');
  //   showDetailsOfCountrySectionHandler(country);
  // });
};

const showDetailsOfCountrySectionHandler = (country) => {
  const divWrapperElement = document.createElement('div');

  //Some elements inside of county are array so map is needed

  const turnArrayIntoStr = (array) => {
    console.log(array);
    return array.map((eachElement) => {
      return eachElement.name;
    });
  };

  //Creating the all element with innerHTML

  divWrapperElement.innerHTML = `
    <div>
      <button><i class="fas fa-arrow-left"></i>Back</button>
    </div>
    <div>
      <img src="${country.flag}" alt="Flag of ${country.name}">
      <div class="more-details-wrapper">
        <h4>${country.name}</h4>
        <div class="more-details">
          <ul>
            <li>Native Name: ${country.nativeName}</li>
            <li>Population: ${country.population}</li>
            <li>Region: ${country.region}</li>
            <li>Sub Region: ${country.subregion}</li>
            <li>Capital: ${country.capital}</li>
          </ul>
          <ul>
            <li>Top Level Domain: ${country.topLevelDomain.join(' , ')}</li>
            <li>Currency: ${turnArrayIntoStr(country.currencies).join(
              ', '
            )}</li>
            <li>Languages: ${turnArrayIntoStr(country.languages).join(
              ', '
            )}</li>
          </ul>
        </div>
        <div class="border">
        </div>
      </div>
    </div>
    `;
  // REMEBER TO ADD THE BORDER BUTTONS AS WELL

  detailsOfCountrySectionElement.appendChild(divWrapperElement);
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
  console.log(event.target.value.toLowerCase());
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

sendHttpRequest('GET', 'https://restcountries.eu/rest/v2/all')
  .then(
    (countries) => {
      fullListOfCountries = countries;
      return fullListOfCountries;
    },
    (error) => console.log(error)
  )
  .then((countries) => {
    // createTabFromTemplate(countries[21]);
    // 21 is belgan
    countries.forEach((country) => {
      createTabFromTemplate(country);
    }),
      (error) => console.log(error);
  });

// crear una fiuncion filter para ser usada con los imput y con los botones de paises fronterizos
