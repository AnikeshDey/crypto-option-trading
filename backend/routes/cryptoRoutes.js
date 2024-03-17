const express = require("express");
const router = express.Router();

//Controllers
const userController = require('../controllers/userController');
const cryptoController = require('../controllers/cryptoController');
const contestController = require('../controllers/contestController');
const slipController = require('../controllers/slipController');

const imageController = require('../controllers/imageController');


const middleware = require('../middleware/auth');
const responseHandler = require("../middleware/responseHandler");

/* Logout GET Routes */
router.get('/logout', userController.logout, responseHandler); //single coin xl image


/* Image GET Routes */

router.get('/images/coins/large/:id', imageController.coinImageLarge, responseHandler); //single coin xl image
router.get('/images/coins/small/:id', imageController.coinImageSmall, responseHandler); //single coin sm image


/* User GET Routes */

router.get('/api/users/gaming-wallet', middleware.requireLogin, userController.gamingWallet, responseHandler); //single coin option fetch
router.get('/api/users/my-gaming-transactions', middleware.requireLogin, userController.gamingTransactions, responseHandler); //getting users gaming transaction
router.get('/api/users/single-gaming-transaction/:id', middleware.requireLogin, userController.gamingSingleTransaction, responseHandler); //getting users single gaming transaction
router.get('/api/users/user-stats', middleware.requireLogin, userController.userStats, responseHandler); //getting users gaming stats


/* User POST Routes */

router.post('/api/users/deposite-balance', middleware.requireLogin, userController.depositeBalance, responseHandler); //If user wants to deposit balance
router.post('/api/users/withdraw-balance', middleware.requireLogin, userController.withdrawBalance, responseHandler); //If user wants to withdraw balance
router.post('/api/users/transfer-balance'); //If user wants to transfer balance with other users
router.post('/api/users/transfer-self', middleware.requireLogin, userController.transferSelf, responseHandler); //If user wants to transfer balance to self


/* Crypto GET Routes */

router.get('/api/crypto/get-single-option/:id', middleware.requireLogin, cryptoController.singleCoin, responseHandler);
router.get('/api/crypto/get-crypto-options', middleware.requireLogin, cryptoController.allCoins, responseHandler);


/* Contest GET Routes */

router.get('/api/contests/:id', middleware.requireLogin, contestController.allContests, responseHandler);
router.get('/api/contests/single/:id', middleware.requireLogin, contestController.singleContest, responseHandler);
router.get('/api/contests/:id/:code', middleware.requireLogin, contestController.contestByCode, responseHandler);


/* Contest POST Routes */

router.post('/api/contests/edit-contest/:id', middleware.requireLogin, contestController.editContest, responseHandler);
router.post('/api/contests/set-lock-price/:id', middleware.requireLogin, contestController.setLockPrice, responseHandler);
router.put('/api/contests/cancel-contest/:id', middleware.requireLogin, contestController.cancelContest, responseHandler);
router.put('/api/contests/revert-cancel-contest/:id', middleware.requireLogin, contestController.revertCancelContest, responseHandler);

router.post('/api/contests/submit-contest', middleware.requireLogin, contestController.submitContest, responseHandler);

/* Slip GET Routes */

router.get('/api/quiz/active-contest', middleware.requireLogin, slipController.activeContest, responseHandler);
router.get('/api/quiz/ended-contest', middleware.requireLogin, slipController.endedContest, responseHandler);
router.get('/api/quiz/my-contest/:id', middleware.requireLogin, contestController.singleContest, responseHandler);
router.get('/api/quiz/contest-slip-result/:id', middleware.requireLogin, slipController.contestSlipResult, responseHandler);
router.get('/api/quiz/contest-slip-history-result/:id/:setId', middleware.requireLogin, slipController.contestSlipHistoryResult, responseHandler);
router.get('/api/quiz/full-slip-result/:id/:code', middleware.requireLogin, slipController.fullSlipResult, responseHandler);

router.get('/api/quiz/contest-final-settlement/:contestId', middleware.requireLogin, slipController.contestFinalSettlement, responseHandler);
router.get('/api/quiz/revert-contest-final-settlement/:contestId', middleware.requireLogin, slipController.revertContestFinalSettlement, responseHandler);



/* Slip POST Routes */



router.post('/api/quiz/submit-quiz', middleware.requireLogin, slipController.submitSlip, responseHandler);




// Routes
// const logoutRoute = require('./routes/logout');
// const uploadRoute = require('./routes/uploadRoutes');
// const imagesRoute = require('./routes/images');


// // Api routes
// const usersApiRoute = require('./routes/api/sports/front/users');
// const submitContestApiRoute = require('./routes/api/cryptoOptions/front/submit-contest');
// const submitQuizApiRoute = require('./routes/api/cryptoOptions/front/submit-quiz');
// const quizApiRoute = require('./routes/api/cryptoOptions/front/quiz-api');
// const cryptoApiRoute = require('./routes/api/cryptoOptions/front/crypto');
// const contestApiRoute = require('./routes/api/cryptoOptions/front/contests');
// const contestHistoryApiRoute = require('./routes/api/sports/front/contest-history');
// const eventApiRoute = require('./routes/api/sports/front/events');
// const adminApiRoute = require('./routes/api/sports/admin/admin');
// const sportsBookApiRoute = require('./routes/api/sports/admin/sportsBook');


// app.use("/logout", logoutRoute);
// app.use("/uploads", uploadRoute);
// app.use('/images', imagesRoute);

// app.use("/api/users", middleware.requireLogin, usersApiRoute);
// app.use("/api/crypto/submit-contest", middleware.requireLogin, submitContestApiRoute);
// app.use("/api/crypto/submit-quiz", middleware.requireLogin, submitQuizApiRoute);
// app.use("/api/quiz", middleware.requireLogin, quizApiRoute);
// app.use("/api/crypto", middleware.requireLogin, cryptoApiRoute);
// app.use("/api/contests", middleware.requireLogin, contestApiRoute);
// app.use("/api/contest-history", middleware.requireLogin, contestHistoryApiRoute);
// app.use("/api/events", middleware.requireLogin, eventApiRoute);
// app.use("/api/admin", adminApiRoute);
// app.use("/api/admin/sports-book", middleware.requireLogin, sportsBookApiRoute);

// Add other routes as needed

//export to app.js where base route is created
module.exports = router;