import ActionTypes from './cryptoSlip.types';
// import { calculateTotalCost } from './contestslip.utils';

const INITIAL_STATE = {
    quizzes: [],
    totalCost:0,
    errorMessage:null,
    errorValue:null,
    useBonus:false
}

export const cryptoSlipReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
            case ActionTypes.CLEAR_SLIP:
                var quizCopy = [...state.quizzes];
                var newCopy = quizCopy.filter(q => q.contestId != action.contestId);

                return {
                      ...state,
                      quizzes: newCopy,
                      totalCost:0,
                      errorMessage:null,
                      errorValue:null
                  };
        case ActionTypes.SET_ERROR_MESSAGE:
            return {
                    ...state,
                    errorMessage: action.errorMessage 
                };
        case ActionTypes.SET_ERROR_VALUE:
            return {
                    ...state,
                    errorValue: action.value
                };
        case ActionTypes.SET_USE_BONUS:
            return {
                    ...state,
                    useBonus:action.value
                };
        case ActionTypes.PUT_QUIZ:
            return {
                    ...state,
                    quizzes: [action.value, ...state.quizzes]
            };
        case ActionTypes.FILTER_QUIZ:
            var betsCopy = [...state.quizzes]
            var filteredCopy = betsCopy.filter(b => b.contestId != action.id);
            return {
                    ...state,
                    quizzes: filteredCopy
            };
        case ActionTypes.CHANGE_QUIZ_OP:
            var betsCopy = [...state.quizzes]
            var index = betsCopy.findIndex(b => b.id == action.id);
            betsCopy[index].selectedOp = action.value;
            return {
                    ...state,
                    quizzes: betsCopy
            };
        case ActionTypes.REPLACE_QUIZ:
            var betsCopy = [...state.quizzes]
            betsCopy[action.oldBetIndex] = action.newBet;
            return {
                ...state,
                quizzes: betsCopy
            }
        case ActionTypes.UPDATE_QUIZ_ODD:
            var betsOddsCopy = [...state.quizes];
            var indexOdds = betsOddsCopy.findIndex(n => n._id === action.betId);
            betsOddsCopy[indexOdds].odds = action.value;
            return {
                    ...state,
                    quizes: betsOddsCopy
                };
        case ActionTypes.DELETE_QUIZ:
            var betsCopy = state.quizes;
            const newBets = betsCopy.filter(b => b._id != action.betId)
            return {
                    ...state,
                    quizes: newBets
                };
        default:
            return state;
      }
}