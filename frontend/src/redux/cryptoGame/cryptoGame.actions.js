import ActionTypes from "./cryptoGame.types";

export const setNewGames = (games) => ({
    type:ActionTypes.SET_NEW_GAMES,
    games: games
});

export const updateGamePrice = (data) => ({
    type:ActionTypes.UPDATE_GAME_PRICE,
    data:data
});
