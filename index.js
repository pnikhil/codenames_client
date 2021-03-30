const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv/config')

const { addUser, removeUser, getUser, getUsersInRoom, getAllUsers } = require('./users')
const { newPuzzle, getPuzzle, checkPuzzle, removePuzzle, endTurn, guessWord, newGame, selectWord } = require('./puzzle')

const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const server = http.createServer(app);
const io = socketio(server);


io.on('connection', (socket) => {
    console.log('We have a new connection!');

    socket.on('join', async ({name, room, spymaster}, callback) => {

        const { error, user } = addUser({id:socket.id, name, room, spymaster});
        const puzzle = await checkPuzzle(room)

        if(error) return callback({error})

        socket.join(user.room);

        // console.log('puzzle',puzzle)
        // console.log( 'all users: ', getAllUsers() )
        let usersInRoom = getUsersInRoom(user.room)
        io.to(user.room).emit('onlineUsers', {room: user.room, users: usersInRoom})
        io.to(user.room).emit('getPuzzle', getPuzzle(room) )
        // if (usersInRoom.length >= 2){
        //     console.log("Inside here");
        //     io.to(user.channel).emit('getTimer', beingCountDownTimer(user));
        // }

        callback({name:user.name, spymaster:user.spymaster});
    })

/*    let timer, timerCount;
    function beingCountDownTimer(user, game){
        if (timer)
            return
            timerCount = 10;
            timer = setInterval(function() {
                io.to(user.channel).emit('getTimer', timerCount);
                timerCount--;
                console.log('timer count: ' + timerCount);
                if (timerCount <= -1) {
                    console.log('stopping timer.');
                    clearInterval(timer);
                    io.to(user.channel).emit('getPuzzle', endTurn(user.channel) )
                    resetTimer();
                }
            }, 1000);
    }*/

/*    function resetTimer(){
        timer = null;
        clearInterval(timer);
        timerCount = 10;
    }*/

    socket.on('endTurn', (prop) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('getPuzzle', endTurn(user.room) )
/*        resetTimer();
        beingCountDownTimer(user);*/
    })

    socket.on('newGame', async (prop) => {
        const user = getUser(socket.id);
        const game = await newGame(user.room)
        io.to(user.room).emit('getPuzzle', game)
/*        resetTimer();
        beingCountDownTimer(user, game);*/

    });

    socket.on('selectWord', (word) => {
        const user = getUser(socket.id);
        console.log(user);
        io.to(user.room).emit('getPuzzle', selectWord(user.room, word, user.name) )
    })

    socket.on('guessWord', (word) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('getPuzzle', guessWord(user.room, word, user.name) )
    })

    socket.on('disconnect', () => {

        const user = removeUser(socket.id);

        if(user) {
            const UsersInRoom = getUsersInRoom(user.room);
            if(UsersInRoom.length === 0) {
                removePuzzle(user.room)
            }
            //io.to(user.channel).emit('getPuzzle', newMessage(user.channel, `${user.name} has left the Channel`))
            io.to(user.room).emit('onlineUsers', {room: user.room, users: UsersInRoom})
        }
    });
});


server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
