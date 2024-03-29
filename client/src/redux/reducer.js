import {
  GET_ALL_POKEMONS,
  RESET_POKEMONS,
  GET_ALL_TYPES,
  GET_POKEMON_BY_ID,
  PREV_PAGE,
  NEXT_PAGE,
  GO_TO_PAGE,
  SET_TOTAL_PAGES,
  SEARCH_BY_NAME,
  GET_API_POKEMONS,
  GET_DB_POKEMONS,
  SORT_NAME,
  SORT_ATK,
  EMTYDETAILS,
  SET_ERROR,
  FILTER_TYPE,
} from "./actions.js";

const initialState = {
  pokemons: [],
  types: [],
  pokemonDetail: [],
  currentPage: 1,
  itemsPerPage: 12,
  totalPages: [],
  error: "",
  pokemonsBackUp: [],
  filter: {
    apiOrDb: "ALL",
    sort: "",
    type: "",
  },
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_POKEMONS:
      if (state.pokemonsBackUp.length === 0) {
        return {
          ...state,
          pokemons: action.payload,
          pokemonsBackUp: action.payload,
        };
      }
      return { ...state };

    case RESET_POKEMONS:
      return {
        ...state,
        filter: {
          apiOrDb: "ALL",
          sort: "",
          type: "",
        },
        pokemons: state.pokemonsBackUp,
      };

    case GET_ALL_TYPES:
      return {
        ...state,
        types: action.payload,
      };

    case GET_POKEMON_BY_ID:
      return {
        ...state,
        pokemonDetail: action.payload,
      };

    case PREV_PAGE:
      let decrement = -1;
      if (state.currentPage === 1) decrement = 0;

      return {
        ...state,
        currentPage: state.currentPage + decrement,
      };

    case NEXT_PAGE:
      let increment = 1;
      if (state.currentPage === state.totalPages) increment = 0;

      return {
        ...state,
        currentPage: state.currentPage + increment,
      };

    case GO_TO_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };

    case SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.payload,
      };

    case SEARCH_BY_NAME:
      return {
        ...state,
        pokemons: action.payload,
      };

    case GET_API_POKEMONS:
      state.pokemons = state.pokemonsBackUp;
      return {
        ...state,
        filter: {
          ...state.filter,
          apiOrDb: "API",
        },
        pokemons: state.pokemons.filter(
          (pokemon) => typeof pokemon.id === "number"
        ),
      };

    case GET_DB_POKEMONS:
      state.pokemons = state.pokemonsBackUp;
      return {
        ...state,
        filter: {
          ...state.filter,
          apiOrDb: "DB",
        },
        pokemons: state.pokemons.filter(
          (pokemon) => typeof pokemon.id === "string"
        ),
      };

    case SORT_NAME:
      const ascendingName = (a, b) => a.name.localeCompare(b.name);
      const descendingName = (a, b) => b.name.localeCompare(a.name);

      const orderName =
        action.payload === "MAYOR" ? ascendingName : descendingName;
      state.pokemons.sort(orderName);

      let sort;

      if (action.payload === "MAYOR") {
        sort = 1;
      } else {
        sort = 2;
      }

      return {
        ...state,
        filter: {
          ...state.filter,
          sort: sort,
        },
      };
    case SORT_ATK:
      const ascendingAtk = (a, b) => a.attack - b.attack;
      const descendingAtk = (a, b) => b.attack - a.attack;

      const orderAtk =
        action.payload === "MAYOR" ? descendingAtk : ascendingAtk;
      state.pokemons.sort(orderAtk);

      let atk;

      if (action.payload === "MAYOR") {
        atk = 3;
      } else {
        atk = 4;
      }

      return {
        ...state,
        filter: {
          ...state.filter,
          sort: atk,
        },
      };

    case FILTER_TYPE:
      state.pokemons = state.pokemonsBackUp;
      return {
        ...state,
        filter: {
          ...state.filter,
          type: action.payload,
        },
        pokemons: state.pokemons.filter(
          (pokemon) =>
            pokemon.types[0].name === action.payload ||
            pokemon?.types[1]?.name === action.payload
        ),
      };

    case EMTYDETAILS:
      return {
        ...state,
        pokemonDetail: [],
        error: "",
      };

    case SET_ERROR:
      return {
        ...state,
        error: action.payload + " is not a Pokemon. 🤭",
      };

    default:
      return { ...state };
  }
}
