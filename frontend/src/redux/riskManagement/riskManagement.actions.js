import ActionTypes from './riskManagement.types';

export const putNewRisk = (risk) => ({
    type:ActionTypes.PUT_NEW_RISK,
    risk:risk
});