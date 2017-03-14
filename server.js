/* Dependencies:
*********************************************************/

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

let users = [];
let connections = [];


/* Server listener and feedback:
*********************************************************/

server.listen(process.env.PORT || 3000);
console.log('Server running...');


/* Root route:
*********************************************************/

app.get('/', function(req, res) { res.sendFile(`${__dirname}/index.html`); });


/* io.sockets:
*********************************************************/

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log(`Sockets connected: ${connections.length}`);

    // disconnect:
    socket.on('disconnect', function(data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log(`Disconnected. Sockets connected: ${connections.length}`);
    });

    // send message:
    socket.on('send message', function(data) {
        console.log(data);
        io.sockets.emit('new message', { msg: data, user: socket.username });
    });

    // new user:
    socket.on('new user', function(data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });
    
    function updateUsernames() { io.sockets.emit('get users', users); }
});
