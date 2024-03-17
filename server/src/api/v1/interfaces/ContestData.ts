interface ContestData {
    _id: string;
    gameId: string;
    gameName: string;
    gameCur: string;
    contestName: string;
    contestDesc: string;
    contestPool: number;
    contestSize: number;
    contestCode: string;
    entryFee: number;
    winnerSelection: string;
    contestType: string;
    joined: number;
    status: string;
    user: string;
    canSettle: true | false;
    isSettled: true | false;
    lockPrice: number | string;
    timeStamp: number;
    createdAt: number;
    endTime: number;
    settleTime: number;
}

export { ContestData };
  