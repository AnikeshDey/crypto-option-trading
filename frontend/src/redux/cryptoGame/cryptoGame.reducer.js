import ActionTypes from './cryptoGame.types';

const INITIAL_STATE = {
    games:[]
}

export const cryptoGameReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ActionTypes.SET_NEW_GAMES:
          return {
                ...state,
                games: [...action.games]
            };
          break;
        case ActionTypes.UPDATE_GAME_PRICE:
            var betsOddsCopy = [...state.games];

            action.data.forEach(el => {
                var indexOdds = betsOddsCopy.findIndex(n => n.id === el.id);
                if(indexOdds >= 0){
                    betsOddsCopy[indexOdds].pR = el.pR;
                    betsOddsCopy[indexOdds].pRcP = el.pRcP;
                    betsOddsCopy[indexOdds].updatedAt = el.updatedAt;
                }
            })
            
            return {
                    ...state,
                    games: [...betsOddsCopy]
                };
            break;
        default:
            return state;
      }
}