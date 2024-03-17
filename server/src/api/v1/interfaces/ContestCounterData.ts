interface ContestCounterData {
    pk: string; // contestId
    users: number; // total number of registered users
    posts: number; // total number of posts
    spAS: number; // sports Active Slips
    spHS: number; // sports Historical Slips -- basically older than 10 days
    spAC: number; // sports Active Contests
    spEC: number; // sports Ended Contests -- basically older than 10 days
    p2pBS: number; // peer-to-peer Buy Sell in crypto payment gateway
}

export { ContestCounterData };