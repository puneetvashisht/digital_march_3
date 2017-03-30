var express = require('express');
var bodyPaser = require('body-parser');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var MongoClient = require('mongodb').MongoClient;

// //console.log(__dirname)
app.use(express.static(__dirname+"/content"))
app.use(bodyPaser.json())

// app.get('index', function(){})


MongoClient.connect("mongodb://localhost:27017/PollDb", function(err, db){
    if(err){
        //console.log("Error in database connection");
        //console.log(err);
    } else {
        //console.log("Connection established");
        http.listen(8686, 'localhost', function(err){
        if(err){
            console.log("Error in running server");
            //console.log(err);
        } else {
            console.log("Server is running at : "+8686);
            var pollCol = db.collection("poll_collection");

            app.get("/fetchPolls", function(req, res){
                pollCol.find().toArray(function(err, data){
                    if(err){
                        //console.log("Error in fetching data from database");
                        //console.log(err);
                        res.send({success: false})
                    } else {
                        //console.log("Data fetched from database");

                        res.send({success: true, polls: data});
                    }
                })
                // res.send({success: true, polls: []})
            })

            app.post("/createPoll", function(req, res){
                //console.log("New Poll ");
                var poll = req.body;
                //console.log(poll);
                // db.collection("poll_collection").insert(poll)
                pollCol.insert(poll, function(err, result){
                    if(err){
                        //console.log("Error in poll insertion");
                        //console.log(err);
                        res.send({success: false})
                    } else {
                        //console.log("Poll inserted into database");
                        res.send({success: true})
                    }
                })
                // res.send({success: true})
            })

            app.put("/vote", function(req, res){
                console.log("Updating poll")
                // console.log(req.body);
                var poll = req.body;
                poll.choices.forEach(function(choice) {
                    if(choice.text === poll.userVote){
                        choice.count += 1; 
                    }
                }, this);
                delete poll.userVote;
                console.log(poll);
                pollCol.findOneAndUpdate({question: poll.question},{
                    $set: {
                        choices: poll.choices
                    }
                }, function(err, data){
                    if(err){
                        console.log("Error in Updating");
                        console.log(err);
                        res.send({success: false});
                    } else {
                        pollCol.find({question: poll.question}).toArray(function(err, data){
                        if(err){
                            //console.log("Error in fetching data from database");
                            //console.log(err);
                            res.send({success: false})
                        } else {
                            console.log("Data fetched from database++++++++");
                            console.log(data[0]);
                            res.send({success: true, poll: data[0]});
                            
                            // res.send({success: true});
                        }
                    })
                        // res.send({success: true, poll: data.value});
                    }
                })
            })

        }
    })

    }
})