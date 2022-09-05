import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
    inputRef: document.querySelector("#search-box"),
    countryListRef: document.querySelector(".country-list"),
    countryInfoRef: document.querySelector(".country-info"),
};

const render = (countryList) => {
    if (countryList.length === 1) {
        refs.countryListRef.innerHTML = "";
        renderOne(countryList);
    } else if (countryList.length > 1 && countryList.length <= 10) {
        refs.countryInfoRef.innerHTML = "";
        renderAll(countryList);
    }
};

const renderOne = (countryList) => {
    const render = countryList.map(
        ({ name, capital, population, flags, languages }) =>
            `<div class="country-info__title">
            <img src="${flags.svg}" alt="flag" width="50">
            <p class="country-info__name">${name.official}</p>
        </div>
        <p class="country-info__info"><span class="bold">Capital:</span> ${capital}</p>
        <p class="country-info__info"><span class="bold">Population:</span> ${population}</p>
        <p class="country-info__info"><span class="bold">Languages:</span> ${Object.values(languages)}</p>`
    ).join('');
    
    refs.countryInfoRef.innerHTML = render;
}

const renderAll = (countryList) => {
    const render = countryList.map(
        ({ name, flags }) =>
            `<li class="country-list__item">
            <img src="${flags.svg}" alt="flag" width="50">
            <p class="country-list__name bold">${name.official}</p>
        </li>`
    ).join('');
    
    refs.countryListRef.innerHTML = render;
}

const onFetch = (event) => {
    event.preventDefault();
    const countryFromInput = event.target.value.trim();
    
    fetchCountries(countryFromInput)
    .then((countryList) => {
        if (countryList.length > 10) {
            Notify.info('Too many matches found. Please enter a more specific name');
        } 

        render(countryList);
    }
    )
    .catch((error) => {
        console.log(error);
            if (countryFromInput === "") {
                refs.countryInfoRef.innerHTML = "";
                refs.countryListRef.innerHTML = "";
                Notify.info('Select a country, please');
        } else {Notify.failure(`Oops, there is no country with ${countryFromInput} name`)}
    }
    );
};

refs.inputRef.addEventListener("input", (debounce(onFetch, DEBOUNCE_DELAY)));



