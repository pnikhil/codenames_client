import React from 'react';
import '../css/App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHeart, faCode} from '@fortawesome/free-solid-svg-icons'

const Footer = () => {
    return (
        <div>
            <footer className={'footer'}><FontAwesomeIcon className="fa-beat" icon={faCode}/> with <FontAwesomeIcon className="heart fa-beat" icon={faHeart}/> by <a href={"https://github.com/pnikhil"} target={"_blank"} rel="noopener noreferrer">Nikhil Naik</a></footer>
        </div>
    )
}
export default Footer
