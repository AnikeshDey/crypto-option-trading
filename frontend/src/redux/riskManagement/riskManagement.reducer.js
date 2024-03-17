import ActionTypes from './riskManagement.types';

const INITIAL_STATE = {
    risk:null,
}

export const riskReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ActionTypes.PUT_NEW_RISK:
          return {
                risk: action.risk
            };
          break;
        default:
            return state;
      }
}