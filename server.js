const express = require('express');
const app = express()
const port = 3000
const server = require('http').Server(app);
const { v4: uuid } = require('uuid');
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug : true
})

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/peerjs',peerServer);
app.get('/', (req, res) => res.redirect(`/${uuid()}`))

app.get('/:room', (req, res) => res.render('room', { roomid: req.params.room }))


io.on('connection', socket => {
    socket.on('join_room', (roomid, userId) => {

        socket.join(roomid);
        socket.to(roomid).broadcast.emit('user_connected', userId);

        socket.on('message', msg=>{
            io.to(roomid).emit('createMsg', msg)
        })

    })
})


server.listen(process.env.PORT||3000)

