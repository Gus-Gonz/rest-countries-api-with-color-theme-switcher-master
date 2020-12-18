const cardTemplateElement = document.getElementById('single-card');
const cardSectionElement = document.getElementById('country-tab-section');
const detailsOfCountrySectionElement = document.getElementById(
  'details-of-country'
);

console.log(detailsOfCountrySectionElement);

let fullList;

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
  console.log(country);
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

  cardSectionElement.appendChild(template);
  cardSectionElement.lastElementChild.addEventListener('click', () => {
    console.log('clicked!!');
    showDetailsOfCountrySection(country);
  });
};

const showDetailsOfCountrySection = (country) => {
  const divWrapperElement = document.createElement('div');

  //Some elements inside of county are array so map is needed

  const turnArrayIntoStr = (array) => {
    console.log(array)
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
            <li>Currency: ${turnArrayIntoStr(country.currencies).join(', ')}</li>
            <li>Languages: ${turnArrayIntoStr(country.languages).join(', ')}</li>
          </ul>
        </div>
        <div class="border">
        </div>
      </div>
    </div>
    `;
  // console.log(divWrapperElement);

  console.log(turnArrayIntoStr(country.topLevelDomain))
  detailsOfCountrySectionElement.appendChild(divWrapperElement);
};

sendHttpRequest('GET', 'https://restcountries.eu/rest/v2/all')
  .then(
    (countries) => {
      fullList = countries;
      return fullList;
    },
    (error) => console.log(error)
  )
  .then((countries) => {
    createTabFromTemplate(countries[21]);
    // countries.forEach((country) => {
    //   createTabFromTemplate(country);
    // }),
    //   (error) => console.log(error);
  });


  // crear una fiuncion filter para ser usada con los imput y con los botones de paises fronterizos 