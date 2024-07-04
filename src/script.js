const BASE_URL = "https://pokeapi.co/api/v2/pokemon/"
const EVO_URL = "https://pokeapi.co/api/v2/evolution-chain/"

let pokemons = [];
let evoChains = [];
let evoData = [];
let names = [];
let loadCounter = 10;

async function init() {
    showLoadingSpinner();
    await loadPokemons(10, 0);
    renderPokemons();
    await loadEvolution(10, 0);
    getEvoNames(10, 0);
    await loadEvolution(198, 0);
    getEvoNames(198, 10);
    loadButton();
}

async function loadPokemons(amount = 1, offset = 0) {
    for (let i = offset + 1; i < amount + 1 + offset; i++) {
        let pokemonResponse = await getAPokemon(`${i}`);
        pokemons.push(pokemonResponse);
        names.push(pokemonResponse.name);
    }
}

async function loadEvolution(amount = 1, offset = 0) {
    for (let i = offset + 1; i < amount + 1 + offset; i++) {
        let pokemonResponse = await getTheEvolution(`${i}`);
        evoChains.push(pokemonResponse);
    }
}

function getEvoNames(amount = 1, offset = 0) {
    for (let i = offset; i < amount + offset; i++) {
        const evoCh = evoChains[i].chain;
        const evoChTo = evoCh.evolves_to[0];
        evoData.push(
            evoNamesObj(evoCh.species.name, 1, i, getImgUrl(evoCh.species.url)));
            if (evoChTo) {
                if (evoChTo.evolves_to[0]) {
                    const evoChToTo = evoChTo.evolves_to[0];
                    evoData.push(
                        evoNamesObj(evoChTo.species.name, 2, i, getImgUrl(evoChTo.species.url)));
                        
                    evoData.push(
                        evoNamesObj(evoChToTo.species.name, 3, i, getImgUrl(evoChToTo.species.url)));
            } else {
                evoData.push(
                    evoNamesObj(evoChTo.species.name, 2, i, getImgUrl(evoChTo.species.url)));
            }
        }
    }
}

function getImgUrl(url) {
    const id = url.split('species/')[1].replace('/','');
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function evoNamesObj(name,evoStats,evoChain,imgUrl) {
    return {
        name, 
        evoStats, 
        evoChain,
        imgUrl
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
    content.innerHTML = createInfoHtml(pokemon, index);
    document.body.style.overflow = "hidden";
    fillMain(index);
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
        id = ((id - 1) / 3) + 1;
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
        if (name.includes(search)) {
            content.innerHTML += createCardHtml(index);
        }
    }
}

function loadButton() {
    const button = document.getElementById('load-button');
    button.innerHTML = createButton();
}

function loadButtonSpinner() {
    const button = document.getElementById('load-button');
    button.innerHTML = createButtonSpinner();
}

async function loadMore() {
    loadButtonSpinner();
    await loadPokemons(10, loadCounter);
    loadCounter = loadCounter + 10;
    renderPokemons();
    loadButton();
}

function addAdditionalType(i) {
    const pokemon = pokemons[i];
    if (pokemon.types[1]) {
        return `<img class="type-icon m-l-10" src="./img/icons/${pokemon.types[1].type.name}.png">`;
    } else {
        return ``;
    }
}

function fillMain(i) {
    const content = document.getElementById('poke-stats');
    content.innerHTML = '';
    content.innerHTML = createMainLeftHtml();
    content.innerHTML += createMainRightHtml(i);
}

function fillStats(i) {
    const content = document.getElementById('poke-stats');
    content.innerHTML = '';
    content.innerHTML = createStatsHtml(i);
}

function getHighestValue(pokemon) {
    const stats = pokemon.stats.map((e) => e.base_stat);
    return Math.max(...stats);
}

function fillEvo(i) {
    const content = document.getElementById('poke-stats');
    content.innerHTML = '';
    content.innerHTML = createEvoHtml(i);
}

function isEvo(i) {
    const evoChainPokemons = getPokemonForEvoChain(i);
    if (evoChainPokemons.length === 3) {
        return `
        ${createEvoImgOneHtml(evoChainPokemons)}
        ${createEvoArrowHtml()}
        ${createEvoImgTwoHtml(evoChainPokemons)}
        ${createEvoArrowHtml()}
        ${createEvoImgThreeHtml(evoChainPokemons)}
        `;
    } else if (evoChainPokemons.length === 2) {
        return `
        ${createEvoImgOneHtml(evoChainPokemons)}
        ${createEvoArrowHtml()}
        ${createEvoImgTwoHtml(evoChainPokemons)}
        `;
    } else {
        return `
        ${createEvoImgOneHtml(evoChainPokemons)}
        `;
    }
}

function getPokemonForEvoChain(i) {
    const pokemon = pokemons[i];
    const initName = pokemon.name.toLowerCase();
    const index = evoData.findIndex(pokemon => pokemon.name === initName);
    const evoChainNumber = evoData[index].evoChain;
    const evoChainPokemons = evoData.filter(pokemon => pokemon.evoChain === evoChainNumber);
    evoChainPokemons.sort((a, b) => a.evoStats - b.evoStats);
    return evoChainPokemons;
}

function isAbility(i) {
    const pokemon = pokemons[i];
    if (pokemon.abilities[1]) {
        if (pokemon.abilities[2]) {
            return `, ${pokemon.abilities[1].ability.name}, 
            ${pokemon.abilities[2].ability.name}`;
        } else {
            return `, ${pokemon.abilities[1].ability.name}`;
        }
    } else return ``;
}

function nextPokemon(i) {
    if (i != names.length-1) {
        renderInfoCard(i+1)
    } else {
        closeInfoCard();
    }
}

function previousPokemon(i) {
    renderInfoCard(i-1)
}
