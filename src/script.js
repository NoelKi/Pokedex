const BASE_URL = "https://pokeapi.co/api/v2/pokemon/"
const EVO_URL = "https://pokeapi.co/api/v2/evolution-chain/"

let pokemons = [];
let evolutions = [];
let evoNames = [];
let names = [];
let loadCounter = 20;


async function init() {
    showLoadingSpinner();
    await loadPokemons(20, 0);
    await loadEvolution(100, 0);
    console.log(evolutions);
    console.log(pokemons);
    loadButton();
    renderPokemons();
    getEvoNames(100);
    console.log(evoNames);
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
        evolutions.push(pokemonResponse);
    }
}

function getEvoNames(amount = 1, offset = 0) {
    for (let i = offset; i < amount + offset; i++) {
        const evoCh = evolutions[i].chain;
        const evoChTo = evoCh.evolves_to[0];
        evoNames.push(
            evoNamesObj(evoCh.species.name, 1, i, getImgUrl(evoCh.species.url)));
            if (evoChTo) {
                if (evoChTo.evolves_to[0]) {
                    const evoChToTo = evoChTo.evolves_to[0];
                    evoNames.push(
                        evoNamesObj(evoChTo.species.name, 2, i, getImgUrl(evoChTo.species.url)));
                        
                    evoNames.push(
                        evoNamesObj(evoChToTo.species.name, 3, i, getImgUrl(evoChToTo.species.url)));
            } else {
                evoNames.push(
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

function createInfoHtml(pokemon, i) {
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
                <div class="poke-types">
                    <img class="type-icon" src="./img/icons/${pokemon.types[0].type.name}.png">
                    ${addAdditionalType(i)}
                </div> 
                <div class="reiter">
                    <div class="reit" id="main" onclick="fillMain(${i})">main</div>
                    <div class="reit-sep"></div>
                    <div class="reit-mid" id="stats" onclick="fillStats(${i})">stats</div>
                    <div class="reit-sep"></div>
                    <div class="reit" id="evo" onclick="fillEvo(${i})">evo</div>
                </div>
                <div class="poke-stats" id="poke-stats"></div>
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
                <img class="type-icon" src="./img/icons/${pokemon.types[0].type.name}.png">
                ${addAdditionalType(i)}
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
    await loadPokemons(20, loadCounter);
    loadCounter = loadCounter + 20;
    console.log(pokemons);
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

function createMainLeftHtml() {
    return `
    <div style="padding-right: 20px">
    height:</br></br>
    weight:</br></br>
    base experience: </br></br>
    abilities:</br></br>
    </div>
    `;
}

function createMainRightHtml(i) {
    const pokemon = pokemons[i];
    return `
    <div>
    ${pokemon.height / 10} m </br></br>
    ${pokemon.weight / 10} kg </br></br>
    <p class="line-break"></br></p>
    ${pokemon.base_experience} xp</br></br>
    ${pokemon.abilities[0].ability.name}${isAbility(i)}</br></br>
    </div>
    `;
}

function fillStats(i) {
    const content = document.getElementById('poke-stats');
    content.innerHTML = '';
    content.innerHTML = createStatsHtml(i);
}

function createStatsHtml(i) {
    const pokemon = pokemons[i];
    const highValue = getHighestValue(pokemon);
    return `
    ${createStatsDivHtml()}
    ${createStatsDivBarsHtml(pokemon,highValue)}
    ${createStatsValueHtml(pokemon)}
    `;
}

function createStatsValueHtml(pokemon) {
    const newDiv = document.createElement('div');
    newDiv.className = 'bar-stats';
    for (let i = 0; i < 6; i++) {
        const p = document.createElement('p');
        p.innerHTML = `${pokemon.stats[i].base_stat}`;
        newDiv.append(p);
    }
    return newDiv.outerHTML;
}

function createStatsDivBarsHtml(pokemon,highValue) {
    const newDiv = document.createElement('div');
    newDiv.className = 'bars';
    for (let i = 0; i < 6; i++) {
        const outerDiv = document.createElement('div');
        outerDiv.id = 'progressbar';
        const innerDiv = document.createElement('div');
        innerDiv.style.width = `${pokemon.stats[i].base_stat/highValue*100}%`;
        outerDiv.append(innerDiv);
        newDiv.append(outerDiv);
    }
    return newDiv.outerHTML;
}

function getHighestValue(pokemon) {
    const stats = pokemon.stats.map((e) => e.base_stat);
    return Math.max(...stats);
}

function createStatsDivHtml() {
    const newDiv = document.createElement('div');
    newDiv.className = 'bar-stats';
    const stats = ['hp :', 'attack :', 'defense :', 'special attack :', 'special defence :', 'speed :']
    stats.forEach((element) => {
        const p = document.createElement('p');
        p.innerHTML = element;
        newDiv.append(p);
    });
    return newDiv.outerHTML;
}

function fillEvo(i) {
    const content = document.getElementById('poke-stats');
    content.innerHTML = '';
    content.innerHTML = createEvoHtml(i);
}

function createEvoHtml(i) {
    const pokemon = pokemons[i];
    return `
    <div class="evolution">
        ${isEvo(i)}
    <div>
    `;
}

function isEvo(i) {
    const pokemon = pokemons[i];
    const initName = pokemon.name.toLowerCase();
    const index = evoNames.findIndex(pokemon => pokemon.name === initName);
    const evoChainNumber = evoNames[index].evoChain;
    const evoChainPokemons = evoNames.filter(pokemon => pokemon.evoChain === evoChainNumber);
    console.log(evoChainPokemons);
    evoChainPokemons.sort((a, b) => a.evoStats - b.evoStats);
    if (evoChainPokemons.length === 3) {
        return `
        <div class="evo">
            <img src="${evoChainPokemons[0].imgUrl}" alt="${evoChainPokemons[0].name}">
        </div>
        <div class="evolution-arrow">
            <img src="./img/icons/arrow.png">
        </div>
        <div class="evo">
            <img src="${evoChainPokemons[1].imgUrl}" alt="${evoChainPokemons[1].name}">
        </div>
        <div class="evolution-arrow">
            <img src="./img/icons/arrow.png">
        </div>
        <div class="evo">
            <img src="${evoChainPokemons[2].imgUrl}" alt="${evoChainPokemons[2].name}">
        </div>
        `;
    } else if (evoChainPokemons.length === 2) {
        return `
        <div class="evo">
            <img src="${evoChainPokemons[0].imgUrl}" alt="${evoChainPokemons[0].name}">
        </div>
        <div class="evolution-arrow">
            <img src="./img/icons/arrow.png">
        </div>
        <div class="evo">
            <img src="${evoChainPokemons[1].imgUrl}" alt="${evoChainPokemons[1].name}">
        </div>
        `;
    } else {
        return `
        <div class="evo">
            <img src="${evoChainPokemons[0].imgUrl}" alt="${evoChainPokemons[0].name}">
        </div>
        `;
    }
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