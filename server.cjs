const express = require('express')

const app = express()

const http = require('http').createServer(app)


const port = 3000

http.listen(port, ()=>{
    console.log(`listen on port  ${port}` )
})

app.use(express.static(__dirname + '/' ))

app.get('/',(req,res)=>{
        res.sendFile(__dirname + '/index.html')
})

const io = require('socket.io')(http)

io.on('connection',(socket)=>{
    console.log("Connected")

    socket.on('message',(message)=>{
           socket.broadcast.emit('message', message)
    })



})