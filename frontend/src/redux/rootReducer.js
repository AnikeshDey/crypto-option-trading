import { combineReducers } from 'redux';

import { userReducer } from './user/user.reducer';
import { postReducer } from './post/post.reducer';
// import { gameReducer } from './game/game.reducer';
import { notificationReducer } from './notification/notification.reducer';
// import { oddTypeReducer } from './oddType/oddType.reducer';
// import { resultReducer } from './result/result.reducer';
// import { betslipReducer } from './betslip/betslip.reducer';
import { cryptoSlipReducer } from './cryptoSlip/cryptoSlip.reducer';
import { cryptoGameReducer } from './cryptoGame/cryptoGame.reducer';
// import { contestReducer } from './contestSlip/contestslip.reducer';
import { pageReducer } from './page/page.reducer';
// import { preGameReducer } from './pregame/pregame.reducer';
import { riskReducer } from './riskManagement/riskManagement.reducer';
import { contestResultReducer } from './contestResult/contestResult.reducer';


export const rootReducer = combineReducers({
    notification:notificationReducer,
    user: userReducer,
    post: postReducer,
    cryptoSlip: cryptoSlipReducer,
    cryptoGame:cryptoGameReducer,
    page: pageReducer,
    risk:riskReducer,
    contestResult:contestResultReducer
})