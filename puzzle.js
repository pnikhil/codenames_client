// const Words = require('./models/Words.js')
const fs = require("fs");
const sf= require("./util.js")

let puzzles = [];

const checkPuzzle = async (channel) => {

    if(!channel) return
    channel = channel.trim().toLowerCase();

    const existingPuzzle = getPuzzle(channel)
    if(existingPuzzle) return {puzzle: existingPuzzle}

    const puzzle = await newPuzzle(channel)

    return puzzle

}

const newGame = async (channel) => {
    removePuzzle(channel);
    const puzzle = await newPuzzle(channel)
    return puzzle
}

const newPuzzle = async (channel) => {

    channel = channel.trim().toLowerCase();

    const response = fs.readFileSync('./data.json', 'utf8');
    const allWordsList = JSON.parse(response).words;
    const wordsArray = sf.getRandom(allWordsList, 25).map(e => { return { value:e } }) ;

    const key = generateKey();

    const puzzle = {
        channel: channel,
        words: wordsArray,
        key: key.value,
        currentTurn: key.starts,
        points: {red: key.starts === 'red' ? 9 : 8, blue: key.starts === 'blue' ? 9 : 8},
        messages: [],
    }

    puzzles.push(puzzle);

    return puzzle ;

}

// const newMessage = (channel, message, type) => {
//
//     const puzzle = getPuzzle(channel)
//
//     if(puzzle) {
//         const text = {text: message, time: Date.now(), type: type}
//         puzzle.messages.push(text)
//         return puzzle
//     }
//
// }

const getPuzzle = (channel) => puzzles.find((puzzle) => puzzle.channel === channel.trim().toLowerCase() )

const removePuzzle = (channel) => {
    const index = puzzles.findIndex((puzzle) => puzzle.channel === channel.trim().toLowerCase());
    if(index !== -1) return puzzles.splice(index, 1)[0];
}

const getAllPuzzles = () => puzzles

const generateKey = () => {

    const whoStarts = Math.random() < 0.5 ? 'red' : 'blue';
    const neutral = Array(7).fill('neutral');
    const red = Array(whoStarts === 'red' ? 9 : 8).fill('red');
    const blue = Array(whoStarts === 'blue' ? 9 : 8).fill('blue');
    const black = ['black']

    const array = [...neutral, ...red, ...blue, ...black].sort(() => Math.random() - 0.5)

    return {value: array, starts: whoStarts}

}

const otherTeam = (team) => {
    return team === 'red' ? 'blue' : 'red'
}

const endTurn = channel => {
    const puzzle = getPuzzle(channel)

    if(puzzle) {
        puzzle.currentTurn = otherTeam(puzzle.currentTurn);
        return puzzle
    }

}

const selectWord = (channel, word, name) => {

    const puzzle = getPuzzle(channel)

    if(puzzle) {
        puzzle.selected = word
        //newMessage(channel, `${name} selected the word '${word.toUpperCase()}'`, 'game')
        return puzzle
    }

}

const guessWord = (channel, word, name) => {

    const puzzle = getPuzzle(channel)

    if(puzzle) {

        const index = puzzle.words.findIndex((e) => e.value === word);
        const color = puzzle.key[index]
        puzzle.words[index].color = color;

        //newMessage(channel, `${name} confirmed '${word.toUpperCase()}'`, 'game')

        switch(color) {
            case 'black':
                endTurn(channel)
                puzzle.winner = puzzle.currentTurn;
                puzzle.black = true;
                break;
            case otherTeam(puzzle.currentTurn):
                endTurn(channel)
                puzzle.points[puzzle.currentTurn] -= 1;
                //newMessage(channel, `Wrong! '${word.toUpperCase()}' is for the ${color} team`, 'game')
                break;
            case 'neutral':
                endTurn(channel)
                //newMessage(channel, `Wrong! '${word.toUpperCase()}' is a neutral word`, 'game')
                break;
            default:
                puzzle.points[puzzle.currentTurn] -= 1;
                //newMessage(channel, `Correct! '${word.toUpperCase()}' is for the ${color} team`, 'game')
        }

        if(puzzle.points[puzzle.currentTurn] === 0) {
            puzzle.winner = puzzle.currentTurn
        }

        puzzle.selected = '';

        return puzzle
    }


}


module.exports = { checkPuzzle, newPuzzle, getPuzzle, getAllPuzzles, removePuzzle, endTurn, guessWord, newGame, selectWord};
