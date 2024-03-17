import * as React from "react";
import { connect } from "react-redux";

import { useTranslation } from "react-i18next";
import i18next from "i18next";


// Header
import CryptoHeader from '../components/Headers/cryptoHeader/CryptoHeader';

// LeftSideBar
import DefaultLeftSideBar from '../components/LeftSideBars/defaultLeftSidebar/DefaultLeftSideBar';


// RightSideBar
import DefaultRightSideBar from "../components/RightSideBar/DefaultRightSideBar/DefaultRightSideBar";


// DownNav
import DefaultDownNav from "../components/DownNav/DefaultDownNav/DefaultDownNav";


function MainLayout({ children, user, goBack, title }) {

	const { i18n, t } = useTranslation(["common"]);

	React.useEffect(() => {
		if (localStorage.getItem("i18nextLng")?.length > 2) {
			i18next.changeLanguage("en");
		}
	}, []);

	const handleLanguageChange = (event) => {
		i18n.changeLanguage(event.target.value);
	}
	return (
		user && <>
			<div className='wrapper'>
				<div className='row'>
					<DefaultLeftSideBar />
					<div className='mainSectionContainer col-12 col-md-8 col-lg-6'>
						<CryptoHeader goBack={goBack} title={title} />
						{children}
						
					</div>
					<DefaultRightSideBar />
				</div>
				<DefaultDownNav />
				
			</div>
			<div className='notificationList'>

			</div>
		</>
	);
}

const mapStateToProps = state => ({
    user: state.user.user
})
  
  
export default connect(mapStateToProps)(MainLayout);


{/* <select className="nav-link bg-light border-0 ml-1 mr-2" 
						value={localStorage.getItem("i18nextLng")}
						onChange={handleLanguageChange}>
							<option value="en">English</option>
							<option value="bn">বাংলা</option>
							<option value="es">español</option>
							<option value="fr">français</option>
							<option value="hi">हिन्दी</option>
							<option value="zh">汉语</option>
						</select> */}
