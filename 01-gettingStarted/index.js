var express = require('express');

console.log(typeof express);

var server = express();


var port = 8686; 
var ip = 'localhost';

server.get('/', function(req, res){
    console.log("client is asking for some page");
    res.send("<h1>Welcome User</h1>")
})

server.get('/:name', function(req, res){
    console.log("Name : "+req.params.name);
    res.send("<h1>Welcome "+req.params.name+"</h1>")
})

server.listen(port, ip, function(err){
    if(err){
        console.log("Error in server starting")
        console.log(err);
    } else {
        console.log("server is running at: "+port);
    }
});

console.log("After server started ")