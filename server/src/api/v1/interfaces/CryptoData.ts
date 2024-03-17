interface CryptoData {
    id: string;
    nM: string;
    fnM: string;
    tG: string;
    pR: number;
    pRc: string;
    pRcP: string;
    mC: number;
    mCr: number;
    mCC: number;
    mCCP: number;
    vol: number;
    fDV: number;
    h_24: number;
    l_24: number;
    cS: number;
    tS: number;
    mS: number | null;
    ath: number;
    athCP: number;
    athD: string;
    atl: number;
    atlCP: number;
    atlD: string;
    roi: any;
    updatedAt: string;
}

export { CryptoData };