import React from 'react';
import '../css/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'


const Navbar = ({active, onMenuClick}) => {

	return (
		<header>
			<div id="menu" onClick={() => onMenuClick(!active)}>
			<FontAwesomeIcon icon={faBars} />
			</div>
		</header>

		)
}

export default Navbar
