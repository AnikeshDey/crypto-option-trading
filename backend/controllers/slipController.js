const slipModel = require('../models/slipModel');

//Coin Image
async function activeContest(req, res, next) {
    try {

        const itemCount = 20;
        const page = req.query.page;
        const itemStart = ((page - 1 ) * itemCount);
        const itemEnd = (page * itemCount);
        const userId = req.user._id;

        let contests = await slipModel.typedContest(userId, "active", page, itemStart, itemEnd);

        res.locals.data = contests;
        next();
    } catch (error) {
        next(error);
    }
}

//Coin Image
async function endedContest(req, res, next) {
    try {

        const itemCount = 20;
        const page = req.query.page;
        const itemStart = ((page - 1 ) * itemCount);
        const itemEnd = (page * itemCount);
        const userId = req.user._id;

        let contests = await slipModel.typedContest(userId, "ended", page, itemStart, itemEnd);

        res.locals.data = contests;
        next();
    } catch (error) {
        next(error);
    }
}

//Coin Image
async function submitSlip(req, res, next) {
    try {

        const { slip, entryFee } = req.body;
        const userId = req.user._id;
        const userUn = req.user.displayUsername;
        const userP = req.user.profilePic;

        console.log("1", req.user._id);


        const data = await slipModel.submitSlip(slip, entryFee, userId, userP, userUn);
        
        res.locals.data = data;
        next();
    } catch (error) {
        next(error);
    }
}

async function contestSlipResult(req, res, next) {
    try {

        const { id } = req.params;

        const data = await slipModel.contestSlipResult(id);
        
        res.locals.data = data;
        next();
    } catch (error) {
        next(error);
    }
}

async function contestSlipHistoryResult(req, res, next) {
    try {

        const { id, setId } = req.params;

        const userId = req.user._id;

        const itemsStart = req.query.page == 1 ? 1 : (((req.query.page - 1) * req.query.count) + 1)
        const itemsEnd = req.query.page * req.query.count;

        const data = await slipModel.contestSlipHistoryResult(id, setId, itemsStart, itemsEnd, userId);
        
        res.locals.data = data;
        next();
    } catch (error) {
        next(error);
    }
}

async function fullSlipResult(req, res, next) {
    try {

        const { id, code } = req.params;

        const data = await slipModel.fullSlipResult(id, code);
        
        res.locals.data = data;
        next();
    } catch (error) {
        next(error);
    }
}

async function contestFinalSettlement(req, res, next) {
    try {

        const { contestId } = req.params;

        const data = await slipModel.contestFinalSettlement(contestId);
        
        res.locals.data = data;
        next();
    } catch (error) {
        res.json({message:'Could not settle quiz'});
    }
}

async function revertContestFinalSettlement(req, res, next) {
    try {

        const { contestId } = req.params;

        const data = await slipModel.revertContestFinalSettlement(contestId);
        
        res.locals.data = data;
        next();
    } catch (error) {
        res.json({message:'Could not settle quiz'});
    }
}

//exports 
module.exports = {
    submitSlip,
    activeContest,
    endedContest,
    contestSlipResult,
    contestSlipHistoryResult,
    fullSlipResult,
    contestFinalSettlement,
    revertContestFinalSettlement
}