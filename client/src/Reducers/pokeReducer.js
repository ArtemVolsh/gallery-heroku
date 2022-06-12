const POKE = "POKE";

const defaultState = {
  poke: false,
};

export default function pokeReducer(state = defaultState, action) {
  switch (action.type) {
    case POKE:
      return {
        ...state,
        poke: !state.poke,
      };
    default:
      return state;
  }
}

export const pokeGlobal = () => ({ type: POKE });
