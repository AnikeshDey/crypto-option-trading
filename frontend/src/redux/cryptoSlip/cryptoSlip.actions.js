import ActionTypes from './cryptoSlip.types';


export const setTotalCost = (value) => ({
    type:ActionTypes.SET_TOTAL_COST,
    value: value
});

export const setErrorMessage = (msg) => ({
    type:ActionTypes.SET_ERROR_MESSAGE,
    errorMessage:msg
});

export const setErrorValue = (value) => ({
    type:ActionTypes.SET_ERROR_VALUE,
    value:value
});

export const putQuiz = (bet) => ({
    type:ActionTypes.PUT_QUIZ,
    value: bet
});

export const filterQuiz = (id) => ({
    type:ActionTypes.FILTER_QUIZ,
    id: id
});

export const changeQuizOp = (id, value) => ({
    type:ActionTypes.CHANGE_QUIZ_OP,
    id: id,
    value:value
});

export const replaceQuiz = (index, bet) => ({
    type:ActionTypes.REPLACE_QUIZ,
    oldBetIndex: index,
    newBet: bet
});

export const updateQuizOdds = (betId, odds) => ({
    type:ActionTypes.UPDATE_QUIZ_ODD,
    betId:betId,
    value: odds
});


export const deleteQuiz = (betId) => ({
    type:ActionTypes.DELETE_QUIZ,
    betId:betId
});

export const calculateTotalCost = () => ({
    type:ActionTypes.CALCULATE_TOTAL_COST
});

export const clearSlip = (id) => ({
    type:ActionTypes.CLEAR_SLIP,
    contestId:id
});


export const setUseBonus = (value) => ({
    type:ActionTypes.SET_USE_BONUS,
    value: value
});