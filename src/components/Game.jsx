import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import Users from './Users'
import Navbar from './Navbar'
import Button from './Button'
import SidebarSection from './SidebarSection'
import {useParams, Redirect} from 'react-router-dom'
import Switch from "react-switch";
import {TailSpin} from 'svg-loaders-react'
import '../css/Popup.css';
import '../css/Game.css';
import '../css/Sidebar.css';
import Popup from './Popup'
import {toast} from "react-toastify";


let socket;
const ENDPOINT = 'https://dry-eyrie-69778.herokuapp.com/'

const switchProps = {
    onColor: '#86d3ff',
    offColor: '#ccc',
    activeBoxShadow: '0 0 0px 3px #1d1d32'
};

const Game = ({location}) => {

    let {channel} = useParams();
    const [puzzle, setPuzzle] = useState({})
    const [user, setUser] = useState('')
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showSidebar, setShowSidebar] = useState(false)
    const [spymasterView, setSpymasterView] =  useState(false)
    const [showPopup, setShowPopup] = useState(true)
    //SETUP SOCKET
    useEffect(() => {



        const game = JSON.parse(sessionStorage.getItem('game'));

        if (!game) {
            if (channel !== null) {
                window.localStorage.setItem('channel-name', channel);
            }

            setError(true);
            return
        }


        if (game) {

            const {name, spymaster} = game;

            socket = io(ENDPOINT);
            socket.emit('join', {name, channel, spymaster}, (response) => {
                if (response.error) {
                    setError(true)
                } else {
                    setUser(response)
                }

            });

            return () => {
                socket.emit('disconnect');
                socket.off();
            }

        } else {
            setError(true)
        }


    }, [location.search, channel])

    //HANDLING ONLINE USERS
    useEffect(() => {

        if (socket) {
            socket.on("onlineUsers", ({users}) => {
                setUsers(users);
            });
        }

    }, [users])


    useEffect(() => {

        if (socket) {
            socket.on("getPuzzle", (puzzle) => {
                setPuzzle(puzzle);
                setLoading(false)
            });
        }

    }, [])


    const endTurn = (e) => {
        e.preventDefault();
        socket.emit('endTurn')
    }

    const newGame = (e) => {
        e.preventDefault();
        setShowPopup(true)
        socket.emit('newGame');

        toast.info("New game started!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
            closeOnClick: true
        });
    }

    const selectWord = (word) => {

        if (!puzzle.winner) {
                socket.emit('guessWord', word);
        }
    }


    if (error) {
        return <Redirect to='/'/>
    }

    const exitChannel = () =>{

        this.props.history.replace({ pathname: `/`})
    };

    return (

        <React.Fragment>



            <div className={`container ${puzzle.currentTurn}`}>

                <div id={"sidebar"} className={`${showSidebar ? 'show' : ''}`}>


                    <div className="sidebar-content">
                        <h1 className="sidebar-section">CODENAMES</h1>

                        <SidebarSection title='Channel' variant='space-between'>
                            <h3>{channel}</h3>
                        </SidebarSection>

                        <SidebarSection title='Online players' className='online-users' scroll>
                            <Users users={users} me={user.name}/>
                        </SidebarSection>


                        <div>
                            <div className={'sidebar-section'}>


                                <a href='/'><Button className='fullwidth outline' onClick={exitChannel} text={'Quit Game'}/></a>
                            </div>
                        </div>
                    </div>
                </div>


                <div className={`contents`}>

                    <Navbar onMenuClick={setShowSidebar} active={showSidebar}/>

                    {puzzle.winner && showPopup &&

                    <Popup handleClose={() => setShowPopup(false)}>
                        <h2 className={puzzle.winner}>{puzzle.winner && puzzle.winner.toUpperCase()} team wins!</h2>
                        <p>{puzzle.black ? 'The assassin has been found' : 'All words found'}</p>
                        <Button text={'New Game'} onClick={newGame}/>
                    </Popup>

                    }

                    {loading ?

                        <TailSpin stroke="#FFF" strokeOpacity="1"/>

                        : <div className={`gameContainer`}>

                            <div className="top-bar">
                                    {puzzle.currentTurn && !puzzle.winner &&
                                    <span className={`currentTurn ${puzzle.currentTurn}`}>
                                         {puzzle.currentTurn.toUpperCase()} plays
						</span>
                                    }

                                {/*<span className="currentTurn timer">Timer</span>*/}
                                {puzzle.points && <div className="scores scoreBackground">

                                    <svg xmlns="http://www.w3.org/2000/svg">

                                        <defs>
                                            <linearGradient id="redGradient" x1="0" x2="0" y1="0" y2="1">

                                                <stop offset="100%" stopColor="#FE5F55"/>
                                            </linearGradient>
                                            <linearGradient id="blueGradient" x1="0" x2="0" y1="0" y2="1">

                                                <stop offset="100%" stopColor='#09c6f9'/>
                                            </linearGradient>
                                        </defs>


                                        <text className={`score red red-text`} x="20%" y="94%">{puzzle.points.red}</text>
                                        <text className={`score neutral`} x="50%" y="94%">-</text>
                                        <text className={`score blue`} x="80%" y="94%">{puzzle.points.blue}</text>
                                    </svg>
                                </div>
                                }
                            </div>

                            <div id='game'>{puzzle.words && puzzle.words.map((e, i) => {
                                return (
                                    <div
                                        key={i}
                                        className={`card ${e.color ? e.color : 'hidden'} ${e.value === puzzle.selected ? 'selected team-' + puzzle.currentTurn : ''} ${(puzzle.winner || spymasterView) || !e.value === puzzle.selected ? puzzle.key[i] : ''}`}
                                        onClick={e.color ? null : () => selectWord(e.value)}>
                                        {e.value}
                                    </div>
                                )
                            })}
                            </div>

                            <div className="bottom-bar">
                                <div>

                                    {user.spymaster &&
                                    <div className="setting">
                                        <label htmlFor="spymaster-switch">Spymaster view</label>
                                        <Switch onColor="#86d3ff"
                                                onHandleColor="#2693e6"
                                                handleDiameter={30}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                                height={20}
                                                width={48}
                                                className="react-switch" id='spymaster-switch' onChange={(e) => setSpymasterView(e)}
                                                checked={spymasterView} {...switchProps} disabled={puzzle.winner}/>
                                    </div>
                                    }

                                </div>

                                <div className="center">
                                    <Button text={'End Turn'} onClick={endTurn} disabled={puzzle.winner}/>
                                    <Button text={'New game'} onClick={newGame} />
                                </div>
                            </div>
                        </div>
                    }

                </div>

                <div className={`close-menu ${showSidebar ? 'show' : ''}`} onClick={() => setShowSidebar(false)}></div>

            </div>
        </React.Fragment>
    )
}

export default Game
