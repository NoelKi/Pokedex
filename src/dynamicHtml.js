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
                <img id="pokemon-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i+1}.png">
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
            <img id="pokemon-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i+1}.png">
        </div>
        <div class="card-bottom">
                <img class="type-icon" src="./img/icons/${pokemon.types[0].type.name}.png">
                ${addAdditionalType(i)}
        </div>
    </div>
    `;
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

function createButton() {
    return `
    <button class="button" onclick="loadMore()">Load more ...</button>
    `;
}

function createButtonSpinner() {
    return `
    <button class="button"><span class="loader">
    </span></button>
    `;
}

function createEvoImgOneHtml(evoChainPokemons) {
    return ` 
    <div class="evo">
        <img src="${evoChainPokemons[0].imgUrl}" alt="${evoChainPokemons[0].name}">
    </div>`;
}

function createEvoImgTwoHtml(evoChainPokemons) {
    return ` 
    <div class="evo">
        <img src="${evoChainPokemons[1].imgUrl}" alt="${evoChainPokemons[1].name}">
    </div>`;
}

function createEvoImgThreeHtml(evoChainPokemons) {
    return ` 
    <div class="evo">
        <img src="${evoChainPokemons[2].imgUrl}" alt="${evoChainPokemons[2].name}">
    </div>`;
}

function createEvoArrowHtml() {
    return ` 
    <div class="evolution-arrow">
        <img src="./img/icons/arrow.png">
    </div>`;
}

function createEvoHtml(i) {
    const pokemon = pokemons[i];
    return `
    <div class="evolution">
        ${isEvo(i)}
    <div>
    `;
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

function createStatsHtml(i) {
    const pokemon = pokemons[i];
    const highValue = getHighestValue(pokemon);
    return `
    ${createStatsDivHtml()}
    ${createStatsDivBarsHtml(pokemon,highValue)}
    ${createStatsValueHtml(pokemon)}
    `;
}