import React, {useState} from 'react';
import {Link} from 'react-router-dom'
import Switch from "react-switch";

import Button from './Button'
import '../css/Forms.css';

const Join = () => {

    const [name, setName] = useState('')
    const [channel, setChannel] = useState('')
    const [spymaster, setSpymaster] = useState(false)

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
    }

    return (


        <div className="page-container">
            <div>
                <div className="title">
                    <h4>Codenames</h4>
                </div>
                <div className={'form-wrapper'}>
                    <form onSubmit={handleSubmit} className="form">

                        <input type="text" id='name-input' placeholder="Your Name" class="nameInput"
                               onChange={(e) => setName(e.target.value)}/>
                        <input type="text" id='channel-input' placeholder="Channel name" class="channelInput"
                               onChange={(e) => setChannel(e.target.value)}/>

                        <div className="form-row">
                            <label htmlFor='spymaster-switch'>Spymaster?</label>
                            <Switch id='spymaster-switch' onChange={(e) => setSpymaster(e)}
                                    checked={spymaster} {...switchProps}/>
                        </div>
                        <div className='space'></div>
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
