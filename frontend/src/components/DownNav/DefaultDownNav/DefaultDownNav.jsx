import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";


import { ReactComponent as SportsIcon } from '../../../assets/crypto.svg';
import { ReactComponent as HomeIcon } from '../../../assets/home14final.svg';
import { ReactComponent as ActiveIcon } from '../../../assets/active_portfolio.svg';
import { ReactComponent as EndedIcon } from '../../../assets/ended_portfolio.svg';
import { ReactComponent as WalletIcon } from '../../../assets/wallet.svg';
import { ReactComponent as StatsIcon } from '../../../assets/stats.svg';
import { ReactComponent as MoreIcon } from '../../../assets/more.svg';
import { ReactComponent as LessIcon } from '../../../assets/less.svg';
import { ReactComponent as SettingsIcon } from '../../../assets/settings.svg';
import { ReactComponent as LogoutIcon } from '../../../assets/logout.svg';

import Modal from "../../../components/modal/Modal";


import { userLogout } from '../../../redux/user/user.actions';

const DefaultDownNav = ({ user, logout, wallet }) => {
	const [isWalletModalOpen, setWalletModalOpen] = React.useState(false);
	const [isMoreOpen, setMoreOpen] = React.useState(false)
    const handleLogout = (e) => {
		e.preventDefault();
		logout();
	}
    return <nav className='down-nav d-lg-none d-md-none d-sm-flex sticky-bottom'>
	{!isMoreOpen && <>
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
		<NavLink to={'/crypto-overview'} data-toggle="tooltip" data-placement="top" title="Options" className={({ isActive }) =>
              isActive ? "blue" : undefined
            }>
			<SportsIcon className="nav__icon" />
			<span>Events</span>
		</NavLink>
		<NavLink to='/my-active-contest' data-toggle="tooltip" data-placement="top" title="Active Portfolio" className={({ isActive }) =>
              isActive ? "blue" : undefined
            }>
			<ActiveIcon className="nav__icon" />
			<span>Active</span>
		</NavLink>
		<NavLink to='/my-ended-contest' data-toggle="tooltip" data-placement="top" title="Ended Portfolio" className={({ isActive }) =>
              isActive ? "blue" : undefined
            }>
			<EndedIcon className="nav__icon" />
			<span>Ended</span>
		</NavLink>
		{wallet ? <NavLink to='/my-wallet' data-toggle="tooltip" data-placement="top" title="User Wallet" className={({ isActive }) =>
				  isActive ? "blue" : undefined
				}>
				<WalletIcon className="nav__icon" />
				<span>Wallet</span>
		</NavLink>
		:
		<button data-toggle="tooltip" data-placement="top" title="Wallet" onClick={() => setWalletModalOpen(true)}>
				<WalletIcon className="nav__icon" />
				<span>Wallet</span>
		</button>
		}
		
		<button data-toggle="tooltip" data-placement="top" title="More" onClick={() => setMoreOpen(true)}>
			<MoreIcon className="nav__icon" />
			<span>More</span>
		</button>
		</>
	}
	
	{
		isMoreOpen && <>
			<NavLink to={'/'} data-toggle="tooltip" data-placement="top" title="Home" className={({ isActive }) =>
              isActive ? "blue" : undefined
            }>
				<HomeIcon className="nav__icon" />
				<span>Home</span>
			</NavLink>
			<NavLink to='/my-stats' data-toggle="tooltip" data-placement="top" title="User Stats" className={({ isActive }) =>
              isActive ? "blue" : undefined
            }>
				<StatsIcon className="nav__icon" />
				<span>Stats</span>
			</NavLink>
			<NavLink to='/my-settings' data-toggle="tooltip" data-placement="top" title="Settings" className={({ isActive }) =>
				  isActive ? "blue" : undefined
				}>
				<SettingsIcon className="nav__icon" />
				<span>Settings</span>
			</NavLink>
			<button data-toggle="tooltip" data-placement="top" title="Logout" onClick={handleLogout}>
				<LogoutIcon className="nav__icon" />
				<span>Logout</span>
			</button>
			<button data-toggle="tooltip" data-placement="top" title="More" onClick={() => setMoreOpen(false)}>
				<LessIcon className="nav__icon red" />
				<span className="red">Less</span>
			</button>
		</>
	}
    </nav>
}

const mapStateToProps = state => ({
    user: state.user.user,
	wallet: state.user.wallet
})

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(userLogout())
})


export default connect(mapStateToProps, mapDispatchToProps)(DefaultDownNav);