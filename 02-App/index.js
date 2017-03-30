var express = require('express');
var bodyPaser = require('body-parser');
var app = express();

var MongoClient = require('mongodb').MongoClient;

// console.log(__dirname)
app.use(express.static(__dirname+"/content"))
app.use(bodyPaser.json())

// app.get('index', function(){})


MongoClient.connect("mongodb://localhost:27017/PollDb", function(err, db){
    if(err){
        console.log("Error in database connection");
        console.log(err);
    } else {
        console.log("Connection established");
        app.listen(8686, 'localhost', function(err){
        if(err){
            console.log("Error in running server");
            console.log(err);
        } else {
            console.log("Server is running at : "+8686);
            var pollCol = db.collection("poll_collection");

            app.get("/fetchPolls", function(req, res){
                pollCol.find().toArray(function(err, data){
                    if(err){
                        console.log("Error in fetching data from database");
                        console.log(err);
                        res.send({success: false})
                    } else {
                        console.log("Data fetched from database");

                        res.send({success: true, polls: data});
                    }
                })
                // res.send({success: true, polls: []})
            })

            app.post("/createPoll", function(req, res){
                console.log("New Poll ");
                var poll = req.body;
                console.log(poll);
                // db.collection("poll_collection").insert(poll)
                pollCol.insert(poll, function(err, result){
                    if(err){
                        console.log("Error in poll insertion");
                        console.log(err);
                        res.send({success: false})
                    } else {
                        console.log("Poll inserted into database");
                        res.send({success: true})
                    }
                })
                // res.send({success: true})
            })



        }
    })

    }
})