/*
To set up authentication rules:
	{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
*/

$(document).ready(function(){

	// Initialize Firebase
	var config = {
  	apiKey: "AIzaSyDZUo90sysBbHvPRZFHPrzrz3bwILXz3VM",
  	authDomain: "rpg-multiplayer-b125e.firebaseapp.com",
  	databaseURL: "https://rpg-multiplayer-b125e.firebaseio.com",
  	projectId: "rpg-multiplayer-b125e",
  	storageBucket: "rpg-multiplayer-b125e.appspot.com",
  	messagingSenderId: "1094506110859"
	};
	firebase.initializeApp(config);

	//Global Variables
	var database = firebase.database(); //pointer to firebase database
	var fromDatabaseArray = [{}, {}]; //stores database info for use in the app
	var username; //stores username
	var user = "user3"; //stores whether user 1 or user 2

	//Resets gameplay values in Database
	var resetGameplay = function(){
		database.ref("Game").set({
			user1: {
				userChat: "NotInitiated",
				userInput: 3,
				userName: "EnterName"
			},
			user2: {
				userChat: "NotInitiated",
				userInput: 3,
				userName: "EnterName"
			}
		});
		fromDatabaseArray = [{}, {}];
	};

	//Sends the user data to Firebase, determines if user1 or user2
	var sendUserToDb = function(name){
		if(user == "user3"){
			if(fromDatabaseArray[0].userName == "EnterName"){
				database.ref("Game").update({user1Name: name});
				user = "user1";
				$(".panel").show();
			}
			else if(fromDatabaseArray[1].userName == "EnterName"){
				database.ref("Game").update({user2Name: name});
				user = "user2";
				$(".panel").show();			
			}
			else{
				$("#errorMessage").text("Sorry, the game is full.  Please try again later.");
			}
		}
	};

	//Pushes the data to database
	var pushDataToDatabase = function(key){
		if(user == "user1"){
			database.ref("Game").update({user1Input: key});
		}
		else if (user == "user2"){
			database.ref("Game").update({user2Input: key});			
		}
	};

	//Builds the Results panel
	var buildResults = function(){
		var index;
		var imgTag = $("<img>");
		var choiceValue;
		var winner;
		var winnerDiv = $("<div>");
		$("#results").empty();
		if(user == "user1"){
			index = 0;
		}
		else if (user == "user2"){
			index = 1;
		}
		else{
			return;
		}
		choiceValue = fromDatabaseArray[index].userInput;
		console.log("choiceValue: " + choiceValue);
		switch(choiceValue){
			case "0": 
				imgTag.attr("src", "assets/images/rock_thumb.png");
				imgTag.addClass("resultsImg");
				break;
			case "1":
				imgTag.attr("src", "assets/images/Smart_Paper.png");
				imgTag.addClass("resultsImg");
				break;	
			case "2":
				imgTag.attr("src", "assets/images/scissors-emoji.png");
				imgTag.addClass("resultsImg");
				break;
		};
		$("#results").append(imgTag);
		winner = determineWinner();
		switch(winner){
			case "T":
				winnerDiv.text("It's a Tie!");
				updateScore("tie");
				endGame();
				break;
			case 1:
				if(user == "user1"){
					winnerDiv.text("You Won!");
					updateScore("win");
				}
				else{
					winnerDiv.text("You Lost!");
					updateScore("lose");
				}
				endGame();
				break;
			case 2:
				if(user == "user1"){
					winnerDiv.text("You Lost!");
					updateScore("lose");
				}
				else{
					winnerDiv.text("You Won!");
					updateScore("win");
				}
				endGame();
				break;	
			default:
				winnerDiv.text("Waiting for Other User...");
		}
		winnerDiv.addClass("resultsText");
		$("#results").append(winnerDiv);
	};

	//Determines the winner
	var determineWinner = function(){
		var resultsArray = [["T", 2, 1], [1, "T", 2], [2, 1, "T"]];
		if(fromDatabaseArray[0].userInput == 3 || fromDatabaseArray[1].userInput == 3){
			return 3;
		}
		else{
			return resultsArray[fromDatabaseArray[0].userInput][fromDatabaseArray[1].userInput];
		}
	};

	var updateScore = function(outcome){
		var score;
		switch(outcome){
			case "tie":
				score = $("#Ties").attr("data-score");
				score++;
				$("#Ties").text("Ties: " + score);
				$("#Ties").attr("data-score", score);
				break;
			case "win":
				score = $("#Wins").attr("data-score");
				score++;
				$("#Wins").text("Wins: " + score);
				$("#Wins").attr("data-score", score);
				break;		
			case "lose":
				score = $("#Losses").attr("data-score");
				score++;
				$("#Losses").text("Losses: " + score);
				$("#Losses").attr("data-score", score);
				break;							
		}
	};

	var endGame = function(){
		var resetBtn = $("<button>");
		var leaveBtn = $("<button>");
		resetBtn.addClass("btn btn-info");
		resetBtn.attr("id", "resetGame");
		leaveBtn.addClass("btn btn-danger");
		leaveBtn.attr("id", "leaveGame");
	}

	//Hides Weapon Choice and Stats until Username is entered
	$(".panel").hide();

	//Button Handler for entering username
	$("#submit").click(function(event){
		event.preventDefault();
		username = $("#username").val();
		$("#getUserName").hide();
		sendUserToDb(username);
		$("#showUserName").text("Hello, " + username);
	});


	//Value handler for user1 name
	database.ref("Game/user1Name").on("value", function(snapshot){
			fromDatabaseArray[0].userName = snapshot.val();
		}, function(errorObject){
			console.log(errorObject);
	});

	//Value handler for user2 name
	database.ref("Game/user2Name").on("value", function(snapshot){
			fromDatabaseArray[1].userName = snapshot.val();
		}, function(errorObject){
			console.log(errorObject);
	});

	//Hover Handler for weapon choice - mouse enters
	$(".choice-img").on("mouseenter", function(){
		var selection = $(this);
		selection.addClass("hover");
	});

	//Hover Handler for weapon choice - mouse exits
	$(".choice-img").on("mouseleave", function(){
		var selection = $(this);
		selection.removeClass("hover");
	});

	//Click Handler for Weapon Choice
	$(".choice-img").click(function(){
		var key = $(this).attr("data-key");
		$("#weapon-choices").hide();
		$("#choice-results-heading").text("Results");
		pushDataToDatabase(key);
	});

	//Value handler for user1 weapon input
	database.ref("Game/user1Input").on("value", function(snapshot){
			fromDatabaseArray[0].userInput = snapshot.val();
			buildResults();
		}, function(errorObject){
			console.log(errorObject);
	});

	//Value handler for user2 weapon input
	database.ref("Game/user2Input").on("value", function(snapshot){
			fromDatabaseArray[1].userInput = snapshot.val();
			buildResults();
		}, function(errorObject){
			console.log(errorObject);
	});


/*
	//Value handler for user data
	database.ref("Game").on("value", function(snapshot){
		var user1Name = snapshot.val().user1.userName;
		var user2Name = snapshot.val().user2.userName;
		var user1Input = snapshot.val().user1.userInput;
		var user2Input = snapshot.val().user2.userInput;
		var user1Chat = snapshot.val().user1.userChat;
		var user2Chat = snapshot.val().user2.userChat;
		fromDatabaseArray = [
			{userName: user1Name, 
			 userInput: user1Input,
			 userChat: user1Chat},
			{userName: user2Name,
			 userInput: user2Input,
			 userChat: user2Chat}];
		findWhatsChanged();
	}, function(errorObject){
		console.log(errorObject);
	});
*/



});
