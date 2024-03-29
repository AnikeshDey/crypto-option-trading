import * as React from 'react';
import { Link, useNavigate } from "react-router-dom";

import { ReactComponent as MoreIcon } from '../../../assets/menu.svg';

import Menu from '../../menu/Menu';


const CryptoHeader = ({ goBack, title }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)

    const navigate = useNavigate();

    function useOutsideAlerter(ref) {
		React.useEffect(() => {
		  /**
		   * Alert if clicked on outside of element
		   */
		  function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
			  setIsMenuOpen(false);
			}
		  }
		  // Bind the event listener
		  document.addEventListener("mousedown", handleClickOutside);
		  return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside);
		  };
		}, [ref]);
	  }

	const wrapperRef = React.useRef(null);
  	useOutsideAlerter(wrapperRef);

    return <div className='titleContainer sticky-top'>
        {
          goBack ? (<div className='logo' onClick={() => navigate(-1)}>
            <i className="fa fa-arrow-left-long" />
          </div>) : (
            <Link className="logo" to={`/`}>
                <i className='fas fa-dove'></i>
            </Link>
          )
        }

        {
          title ? title
          :
          <div className="searchBarContainer searchBarContainer__header">
            <i className="fas fa-search"></i>
            <input id="searchBox" type="text" name="searchBox" placeholder="Search" />
            <select>
              <option>Events</option>
              <option>Users</option>
              <option>Posts</option>
            </select>
          </div>
        }

        <div className="header-options" ref={wrapperRef}>
            <button onClick={() => isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true)}>
              <MoreIcon />
            </button>
            {isMenuOpen && <div className="menu-popup" >
                <Menu />
            </div>}
        </div>
    </div>
} 

export default CryptoHeader;