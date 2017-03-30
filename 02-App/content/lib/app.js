var app = angular.module('app', ['ngRoute']);

app.controller('listCtrl', function(){
    console.log("List controller");
})

app.controller('createCtrl', function($scope, $http, $location){
    console.log("create controller");
    $scope.poll = {question:"ABCD", choices: [{text: "A"},{text:"B"}]};
    $scope.addChoice = function(){
        console.log("add new choice");
        console.log($scope.poll)
        // $scope.poll = {...$scope.poll}
        $scope.poll.choices.push({text:""})
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
            $scope.poll = {question:"", choices: [{text: ""},{text:""}]};
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

app.controller('viewCtrl', function(){
    console.log("view controller");
})

app.controller('resultCtrl', function(){
    console.log("result controller");
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
