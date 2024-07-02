const BASE_URL = "https://pokeapi.co/api/v2/pokemon/"
const ALL_URL = "https://pokeapi.co/api/v2/pokemon"
const EVO_URL = "https://pokeapi.co/api/v2/evolution-chain/"

let pokemons = [];
let names = [];
let loadCounter = 20;

async function init() {
    showLoadingSpinner();
    await loadPokemons(20, 0);
    loadButton();
    console.log(pokemons);
    renderPokemons();
}

async function loadPokemons(amount = 1, offset = 0) {
    for (let i = offset + 1; i < amount + 1 + offset; i++) {
        let pokemonResponse = await getAPokemon(`${i}`);
        pokemons.push(pokemonResponse);
        names.push(pokemonResponse.name); 
    }
}

async function loadPokemonNames(amount = 10, offset = 0) {
    let pokemonResponse = await getPokemons(`?limit=${amount}&offset=${offset}`);
    console.log(pokemonResponse);
    pokemons.push(pokemonResponse.results.map(pokemon => pokemon.name));
    names.push(pokemons.name); 
}

function renderPokemons() {
    const content = document.getElementById('content');
    content.innerHTML = '';
    for (let i = 0; i < pokemons.length; i++) {
        pokemons[i].name = makeFirstLetterUpperCase(pokemons[i].name)
        content.innerHTML += createCardHtml(i);
    }
}

function renderInfoCard(index) {
    const content = document.getElementById('info-content');
    content.innerHTML = '';
    const pokemon = pokemons[index];
    content.innerHTML = createInfoHtml(pokemon);
    document.body.style.overflow = "hidden";
}

function createInfoHtml(pokemon) {
    return `
    <div class="info-container" onclick="closeInfoCard()">
        <div class="info-card" onclick="event.stopPropagation()">
            <div class="info-card-top">
                <span id="info-card-id">
                    #${pokemon.id}
                </span>
                <span id="info-card-name">
                    ${pokemon.name}
                </span>
            </div>
            <div class="info-card-img ${pokemon.types[0].type.name}">
                <img id="pokemon-img" src="${pokemon.sprites.front_default}">
            </div>
            <div class="info-card-bottom">
                <div class="evolution">
                </div>
            </div>
        </div>
    </div>
    `;
}

function createCardHtml(i) {
    pokemon = pokemons[i];
    return `
    <div class="card" onclick="renderInfoCard(${i})">
        <div class="card-top">
            <span id="pokemon_id">
                #${pokemon.id}
            </span>
            <span id="pokemon-name">
                ${pokemon.name}
            </span>
        </div>
        <div class="card-img ${pokemon.types[0].type.name}">
            <img id="pokemon-img" src="${pokemon.sprites.front_default}">
        </div>
        <div class="card-bottom">
            <div>
            </div>
        </div>
    </div>
    `;
}

async function getAPokemon(path = "") {
    try {
        const response = await fetch(BASE_URL + path);
        if (!response.ok) {
            throw new Error('network does not answer correctly');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fehler:', error);
    }
}

async function getPokemons(path = "") {
    try {
        const response = await fetch(ALL_URL + path);
        if (!response.ok) {
            throw new Error('network does not answer correctly');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fehler:', error);
    }
}

async function getTheEvolution(path = "") {
    try {
        const response = await fetch(EVO_URL + path);
        if (!response.ok) {
            throw new Error('network does not answer correctly');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fehler:', error);
    }
}

function makeFirstLetterUpperCase(string) {
    string = string[0].toUpperCase() + string.slice(1);
    return string
}

function makeCorrectId(id) {
    if (id == 1) {
        return id
    } else {
        id = ((id - 1) / 3)+ 1;
        return id
    }
}

function showLoadingSpinner() {
    const content = document.getElementById('content');
    content.innerHTML = '';
    content.innerHTML = `<div class='spinner'>
        <img src='./img/icons/pokemon-logo.svg' alt='loading-spinner'>
    </div>`;
}

function closeInfoCard() {
    const infoContent = document.getElementById('info-content');
    infoContent.innerHTML = '';
    document.body.style.overflow = "visible";
}

function filterNames(event) {
    console.log(event);
    const search = event.target.value.toLowerCase();
    const content = document.getElementById('content');
    console.log(search);
    content.innerHTML = '';

    for (let index = 0; index < names.length; index++) {
        let name = names[index];
        name = name.toLowerCase();
        if(name.includes(search)) {
            content.innerHTML += createCardHtml(index);
        }
    }
}

function loadButton() {
    const button = document.getElementById('load-button');
    button.innerHTML = createButton();
}

function createButton() {
    return `
    <button class="button" onclick="loadMore()">Load more ...</button>
    `;
}

function loadButtonSpinner() {
    const button = document.getElementById('load-button');
    button.innerHTML = createButtonSpinner();
}

function createButtonSpinner() {
    return `
    <button class="button"><span class="loader">
    </span></button>
    `;
}

async function loadMore() {
    loadButtonSpinner();
    await loadPokemons(20,loadCounter);
    loadCounter = loadCounter + 20;
    console.log(pokemons);
    renderPokemons();
    loadButton();
}