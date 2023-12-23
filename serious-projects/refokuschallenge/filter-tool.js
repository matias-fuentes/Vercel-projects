const pokemonList = document.querySelector('#poke-cards-container');

async function filterTool() {
    /* Credits to fanzeyi and its contributors for the data of the /pokedex.json.
    More info about them and its repository at: https://github.com/fanzeyi/pokemon.json */
    let fullPokemonList = await fetch('/pokedex.json');
    fullPokemonList = await fullPokemonList.json();
    getInitialPage(fullPokemonList);

    const filterForm = document.querySelector('.filter-container');
    filterForm.addEventListener('submit', function (event) {
        /* We prevent the form its default behavior of sending a POST method, so we can handle all
        with JavaScript at the client side. */
        event.preventDefault();

        /* We select all the inputs from filterForm, and remove (splice) only the search button. */
        let filterValues = Array.from(filterForm);
        filterValues.splice(1, 1);

        /* This is the object structure that the filters object will have. */
        let filters = {
            search: '',
            stats: [
                {
                    HP: {
                        minimum: '',
                        maximum: '',
                    },
                },
                {
                    attack: {
                        minimum: '',
                        maximum: '',
                    },
                },
                {
                    defense: {
                        minimum: '',
                        maximum: '',
                    },
                },
                {
                    spAttack: {
                        minimum: '',
                        maximum: '',
                    },
                },
                {
                    spDefense: {
                        minimum: '',
                        maximum: '',
                    },
                },
                {
                    speed: {
                        minimum: '',
                        maximum: '',
                    },
                },
            ],
        };

        /* We iterate through all the inputs and insert them to the filters object.
            
        filterValues: array of all the inputs (inputs, not values) from filterForm.
        filter: an individual input from filterValues.
        filters: object (from above) with the values of those individual inputs.
        filtersObjKey: stores the key name of the type of filter (HP, attack, defense, etc.) needed in
        order to assign properly the value extracted from filter.value to the filters object.
        
        With all of this, we already have our filters object from above already populated :). */
        filterValues.forEach((filter, index) => {
            if (index === 0) {
                filters.search = filter.value;
            } else {
                const filtersObjKey = Object.keys(filters.stats)[Math.floor((index - 1) / 2)];
                if (index % 2 === 0) {
                    filters.stats[filtersObjKey].maximum = filter.value;
                } else {
                    filters.stats[filtersObjKey].minimum = filter.value;
                }
            }
        });

        /* 1) We check if we have a minimum filter, or a maximum filter, because if not, then we don't have
        anything to filter.
        2) We extract the key value of the stat that we are currently iterating for in the filters object
        (HP, attack, defense, etc.), so later we can use it as a reference.
        3)
            A) Check if we have a minimum stat, and not a maximum stat, and filter. This is useful if
            the user wants to see all the Pokémons with, for example, at least 80 HP with no limits.
            B) Check if we have a maximum stat, and not a minimum stat, and filter. This is useful if
            the user wants to see all the Pokémons with, for example, maximum 48 Sp. Attack, with no
            minimums. From Pokémons with 48 Sp. Attack, til' Pokémons with 0 Sp. Attack.
            C) Check if we have both stats, and filter between those two ranges.
        4) We always check if filteredPokemons have length, because if it has, it means that we've already
        filtered before in an earlier iteration from the fullPokemonList, and, as the name itself explains it,
        in filteredPokemons we want to store the Pokémons that we will be filtering. */

        let filterStatsExists = false;
        let filteredPokemons = [];
        filters.stats.forEach(stat => {
            if (stat.maximum || stat.minimum) {
                filterStatsExists = true;
                const key = Object.keys(stat)[0];
                if (stat.minimum && !stat.maximum) {
                    if (filteredPokemons.length) {
                        filteredPokemons = filteredPokemons.filter(pokemon => pokemon.base[key] >= stat.minimum);
                    } else {
                        filteredPokemons = fullPokemonList.filter(pokemon => pokemon.base[key] >= stat.minimum);
                    }
                } else if (stat.maximum && !stat.minimum) {
                    if (filteredPokemons.length) {
                        filteredPokemons = filteredPokemons.filter(pokemon => pokemon.base[key] <= stat.maximum);
                    } else {
                        filteredPokemons = fullPokemonList.filter(pokemon => pokemon.base[key] <= stat.maximum);
                    }
                } else {
                    if (filteredPokemons.length) {
                        filteredPokemons = filteredPokemons.filter(
                            pokemon => pokemon.base[key] <= stat.maximum && pokemon.base[key] >= stat.minimum
                        );
                    } else {
                        filteredPokemons = fullPokemonList.filter(
                            pokemon => pokemon.base[key] <= stat.maximum && pokemon.base[key] >= stat.minimum
                        );
                    }
                }
            }
        });

        /* Elements with which we are going to work */
        let pokeCards = document.querySelectorAll('.card');
        let emptyStateContainer = document.querySelector('.empty-state-container');

        /* After we filter by the stats, then we filter between those same Pokémons that are already filtered
        (by stats), by search. */
        if (filters.search) {
            removePrevState(emptyStateContainer, pokeCards);
            /* With the combination of removePrevState(), createPokeCards(), and getInitialPage() we can remove
            the older Pokémons, and replace them by creating the new ones based on the filters of the user.

            If the amount of filtered Pokémons is lesser or equal to 25, then we don't have to worry about
            to split all the Pokémons in different pages, so we just create them.
            Otherwise, with getInitialPage() we receive the first 25 Pokémons of the first page,
            and creates and displays them, all of them splitted in the different pages. */
            if (filteredPokemons.length) {
                filteredPokemons = filteredPokemons.filter(
                    pokemon => pokemon.name.english.indexOf(filters.search) !== -1
                );
            } else {
                if (filterStatsExists) {
                    emptyState();
                } else {
                    filteredPokemons = fullPokemonList.filter(
                        pokemon => pokemon.name.english.indexOf(filters.search) !== -1
                    );
                }
            }

            if (!filteredPokemons.length) {
                pokeCards = document.querySelectorAll('.card');
                emptyStateContainer = document.querySelector('.empty-state-container');

                removePrevState(emptyStateContainer, pokeCards);
                emptyState();
            }
        } else if (filteredPokemons) {
            if (filterStatsExists === false) {
                /* If there is no search, if there are already filtered Pokémons displayed, and if there are no
                filter stats, we reset the filters.
                
                This is useful for example if the user types: 'Char', and then removes it.
    
                When types 'Char': shows all Pokémons with 'Char' in their names.
                When types '' AFTER (and only after) types 'Char', with no other filters: removes the Char Pokémons
                and reset the filters. */

                removePrevState(emptyStateContainer, pokeCards);
                getInitialPage(fullPokemonList);
            }
        }

        if (filteredPokemons.length <= 25) {
            createPokeCards(filteredPokemons);
        } else {
            getInitialPage(filteredPokemons);
        }
    });
}

filterTool();

function getInitialPage(pokemonList) {
    let actualPagePokes = [];

    /* We only push the first 25 selected Pokémons from the pokemonList to the actualPagePokes. */
    for (let i = 0; i < 25; i++) {
        actualPagePokes.push(pokemonList[i]);

        /* We convert the id's from the Pokémons from integers to strings so we can later check its length. */
        actualPagePokes[i].id = actualPagePokes[i].id.toString();
        const pokemonId = actualPagePokes[i].id;

        /* Here below we change the id's values again from, for example, 1, to 001, and from 11, to 011, and so on.
        This is necessary so then we can match these values with the file names of its respective images
        (/images/001.png for example).
        
        Since I were not the person who named the 800+ images slightly different as they're listed in the JSON,
        and of course since I want to save time for myself too, this extra step is very important in order to
        display the images properly. */
        if (actualPagePokes[i].id.length === 1) {
            actualPagePokes[i].id = '00' + pokemonId;
        } else if (actualPagePokes[i].id.length === 2) {
            actualPagePokes[i].id = '0' + pokemonId;
        }
    }

    createPokeCards(actualPagePokes);

    return;
}

function createPokeCards(actualPagePokes) {
    const pokemonsInnerHTML = actualPagePokes.map(
        pokemon => `
        <img src='/images/${pokemon.id}.png'>
        <h3>${pokemon.name.english}</h3>
        <hr>
        <p>HP: ${pokemon.base.HP}</p>
        <p>Attack: ${pokemon.base.attack}</p>
        <p>Defense: ${pokemon.base.defense}</p>
        <p>Sp. Attack: ${pokemon.base.spAttack}</p>
        <p>Sp. Defense: ${pokemon.base.spDefense}</p>
        <p>Speed: ${pokemon.base.speed}</p>
    `
    );

    /* We select the #pokemon-list div, and append to it the pokemonsInnerHTML structure from above.
    With all of this, we have our first 25 Pokémons cards with all the needed information already displayed :). */
    pokemonsInnerHTML.forEach(innerHTML => {
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'card';
        pokemonCard.innerHTML = innerHTML;
        pokemonList.appendChild(pokemonCard);
    });

    return;
}

function emptyState() {
    const emptyStateContainer = document.createElement('div');
    emptyStateContainer.className = 'empty-state-container mrg-bottom';
    emptyStateContainer.textContent = 'No Pokémons have been found. Please, try again.';
    pokemonList.appendChild(emptyStateContainer);

    return;
}

function removePrevState(emptyStateContainer, pokeCards) {
    if (emptyStateContainer) {
        emptyStateContainer.remove();
    } else {
        pokeCards.forEach(card => {
            card.remove();
        });
    }

    return;
}
