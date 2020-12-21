const cardTemplateElement = document.getElementById('single-card');
const cardSectionElement = document.getElementById('country-tab-section');
const detailsOfCountrySectionElement = document.getElementById(
  'details-of-country'
);

const userInputSectionELement = document.getElementById('user-input');

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
  imgTab.alt = `Flag of ${country.name.split('(')[0]}`;

  //changing h4 tab

  const h4Tab = template.querySelector('h4');
  h4Tab.textContent = ` ${country.name.split('(')[0]}`;

  //changing details

  const ulTab = template.querySelector('ul');
  ulTab.querySelector('#population').textContent = ` ${country.population}`;
  ulTab.querySelector('#region').textContent = ` ${country.region}`;
  ulTab.querySelector('#capital').textContent = ` ${country.capital}`;

  //pushing the template updated into the DOM

  cardSectionElement.appendChild(template);

  cardSectionElement.lastElementChild.addEventListener('click', () => {
    showDetailsOfCountrySectionHandler(country);
  });
};

const toggleElementOnBackGroud = () => {
  cardSectionElement.classList.toggle('hidden');
  userInputSectionELement.classList.toggle('hidden');
  detailsOfCountrySectionElement.classList.toggle('hidden');
  detailsOfCountrySectionElement.innerHTML = ' ';
};

const showDetailsOfCountrySectionHandler = (country, needsToUpdate = false) => {
  if (detailsOfCountrySectionElement.children.length > 0 && !needsToUpdate) {
    return;
  } else {
    if (!needsToUpdate) {
      toggleElementOnBackGroud();
    }
    detailsOfCountrySectionElement.removeChild(
      detailsOfCountrySectionElement.lastChild
    );

    const divWrapperElement = document.createElement('div');

    //Some elements inside of county are array so map is needed

    const turnArrayIntoStr = (array) => {
      return array.map((eachElement) => {
        return eachElement.name;
      });
    };

    //Creating the all element with innerHTML

    divWrapperElement.innerHTML = `
    <div class="back-button-wrapper">
    </div>
    <div class="details-of-country-wrapper">
      <img src="${country.flag}" alt="Flag of ${country.name.split('(')[0]}">
      <div class="more-details-wrapper">
        <h2>${country.name.split('(')[0]}</h2>
        <div class="more-details">
          <ul>
            <li>Native Name: <label>${country.nativeName}</label></li>
            <li>Population: <label>${country.population}</label></li>
            <li>Region: <label>${country.region}</label></li>
            <li>Sub Region: <label>${country.subregion}</label></li>
            <li>Capital: <label>${country.capital}</label></li>
          </ul>
          <ul>
            <li>Top Level Domain: <label>${country.topLevelDomain.join(
              ', '
            )}</label></li>
            <li>Currency: <label>${turnArrayIntoStr(country.currencies).join(
              ', '
            )}</label></li>
            <li>Languages: <label>${turnArrayIntoStr(country.languages).join(
              ', '
            )}</label></li>
          </ul>
        </div>
        <div class="border">
            <ul class="border-wrapper">
              <h3>Border Countries: </h3>
            </ul>
        </div>
      </div>
    </div>
    `;
    //BACK BUTTON

    let buttonElement = document.createElement('button');

    buttonElement.innerHTML = `<i class="fas fa-arrow-left"></i>Back`;
    buttonElement.className = 'button';

    // we still need the logic on the event
    buttonElement.addEventListener('click', () => {
      console.log('backButton Clicked!!');
      toggleElementOnBackGroud();
    });

    divWrapperElement
      .getElementsByClassName('back-button-wrapper')[0]
      .appendChild(buttonElement);

    // BORDER COUNTRY BUTTONS

    country.borders.forEach((eachBorder) => {
      let buttonElement = document.createElement('button');
      let countryBorderInfo = borderFilter(eachBorder);

      buttonElement.className = 'button';

      buttonElement.textContent = ` ${countryBorderInfo.name.split('(')[0]} `;

      buttonElement.addEventListener('click', () => {
        showDetailsOfCountrySectionHandler(countryBorderInfo, true);
        console.log(
          'clicked the border link ' + countryBorderInfo.name.split('(')[0]
        );
      });

      divWrapperElement
        .getElementsByClassName('border-wrapper')[0]
        .appendChild(buttonElement);
    });

    detailsOfCountrySectionElement.appendChild(divWrapperElement);
  }
};

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
