const cryptoModel = require('../models/cryptoModel');

//Coin Image
async function singleCoin(req, res, next) {
    try {

        let id = req.params.id;

        let coin = await cryptoModel.singleCoin(id);
        
        res.locals.data = coin;
        next();
    } catch (error) {
        next(error);
    }
}

//Coin Image
async function allCoins(req, res, next) {
    try {

        let coins = await cryptoModel.allCoins();
        
        res.locals.data = coins;
        next();
    } catch (error) {
        next(error);
    }
}



//exports 
module.exports = {
    singleCoin,
    allCoins
}