import React, {useState} from 'react';
import {Link} from 'react-router-dom'
import Switch from "react-switch";
import randomWords from 'random-words'
import Button from './Button'
import '../css/Forms.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCopy} from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';



const Join = () => {

    const [name, setName] = useState('')
    const [channel, setChannel] = useState('')
    const [spymaster, setSpymaster] = useState(false)
    toast.configure();

    const handleSubmit = (e) => {
        if (!name || !channel) {
            e.preventDefault()
        } else {
            const game = {name, channel, spymaster}
            sessionStorage.setItem('game', JSON.stringify(game));

            return null
        }
    }

    const switchProps = {
        onColor: '#8bc34a',
        offColor: '#ff0000',
        activeBoxShadow: '0 0 0px 3px #1d1d32'
    };

    const generateWord = () =>{
        setChannel(randomWords({ exactly: 2, join: '-' }));
    };

    const copyUrl = () =>{
        navigator.clipboard.writeText(window.location.href + 'play/' + channel);
        toast.info("URL copied to the clipboard!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
            closeOnClick: true
        });
    };

    return (

        <div className="page-container">
            <div>
                <div className="title">
                    <h4>Codenames</h4>
                </div>
                <div className={'form-wrapper'}>
                    <form onSubmit={handleSubmit} className="form">

                        <input type="text" id='name-input' placeholder="Your Name" className="nameInput"
                               onChange={(e) => setName(e.target.value)}/>
                        <input type="text" id='channel-input' placeholder="Channel name" className="channelInput" value={channel}
                               onChange={(e) => setChannel(e.target.value)}/>
                        <button type="button" className={'button-inner generate-button'} onClick={generateWord}>Generate Name</button>
                        {channel.length > 2 ? <button type="button" className={'button-inner generate-button pull-right'} onClick={copyUrl}>Copy URL<FontAwesomeIcon icon={faCopy} /></button> : ''}
                        <div className="form-row">
                            <label htmlFor='spymaster-switch'>Spymaster?</label>
                            <Switch id='spymaster-switch' onChange={(e) => setSpymaster(e)}
                                    checked={spymaster} {...switchProps}/>
                        </div>
                        <Link onClick={handleSubmit} to={`/play/${channel}`}>
                            <Button submit={name && channel} className="fullwidth" text={'Play!'}/>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Join
