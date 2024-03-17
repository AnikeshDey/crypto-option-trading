import React from "react";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";

import { ReactComponent as CryptoIcon } from '../../../assets/crypto.svg';
import { ReactComponent as HomeIcon } from '../../../assets/home14final.svg';
import { ReactComponent as StatsIcon } from '../../../assets/stats.svg';
import { ReactComponent as ActiveIcon } from '../../../assets/active_portfolio.svg';
import { ReactComponent as EndedIcon } from '../../../assets/ended_portfolio.svg';

import { ReactComponent as WalletIcon } from '../../../assets/wallet.svg';
import { ReactComponent as SettingIcon } from '../../../assets/settings.svg';
import { ReactComponent as LogoutIcon } from '../../../assets/logout.svg';

import Modal from "../../../components/modal/Modal";     


import { userLogout } from '../../../redux/user/user.actions';

const DefaultLeftSideBar = ({ notifications, user, wallet, logout }) => {
	const [isWalletModalOpen, setWalletModalOpen] = React.useState(false);
    const handleLogout = (e) => {
		e.preventDefault();
		logout();
	}
	
	const handleWallet = (e) => {
		e.preventDefault();
		setWalletModalOpen(true);
	}
    
	return <>
		{isWalletModalOpen && <Modal
            show={isWalletModalOpen} 
            onCancel={() => setWalletModalOpen(false)}
            header={"Create Wallet"}
            footer={<></>}
        >
            <h3>
				You don't have a wallet. Create a wallet to continue.
			</h3>
			<button className="btn btn-sm btn-primary">
				Create Wallet
			</button>
        </Modal>
        }
        <nav className='col-2 d-none d-md-flex'>
            <Link className='blue' to='/'>
                <i className='fas fa-dove'></i>
            </Link>
            <NavLink to='/' data-toggle="tooltip" data-placement="right" title="Home" className={({ isActive }) =>
              isActive ? "blue" : undefined
            }>
                <HomeIcon className="nav__icon" />
            </NavLink>
            <NavLink to='/crypto-overview' data-toggle="tooltip" data-placement="right" title="Options Portfolio" className={({ isActive }) =>
              isActive ? "blue" : undefined
            }>
                <CryptoIcon className="nav__icon" />
            </NavLink>
            <NavLink to='/my-active-contest' data-toggle="tooltip" data-placement="right" title="Active Portfolio" className={({ isActive }) =>
              isActive ? "blue" : undefined
            }>
                <ActiveIcon className="nav__icon" />
            </NavLink>
            <NavLink to='/my-ended-contest' data-toggle="tooltip" data-placement="right" title="Ended Portfolio" className={({ isActive }) =>
              isActive ? "blue" : undefined
            }>
                <EndedIcon className="nav__icon" />
            </NavLink>
            <NavLink to='/my-stats' data-toggle="tooltip" data-placement="right" title="User Stats" className={({ isActive }) =>
              isActive ? "blue" : undefined
            }>
                <StatsIcon className="nav__icon" />

            </NavLink>
            {wallet ? <NavLink to='/my-wallet' data-toggle="tooltip" data-placement="right" title="User Wallet" className={({ isActive }) =>
              isActive ? "blue" : undefined
            }>
                <WalletIcon className="nav__icon" />
            </NavLink>
			:
			<NavLink onClick={handleWallet} to='/wallet' data-toggle="tooltip" data-placement="right" title="User Wallet" className={({ isActive }) =>
              isActive ? "blue" : undefined
            }>
                <WalletIcon className="nav__icon" />
            </NavLink>
			}
            <NavLink to='/settings' data-toggle="tooltip" data-placement="right" title="Settings" className={({ isActive }) =>
              isActive ? "blue" : undefined
            }>
                <SettingIcon className="nav__icon" />
            </NavLink>
            <NavLink onClick={handleLogout} to='/logout' data-toggle="tooltip" data-placement="right" title="Logout" className={({ isActive }) =>
              isActive ? "blue" : undefined
            }>
                <LogoutIcon />
            </NavLink>
        </nav>
    </>
}

const mapStateToProps = state => ({
    notifications: state.notification.notifications,
    user: state.user.user,
	wallet: state.user.wallet
})

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(userLogout())
})

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLeftSideBar);