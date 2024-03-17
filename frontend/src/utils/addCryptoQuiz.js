import { store } from "../redux/store"

//import { putBet, replaceBet, setErrorMessage } from "../redux/betslip/betslip.actions";
import { putQuiz, replaceQuiz } from "../redux/cryptoSlip/cryptoSlip.actions";

export const addQuiz = (bet, bets) => {
        //console.log(bet);
    const foundBetIndex = bets.findIndex(b => (b.contestId == bet.contestId));
    if(foundBetIndex < 0){
        store.dispatch(putQuiz(bet));
    } else{
        store.dispatch(replaceQuiz(foundBetIndex, bet));
    }  
}