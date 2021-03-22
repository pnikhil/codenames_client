import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import Switch from "react-switch";
import randomWords from 'random-words'
import Button from './Button'
import '../css/Forms.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCopy} from '@fortawesome/free-solid-svg-icons'
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';


const Join = () => {
    //alert(window.location.href);
    const [name, setName] = useState('')
    const [channel, setChannel] = useState('')
    const [spymaster, setSpymaster] = useState(false)
    const [team, setTeam] = useState('blue')
    toast.configure();

    useEffect(() => {
        // sessionStorage.removeItem('game'); change later if required
        if (window.localStorage.getItem('channel-name') != null) {
            const channelName = window.localStorage.getItem('channel-name');
            setChannel(channelName);
            window.localStorage.removeItem('channel-name');

            toast.success("Channel name copied from URL. Enter your name and hit Play!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000,
                closeOnClick: true
            });
        }
    });

    const handleSubmit = (e) => {
        if (!name || !channel) {
            e.preventDefault();
            toast.error("Fill in your name and select a channel!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000,
                closeOnClick: true
            });
        } else {
            const game = {name, channel, spymaster}
            sessionStorage.setItem('game', JSON.stringify(game));
            return null
        }
    }

    const switchProps = {
        onColor: '#86d3ff',
        offColor: '#ccc',
        activeBoxShadow: '0 0 0px 3px #1d1d32'
    };

    const generateWord = () => {
        setChannel(randomWords({exactly: 2, maxLength: 5, join: '-'}));
    };

    const copyUrl = () => {
        navigator.clipboard.writeText(window.location.href + 'play/' + channel);
        toast.info("URL copied. You can now share it with your friends.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
            closeOnClick: true
        });
    };

    return (

        <div className="page-container">
            <div>
                <div className="title">
                    <h4><span className={'redText'}>Code</span><span className={'blueText'}>names</span></h4>
                </div>
                <div className={'form-wrapper'}>
                    <form onSubmit={handleSubmit} className="form">

                        <input type="text" id='name-input' placeholder="Your Name" className="nameInput"
                               onChange={(e) => setName(e.target.value)}/>
                        <div class={'channel-grp'}><input type="text" id='channel-input' placeholder="CHANNEL NAME"
                                                          className="channelInput"
                                                          value={channel}
                                                          onChange={(e) => setChannel(e.target.value)}/>
                            <button type="button" className={'button-inner generate-button'}
                                    onClick={generateWord}>Generate
                            </button>
                        </div>


                        <div className="form-row">
                            <label htmlFor='spymaster-switch'>Spymaster?</label>
                            <Switch
                                onColor="#86d3ff"
                                onHandleColor="#2693e6"
                                handleDiameter={30}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                height={20}
                                width={48}
                                className="react-switch" id='spymaster-switch' onChange={(e) => setSpymaster(e)}
                                checked={spymaster} {...switchProps}/>
                        </div>
                        {/*<div className="form-row">*/}
                        {/*    <label htmlFor='team-switch'>Team</label>*/}
                        {/*    <Switch*/}
                        {/*        onColor="#86d3ff"*/}
                        {/*        onHandleColor="#2693e6"*/}
                        {/*        handleDiameter={30}*/}
                        {/*        uncheckedIcon={false}*/}
                        {/*        checkedIcon={false}*/}
                        {/*        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"*/}
                        {/*        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"*/}
                        {/*        height={20}*/}
                        {/*        width={48}*/}
                        {/*        className="react-switch" id='team-switch' onChange={(e) => setTeam(e)}*/}
                        {/*        checked={spymaster} {...switchProps}/>*/}
                        {/*</div>*/}

                        <Link onClick={handleSubmit} to={`/play/${channel}`}>
                            <Button submit={name && channel} className="fullwidth" text={'Play!'}/>
                        </Link>

                        {channel.length > 3 ?
                            <div class={'copy-div'}><button type="button" className={'button-inner copy-btn'}
                                    onClick={copyUrl}>Copy URL<FontAwesomeIcon icon={faCopy}/></button></div> : ''}

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Join
