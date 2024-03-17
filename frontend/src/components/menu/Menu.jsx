import React from "react";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { FcAndroidOs } from 'react-icons/fc';

import './Menu.css';

const Menu = () => {
    const { t } = useTranslation(["common"]);
    return <div className="menu__container">
        <h2 className="menu__title">
            {t("menu")}
        </h2>
        <Link to={`/`} className="menu__item">
            <div className="menu__item__icon">
                <FcAndroidOs />
            </div>
            <div className="menu__item__text">
                <h2 className="menu__item__text__title">
                    Home
                </h2>
                <p className="menu__item__text__desc">
                    This is the home page.
                </p>
            </div>
        </Link>
        <Link to={`/`} className="menu__item">
            <div className="menu__item__icon">
                <FcAndroidOs />
            </div>
            <div className="menu__item__text">
                <h2 className="menu__item__text__title">
                    Home
                </h2>
                <p className="menu__item__text__desc">
                    This is the home page.
                </p>
            </div>
        </Link>
        <Link to={`/`} className="menu__item">
            <div className="menu__item__icon">
                <FcAndroidOs />
            </div>
            <div className="menu__item__text">
                <h2 className="menu__item__text__title">
                    Home
                </h2>
                <p className="menu__item__text__desc">
                    This is the home page.
                </p>
            </div>
        </Link>
        <Link to={`/`} className="menu__item">
            <div className="menu__item__icon">
                <FcAndroidOs />
            </div>
            <div className="menu__item__text">
                <h2 className="menu__item__text__title">
                    Home
                </h2>
                <p className="menu__item__text__desc">
                    This is the home page.
                </p>
            </div>
        </Link>
        <Link to={`/`} className="menu__item">
            <div className="menu__item__icon">
                <FcAndroidOs />
            </div>
            <div className="menu__item__text">
                <h2 className="menu__item__text__title">
                    Home
                </h2>
                <p className="menu__item__text__desc">
                    This is the home page.
                </p>
            </div>
        </Link>
        <Link to={`/`} className="menu__item">
            <div className="menu__item__icon">
                <FcAndroidOs />
            </div>
            <div className="menu__item__text">
                <h2 className="menu__item__text__title">
                    Home
                </h2>
                <p className="menu__item__text__desc">
                    This is the home page.
                </p>
            </div>
        </Link>
        <Link to={`/`} className="menu__item">
            <div className="menu__item__icon">
                <FcAndroidOs />
            </div>
            <div className="menu__item__text">
                <h2 className="menu__item__text__title">
                    Home
                </h2>
                <p className="menu__item__text__desc">
                    This is the home page.
                </p>
            </div>
        </Link>
    </div>
}

export default Menu;