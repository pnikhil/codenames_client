const users = [];

const addUser = ({ id, name, channel, spymaster}) => {

    channel = channel.trim().toLowerCase();

    if(!name) {
        name = guestUser(channel)
    } else {
        name = name.trim().toLowerCase();
    }

    const existingUser = users.find((user) => user.channel === channel && user.name === name);

    if(!name || !channel) return { error: 'Username and channel are required.' };
    if(existingUser) return { error: 'Username is taken.' };

    const user = { id, name, channel, spymaster };

    users.push(user);

    return { user };
}

const guestUser = (channel) => {

    const usersInChannel = getUsersInChannel(channel)

    let i = 1;
    while(usersInChannel.some(e => e.name === 'Guest'+i)) {
        i++
    }

    return 'Guest'+i
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getAllUsers = () => users;

const getUsersInChannel = (channel) => users.filter((user) => user.channel === channel);

module.exports = { addUser, removeUser, getUser, getUsersInChannel, getAllUsers };
