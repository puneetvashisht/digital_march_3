var app = angular.module('app', ['ngRoute']);

app.service("PollService", function(){
    var poll = {};
    return poll;
})

app.controller('listCtrl', function($http, $scope, PollService, $location){
    $scope.pollService = PollService;
    console.log("List controller");
    $http({
        url: "/fetchPolls",
        method: "get"
    }).success(function(res){
        console.log("Data fetched successfully from server");
        console.log(res)
        if(res.success){
            $scope.polls = res.polls;

            $scope.viewPollPage = function(poll){
                // console.log(poll);
                $scope.pollService.poll = poll;
                console.log($scope.pollService);
                $location.path("/viewPoll");
            }
        }
    }).error(function(){
        console.log("Error in fetching polls from server");
    })


})

app.controller('createCtrl', function($scope, $http, $location){
    console.log("create controller");
    $scope.poll = {question:"", choices: [{text: "", count: 0},{text:"", count:0}]};
    $scope.addChoice = function(){
        console.log("add new choice");
        console.log($scope.poll)
        // $scope.poll = {...$scope.poll}
        $scope.poll.choices.push({text:"", count: 0})
        console.log($scope.poll)
    }
    $scope.removeChoice = function(){
        console.log("remove last choice");
        if($scope.poll.choices.length>2){
            $scope.poll.choices.pop();
        }
    }
    $scope.createPoll = function(){
        console.log($scope.poll);
        $http({
            url: "/createPoll",
            method: "post", 
            data: $scope.poll
        }).success(function(res){
            $scope.poll = {question:"", choices: [{text: "", count: 0},{text:"", count: 0}]};
            console.log(res);
            if(res.success){
                //move to PollList page
                $location.path('/pollList')
            }
        }).error(function(){
            console.log("some error occurred")
        })
    }
})

app.controller('viewCtrl', function($location, $scope, PollService, $http){
    $scope.pollService = PollService
    console.log("view controller");
    console.log($scope.pollService);
    if(!$scope.pollService.poll){
        $location.path("/pollList");
    }
    $scope.votePoll = function(poll){
        if(!poll.userVote){
            alert("Vote for this poll");
        } else {
            console.log("user voted")
            console.log(poll);
            $http({
                url: "/vote",
                data: poll,
                method: "put"
            }).success(function(res){
                console.log("Server sent res successfully");
                console.log(res);
                if(res.success){
                    $scope.pollService.poll = res.poll;
                    console.log($scope.pollService);

                    $location.path("/resultPoll");
                }
            }).error(function(){
                console.log("Some error occurred on server side");
            })
        }
    }

})

app.controller('resultCtrl', function(PollService, $scope){
    $scope.pollService = PollService;
    console.log("result controller");
    console.log($scope.pollService.poll.choices);
    $scope.totalVotes = 0;
    $scope.pollService.poll.choices.forEach(function(choice){
        $scope.totalVotes += choice.count;
    });
    console.log($scope.totalVotes)
})

app.config(function($routeProvider){
    $routeProvider.when("/pollList", {
        // template: "Poll List" 
        templateUrl: "./templates/list.html",
        controller: "listCtrl"
    });
    $routeProvider.when("/createPoll", {
        // template: "Create new poll"
        templateUrl: "./templates/create.html",
        controller: "createCtrl"
    });
    $routeProvider.when("/viewPoll", {
        // template: "View Poll", 
        templateUrl: "./templates/view.html",
        controller: "viewCtrl"
    });
    $routeProvider.when("/resultPoll", {
        // template: "Poll result", 
        templateUrl: "./templates/result.html",
        controller: "resultCtrl"
    });
    $routeProvider.otherwise({
        redirectTo: "/pollList"
    });
})
