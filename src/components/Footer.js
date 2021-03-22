import React from 'react';
import '../css/App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHeart} from '@fortawesome/free-solid-svg-icons'

const Footer = () => {
    return (
        <div>
            <footer className={'footer'}>Made With <FontAwesomeIcon className="heart fa-beat" icon={faHeart}/> by Nikhil Naik</footer>
        </div>
    )
}
export default Footer
