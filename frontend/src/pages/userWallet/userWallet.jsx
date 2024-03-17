import * as React from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
 
import { connect } from "react-redux";

import { setPageType } from '../../redux/page/page.actions';
import { setUserStats } from '../../redux/user/user.actions';

import MainLayout from '../../layouts/main-layout.component';
import Loader from "../../components/loader/Loader";


function UserWallet({ token, stats, wallet, setPageType, setUserStats }) {
    const [isFetching, setIsFetching] = React.useState(true);


    const { t } = useTranslation(["common"]);
  return (
      	<MainLayout goBack={true} title={
            <div className="title">
                <h2>{t("my__wallet")}</h2>
            </div>
        }>
            <div className="resultsContainer">
                

                <div className="user-wallet__wrapper">
                    <div className="user-wallet__total__container">
                            <h1 className="user-wallet__total__heading">
                                {t("total__balance")}
                            </h1>
                            <p className="user-wallet__total__blnc">
                                {parseFloat(wallet.cb + wallet.wb).toFixed(2)}
                            </p>
                            <div className="user-wallet__total__btn__container">
                                <Link to={"/add-balance"} className="user-wallet__total__btn">
                                    {t("add__balance")}
                                </Link>
                                <Link to={"/withdraw-balance"} className="user-wallet__total__btn">
                                    {t("withdraw__balance")}
                                </Link>
                                <Link to={"/transfer-balance"} className="user-wallet__total__btn">
                                    {t("transfer__balance")}
                                </Link>
                            </div>
                            
                    </div>
                    <div className="user-wallet__item__container">
                        <h1 className="user-wallet__item__heading">
                            {t("total__winning__balance")}
                        </h1>
                        <p className="user-wallet__item__amount">
                         {parseFloat(wallet.wb).toFixed(2)}
                        </p>
                    </div>
                    <div className="user-wallet__item__container">
                        <h1 className="user-wallet__item__heading">
                            {t("total__deposited__balance")}
                        </h1>
                        <p className="user-wallet__item__amount">
                            {parseFloat(wallet.cb).toFixed(2)}
                        </p>
                    </div>
                    <div className="user-wallet__item__container">
                        <h1 className="user-wallet__item__heading">
                            {t("total__winning__bonus")}
                        </h1>
                        <p className="user-wallet__item__amount">
                            {parseFloat(wallet.bw).toFixed(2)}
                        </p>
                    </div>
                    <div className="user-wallet__item__container">
                        <h1 className="user-wallet__item__heading">
                            {t("total__deposited__bonus")}
                        </h1>
                        <p className="user-wallet__item__amount">
                            {parseFloat(wallet.bo).toFixed(2)}
                        </p>
                    </div>
                    <br />
                    
                    <Link to={"/my-transaction/deposite"} className="user-wallet__link__container">
                            <p className="user-wallet__link__text">{t("my__transactions")}</p>
                            <span className="user-wallet__link__icon"><i className="fa fa-chevron-right"></i></span>
                    </Link>
                    <Link to={"/"} className="user-wallet__link__container">
                            <p className="user-wallet__link__text">{t("manage__payments")}</p>
                            <span className="user-wallet__link__icon"><i className="fa fa-chevron-right"></i></span>
                    </Link>
                    <Link to={"/"} className="user-wallet__link__container">
                            <p className="user-wallet__link__text">{t("refer__and__earn")}</p>
                            <span className="user-wallet__link__icon"><i className="fa fa-chevron-right"></i></span>
                    </Link>
                </div>
                
            </div>
      	</MainLayout>
  );
}

const mapStateToProps = state => ({
    token: state.user.token,
    wallet:state.user.wallet,
    stats:state.user.stats
})

const mapDispatchToProps = dispatch => ({
    setPageType: (pageType) => dispatch(setPageType(pageType)),
    setUserStats: (key, stats) => dispatch(setUserStats(key, stats))
})
 

export default connect(mapStateToProps, mapDispatchToProps)(UserWallet);