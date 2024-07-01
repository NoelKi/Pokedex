const BASE_URL = "https://pokeapi.co/api/v2/pokemon/"

pokemons = [];


function init() {
    pokemonResponse = getAPokemon('1/species');
}

async function onloadFunc() {
    let userResponse = await getAllUser("names");

    let UserKeysArray = Object.keys(userResponse)

    console.log(UserKeysArray);

    await addEditSingleUser();
}

async function getAPokemon(path = "") {
    try {
        const response = await fetch(BASE_URL + path);
        if (!response.ok) {
            throw new Error('network does not answer correctly');
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Fehler:', error);
    }
}
