import ActionTypes from './user.types';

export const userLogin = (user, token) => ({
    type:ActionTypes.USER_LOGIN,
    user:user,
    token:token
});

export const setUserWallet = (wallet) => ({
    type:ActionTypes.SET_USER_WALLET,
    wallet:wallet
})

export const setUserStats = (key, stats) => ({
    type:ActionTypes.SET_USER_STATS,
    key:key,
    stats:stats
})

export const userLogout = () => ({
    type:ActionTypes.USER_LOGOUT,
});