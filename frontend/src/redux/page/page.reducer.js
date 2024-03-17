import ActionTypes from './page.types';

const INITIAL_STATE = {
    pageType:'default'
}

export const pageReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ActionTypes.SET_PAGE_TYPE:
            return {
                ...state,
                pageType: action.pageType
            }
        default:
            return state;
      }
}