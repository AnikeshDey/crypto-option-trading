import * as React from "react";
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";

import { setPageType } from '../../redux/page/page.actions';

import MainLayout from '../../layouts/main-layout.component';
import Loader from "../../components/loader/Loader";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";

// import getCountdown from "../../utils/getCountDown";

// import { useSocket } from "../../socket/socket";

import "./SettingsPage.css";


function SettingsPage({ user, token, games, setPageType }) {
    const { t } = useTranslation(["common"]);
    const [isFetching, setIsFetching] = React.useState(true);


    React.useLayoutEffect(() => {
        setPageType('crypto');
      },[]);


  return (
      	<MainLayout goBack={true} title={
            <div className="title">
                <h2>{t("settings")}</h2>
            </div>
          }>
            <div className="settings__container">
                <h1 className="settings__heading">Personal Information</h1>
                <div className="settings__item__container">
                    <div className="settings__item__text-wrapper">
                        <h1 className="settings__item__text-heading">
                            Display my full name on profile
                        </h1>
                        <p className="settings__item__text-para">
                            your full name will be visible to everyone who views your profile
                        </p>
                    </div>
                    <div className="settings__item__input-wrapper">
                        <ToggleSwitch checked={true} handleChange={(e) => {console.log(e.target)}} />
                    </div>
                </div>
                <h1 className="settings__heading">Gameplay</h1>
                <div className="settings__item__container">
                    <div className="settings__item__text-wrapper">
                        <h1 className="settings__item__text-heading">
                            Show my previous teams
                        </h1>
                        <p className="settings__item__text-para">
                            your full name will be visible to everyone who views your profile
                        </p>
                    </div>
                    <div className="settings__item__input-wrapper">
                        <ToggleSwitch checked={true} handleChange={(e) => {console.log(e.target)}} />
                    </div>
                </div>
                <div className="settings__item__container">
                    <div className="settings__item__text-wrapper">
                        <h1 className="settings__item__text-heading">
                            Show which contests i join
                        </h1>
                        <p className="settings__item__text-para">
                            your full name will be visible to everyone who views your profile
                        </p>
                    </div>
                    <div className="settings__item__input-wrapper">
                        <ToggleSwitch checked={true} handleChange={(e) => {console.log(e.target)}} />
                    </div>
                </div>
                <div className="settings__item__container">
                    <div className="settings__item__text-wrapper">
                        <h1 className="settings__item__text-heading">
                            Allow requests
                        </h1>
                        <p className="settings__item__text-para">
                            your full name will be visible to everyone who views your profile
                        </p>
                    </div>
                    <div className="settings__item__input-wrapper">
                        <ToggleSwitch checked={true} handleChange={(e) => {console.log(e.target)}} />
                    </div>
                </div>
                <h1 className="settings__heading">Safety</h1>
                <div className="settings__item__container">
                    <div className="settings__item__text-wrapper">
                        <h1 className="settings__item__text-heading">
                            Manage my safety
                        </h1>
                        <p className="settings__item__text-para">
                            your full name will be visible to everyone who views your profile
                        </p>
                    </div>
                    <div className="settings__item__input-wrapper">
                        <ToggleSwitch checked={true} handleChange={(e) => {console.log(e.target)}} />
                    </div>
                </div>
            </div>
      	</MainLayout>
  );
}

const mapStateToProps = state => ({
    user: state.user.user,
    token: state.user.token,
    games:state.cryptoGame.games
})

const mapDispatchToProps = dispatch => ({
    setPageType: (pageType) => dispatch(setPageType(pageType))
})
  
  
export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
  