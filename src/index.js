import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
//import templateOneCountry from './templates/templateOneCountry.hbs';
//import templateCountries from './templates/templateCountries.hbs'

const DEBOUNCE_DELAY = 300;

const refs = {
    inputRef: document.querySelector("#search-box"),
    countryListRef: document.querySelector(".country-list"),
    countryInfoRef: document.querySelector(".country-info"),
}
console.log(refs)

//-----------------render from template-----------

// const render = (countryList) => {
//     if (countryList.length === 1) {
//         refs.countryInfoRef.innerHTML = templateOneCountry(countryList[0]);
//     } else if (1 < countryList.length <= 10) {
//         renderCountries(countryList)
//     }
// }

// const renderCountries = (countryList) => {
//     return countryList.map((countryListItem) => {
//         const rend = templateCountries(countryListItem);
//         return refs.countryListRef.innerHTML = rend
//     }).join('')
// }

const render = (countryList) => {
    if (countryList.length === 1) {
        renderOne(countryList);
    } else if (countryList.length > 1 && countryList.length <= 10) {
        renderAll(countryList);
    }
}

const renderOne = (countryList) => {
    const render = countryList.map(
        ({ name, capital, population, flags, languages }) =>
        `<div>
            <img src="${flags.svg}" alt="flag" width="25">
            <p>${name.official}</p>
        </div>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages:${languages}</p>`
    ).join('')
    
    refs.countryInfoRef.innerHTML = render
}

const renderAll = (countryList) => {
    const render = countryList.map(
        ({ name, flags }) =>
        `<li>
            <img src="${flags.svg}" alt="flag" width="50">
            <p>${name.official}</p>
        </li>`
    ).join('')
    
    refs.countryListRef.innerHTML = render
}

const onFetch = (event) => {
    event.preventDefault();
    const countryFromInput = event.target.value.trim();
    console.log(countryFromInput);

    fetchCountries(countryFromInput)
    .then((countryList) => {
        console.log(countryList)
        if (countryList.length > 10) {
            Notify.info('Too many matches found. Please enter a more specific name');
        }

        render(countryList);
    }
    )
    .catch((error) => {
        console.log(error),
    Notify.failure(`Oops, there is no country with ${countryFromInput} name`)
    }
    );

};

refs.inputRef.addEventListener("input", onFetch)



