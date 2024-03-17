const userModel = require('../models/userModel');

const { connectSocket } = require('../socket/socket');


//gamingWallet
async function gamingWallet(req, res, next) {
    try {
        const uId = req.user._id;
        const RESgamingWallet = await userModel.gamingWallet(uId, req.query.full);
        res.locals.data = RESgamingWallet;
        next();
    } catch (error) {
        next(error);
    }
}

//gamingWallet
async function gamingTransactions(req, res, next) {
        try{

            const uId = req.user._id;
    
            var page = req.query.page;
            console.log("page:", page);
            var itemCount = 20;
            var start = (Number(page) - 1) * itemCount;
            var end = Number(page) * itemCount;
    
            let transactions = await userModel.gamingTransactions(uId, req.query.tab, start, end);

            res.locals.data = transactions;
            next();
    
    
        } catch(err){
            next(err);
        } 
        
    
}

async function gamingSingleTransaction(req, res, next) {
    try{

        const id = req.params.id;
        const type = req.query.type;


        let transaction = await userModel.gamingSingleTransaction(id, type);

        res.locals.data = transaction;
        next();


    } catch(err){
        next(err);
    } 
    

}

async function userStats(req, res, next) {
    try{

        const uId = req.user._id;

        const timeRange = req.query.timeRange;

        let gameStats = {
            contestObject : {},
            sportObject : {},
            matchesWon : 0,
            matchesLost : 0,
            matchesPlayed : 0,
            totalMoneyWon : 0,
            totalMoneyLost : 0,
            wins : [],
            losses : []
        }

        let exists = await userModel.checkIfUserExists(uId);

        if(!exists){
            res.locals.data = gameStats;
            next();
        }

        const dateStart = new Date(new Date().getTime() - (timeRange * 60 * 60 * 1000));

        const dateEnd = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));

        let stats = await userModel.userStats(uId, gameStats, dateStart, dateEnd);

        res.locals.data = stats;
        next();

    } catch(err){
        next(err);
    } 
    

}


//gamingWallet
async function depositeBalance(req, res, next) {
    try {
        const uId = req.user._id;
        const { amount, balanceType } = req.body;
        const RESgamingWallet = await userModel.depositeBalance(uId, balanceType.toLowerCase(), amount);
        res.locals.data = RESgamingWallet;
        next();
    } catch (error) {
        next(error);
    }
}

//gamingWallet
async function transferSelf(req, res, next) {
    try {
        const uId = req.user._id;
        const { amount } = req.body;
        const RESgamingWallet = await userModel.transferSelf(uId, amount);
        res.locals.data = RESgamingWallet;
        next();
    } catch (error) {
        next(error);
    }
}

//gamingWallet
async function withdrawBalance(req, res, next) {
    try {
        const uId = req.user._id;
        const { amount, withdrawFrom, withdrawTo } = req.body;
        const RESgamingWallet = await userModel.depositeBalance(uId, withdrawFrom, withdrawTo.toLowerCase(), amount);
        res.locals.data = RESgamingWallet;
        next();
    } catch (error) {
        next(error);
    }
}

//gamingWallet
async function logout(req, res, next) {
    try{
		
		let { un } = req.body;
		
		console.log("logout req came...........................", un);
		
		un = un.toString().replaceAll(" ", "+");
		
		const userId = decryptData(un);
		
		console.log("logout req came...........................", userId);
		
		const socket = connectSocket();
		//console.log(socket);
		if(socket){
			socket.to(userId).emit("user-logout", userId);
		} else {
			return res.sendStatus(400);
		}

        res.locals.data = {msg: "success"};
        next();
	} catch(err){
		next(err);
	}
}

//exports 
module.exports = {
    gamingWallet,
    gamingTransactions,
    gamingSingleTransaction,
    userStats,
    depositeBalance,
    transferSelf,
    withdrawBalance,
    logout
}