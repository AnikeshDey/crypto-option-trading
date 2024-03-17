import ActionTypes from './contestResult.types';

const INITIAL_STATE = {
    results:{}
}

export const contestResultReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ActionTypes.PUT_NEW_RESULT:
            var stateCopy = {...state};
            stateCopy.results[action.key] = {
                result:action.result,
                timeout:new Date(new Date().getTime() + (1 * 60 * 1000)).getTime()
            }
            return {
                ...stateCopy
            }
            break;
        case ActionTypes.DELETE_RESULT:
            var copy = { ...state }   
            delete copy.results[action.key];
            return {
                ...copy
            };
          break;
        case ActionTypes.DELETE_ALL_RESULTS:
            return {
                ...state,
                results:{}
            }
        default:
            return state;
      }
}