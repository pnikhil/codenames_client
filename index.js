const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv/config')


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

    socket.on('join', async ({name, channel, spymaster}, callback) => {

        const { error, user } = addUser({id:socket.id, name, channel, spymaster});
        const puzzle = await checkPuzzle(channel)

        if(error) return callback({error})

        socket.join(user.channel);

        // console.log('puzzle',puzzle)
        // console.log( 'all users: ', getAllUsers() )

        io.to(user.channel).emit('onlineUsers', {channel: user.channel, users: getUsersInChannel(user.channel)})
        io.to(user.channel).emit('getPuzzle', getPuzzle(channel) )
        io.to(user.channel).emit('getPuzzle', newMessage(channel, `${user.name} has joined the channel ${user.channel}`))

        callback({name:user.name, spymaster:user.spymaster});
    })

    socket.on('endTurn', (prop) => {
        const user = getUser(socket.id);
        io.to(user.channel).emit('getPuzzle', endTurn(user.channel) )
    })

    socket.on('newGame', async (prop) => {
        const user = getUser(socket.id);
        const game = await newGame(user.channel)
        io.to(user.channel).emit('getPuzzle', game )
    })

    socket.on('selectWord', (word) => {
        const user = getUser(socket.id);
        io.to(user.channel).emit('getPuzzle', selectWord(user.channel, word, user.name) )
    })

    socket.on('guessWord', (word) => {
        const user = getUser(socket.id);
        io.to(user.channel).emit('getPuzzle', guessWord(user.channel, word, user.name) )
    })

    socket.on('disconnect', () => {

        const user = removeUser(socket.id);

        if(user) {
            const UsersInChannel = getUsersInChannel(user.channel);
            if(UsersInChannel.length === 0) {
                removePuzzle(user.channel)
            }
            io.to(user.channel).emit('getPuzzle', newMessage(user.channel, `${user.name} has left the Channel`))
            io.to(user.channel).emit('onlineUsers', {channel: user.channel, users: UsersInChannel})
        }
    });
});


server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
