const cardTemplateElement = document.getElementById('single-card');
const cardSectionElement = document.getElementById('country-tab-section');
const detailsOfCountrySectionElement = document.getElementById(
  'details-of-country'
);

const userInputSectionELement = document.getElementById('user-input');

let fullListOfCountries;

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

  let thisTab = cardSectionElement.lastElementChild

  thisTab.addEventListener('click', () => {
    showDetailsOfCountrySectionHandler(country, thisTab);
  });
};

const toggleElementOnBackGroud = (tabToReturnView = false) => {
  cardSectionElement.classList.toggle('hidden');
  userInputSectionELement.classList.toggle('hidden');
  detailsOfCountrySectionElement.classList.toggle('hidden');
  detailsOfCountrySectionElement.innerHTML = ' ';

  if (tabToReturnView) {
    filterByContinentHandler(activeContinentFilter)
    filterByUserInputElement.value = '';

    tabToReturnView.scrollIntoView({block: "end"})
    window.scrollBy({top:200,left: 0});
  }
};

const showDetailsOfCountrySectionHandler = (
  country,
  thisTab,
  needsToUpdate = false
) => {
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

    buttonElement.addEventListener('click', () => {
      toggleElementOnBackGroud(thisTab);
    });

    divWrapperElement
      .getElementsByClassName('back-button-wrapper')[0]
      .appendChild(buttonElement);

    // BORDER COUNTRY BUTTONS

    country.borders.forEach((eachBorder) => {
      let buttonElement = document.createElement('button');
      let countryBorderInfo = borderFilter(eachBorder);

      buttonElement.className = 'button';

      buttonElement.textContent = ` ${
        countryBorderInfo.info.name.split('(')[0]
      } `;

      buttonElement.addEventListener('click', () => {
        showDetailsOfCountrySectionHandler(
          countryBorderInfo.info,
          cardSectionElement.children[countryBorderInfo.index],
          true
        );
      });

      divWrapperElement
        .getElementsByClassName('border-wrapper')[0]
        .appendChild(buttonElement);
    });

    detailsOfCountrySectionElement.appendChild(divWrapperElement);
  }
};

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
    };

    xhr.onerror = function () {
      reject(new Error('Failed to sedn request!!'));
    };

    xhr.send(JSON.stringify(data));
  });

  return promise;
};

sendHttpRequest('GET', 'https://restcountries.eu/rest/v2/all')
  .then(
    (countries) => {
      fullListOfCountries = countries;
      console.log(countries);
      return fullListOfCountries;
    },
    (error) => console.log(error)
  )
  .then((countries) => {
    countries.forEach((country) => {
      createTabFromTemplate(country);
    }),
      (error) => console.log(error);
  });
