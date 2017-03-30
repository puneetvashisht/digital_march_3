var express = require('express');
var app = express();

var http = require('http').Server(app);

var io = require('socket.io')(http);

io.on('connection', function(socket){
    console.log("user connected");

    socket.on('disconnect', function(){
        console.log("user disconnected");
    })
    socket.on("chat message", function(message){
        console.log(message);
        io.emit("newMessage", message);
    })
});

app.use(express.static(__dirname+"/public"));

http.listen(4000, function(){
    console.log("server is running at: "+4000);
})