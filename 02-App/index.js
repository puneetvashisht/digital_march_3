var express = require('express');
var bodyPaser = require('body-parser');
var app = express();

// console.log(__dirname)
app.use(express.static(__dirname+"/content"))
app.use(bodyPaser.json())

// app.get('index', function(){})

app.post("/createPoll", function(req, res){
    console.log("New Poll ");
    console.log(req.body);
    res.send({success: true})
})

app.listen(8686, 'localhost', function(err){
    if(err){
        console.log("Error in running server");
        console.log(err);
    } else {
        console.log("Server is running at : "+8686);
    }
})