const contestModel = require('../models/contestModel');

//Coin Image
async function singleContest(req, res, next) {
    try {

        let id = req.params.id;

        let contest = await contestModel.singleContest(id);
        //console.log("1",contest);

        res.locals.data = {contestData:contest};
        next();
    } catch (error) {
        next(error);
    }
}

async function contestByCode(req, res, next) {
    try {

        let id = req.params.id;

        let code = Number(req.params.code);

        let contest = await contestModel.contestByCode(id, code);
        
        res.locals.data = {contestData:contest};
        next();
    } catch (error) {
        next(error);
    }
}

//Coin Image
async function allContests(req, res, next) {
    try {

        const id = req.params.id;
        const perPage = 20;
        const itemsStart = (req.query.page - 1) * perPage;
        const itemsCount = req.query.page * perPage;

        const tab = req.query.tab;
        const type = req.query.type;
        const sortBy = req.query.sortBy;
        const isAdmin = req.query.admin;

        let userId = req.user._id;

        let contests = await contestModel.allContests(id, tab, type, isAdmin, req.query.page, sortBy, itemsStart, itemsCount, userId);
        
        res.locals.data = contests;
        next();
    } catch (error) {
        next(error);
    }
}

//Coin Image
async function editContest(req, res, next) {
    try {

        let id = req.params.id;

        const { contestName, contestDesc, contestPrize, contestMemberCount, winnerSelection, contestEntryFee} = req.body;

        let contest = await contestModel.editContest(id, contestName, contestDesc, contestPrize, contestMemberCount, winnerSelection, contestEntryFee);
        
        res.locals.data = contest;
        next();
    } catch (error) {
        next(error);
    }
}

//Coin Image
async function setLockPrice(req, res, next) {
    try {

        let id = req.params.id;

        let contest = await contestModel.setLockPrice(id);
        
        res.locals.data = contest;
        next();
    } catch (error) {
        next(error);
    }
}

//Coin Image
async function cancelContest(req, res, next) {
    try {

        let id = req.params.id;

        let contest = await contestModel.cancelContest(id);
        
        res.locals.data = contest;
        next();
    } catch (error) {
        next(error);
    }
}

//Coin Image
async function revertCancelContest(req, res, next) {
    try {

        let id = req.params.id;

        let contest = await contestModel.revertCancelContest(id);
        
        res.locals.data = contest;
        next();
    } catch (error) {
        next(error);
    }
}

//Coin Image
async function submitContest(req, res, next) {
    try {

        const { gameName, contestName, contestDesc, contestPrize, contestCode, contestMemberCount, gameId, winnerSelection, contestEntryFee, timeStamp, gameCur} = req.body;

        let userId = req.user._id;

        let contest = await contestModel.submitContest(gameName, contestName, contestDesc, contestPrize, contestCode, contestMemberCount, gameId, winnerSelection, contestEntryFee, timeStamp, gameCur, userId);
        
        res.locals.data = contest;
        next();
    } catch (error) {
        next(error);
    }
}


//exports 
module.exports = {
    singleContest,
    allContests,
    editContest,
    cancelContest,
    revertCancelContest,
    contestByCode,
    setLockPrice,
    submitContest
}