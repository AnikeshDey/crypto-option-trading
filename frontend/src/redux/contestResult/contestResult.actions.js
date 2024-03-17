import ActionTypes from './contestResult.types';

export const putNewResult = (key, value) => ({
    type:ActionTypes.PUT_NEW_RESULT,
    key:key,
    result:value
});

export const deleteResult = (key) => ({
    type:ActionTypes.DELETE_RESULT,
    key:key
});

export const deleteAllResults = () => ({
    type:ActionTypes.DELETE_ALL_RESULTS
});