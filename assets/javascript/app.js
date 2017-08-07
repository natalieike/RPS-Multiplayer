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

	//Pushes the input data to database
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
		winnerDiv.addClass("resultsText text-center");
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

	//End sequence - prompts user with buttons to play again or leave
	var endGame = function(){
		var resetBtn = $("<button>");
		var leaveBtn = $("<button>");
		var btnDiv = $("<div>");
		resetBtn.addClass("btn btn-info gameBtn");
		resetBtn.attr("id", "resetGame");
		resetBtn.text("Play Again");
		leaveBtn.addClass("btn btn-danger gameBtn");
		leaveBtn.attr("id", "leaveGame");
		leaveBtn.text("Leave Game");
		$("#btnDiv").append(resetBtn);
		$("#btnDiv").append(leaveBtn);
	}

	//Resets all user info when user leaves so new player can join
	var resetUserInfo = function(){
		if(user == "user1"){
			database.ref("Game").update({
				user1Name: "EnterName",
				user1Input: "3",
				user2Input: "3",
				user1Chat: "NotInitiated"
			});
		}
		else if(user == "user2"){
			database.ref("Game").update({
				user2Name: "EnterName",
				user1Input: "3",
				user2Input: "3",
				user2Chat: "NotInitiated"
			});			
		}
		user = "user3";
	};

	//Resets just the game inputs so the same user can play again.  Retains chat and username.
	var resetGameInfo = function(){
		database.ref("Game").update({
			user1Input: "3",
			user2Input: "3"
		})
	};

	//Saves chat line to the database
	var sendChatToDb = function(chatLine){
		if(user == "user1"){
			database.ref("Game").update({
				user1Chat: chatLine
			});
		}
		else if(user == "user2"){
			database.ref("Game").update({
				user2Chat: chatLine
			});
		}
	};

	//Displays chat line
	var displayChatLine = function(newChatLine){
		var index;
		var newDiv = $("<div>");
		if(newChatLine == "NotInitiated"){
			return;
		}
		newDiv.text(newChatLine);
		if (user == "user1"){
			index = 1;
			newDiv.addClass("chatRight");
		}
		else if(user == "user2"){
			index = 0;
			newDiv.addClass("chatLeft");
		}
		if(fromDatabaseArray[index].userName != "EnterName"){
			$("#chat-title").text("Chatting with " + fromDatabaseArray[index].userName);
		}
		else{
			$("#chat-title").text("Waiting for another user to join the game");
		}
		$("#chat-window").prepend(newDiv);
		$("#chat-window")[0].scrollIntoView(false);		
	};

	//Hides Weapon Choice and Stats until Username is entered
	$(".panel").hide();

	//Resets user info if user closes window without leaving game properly.  Not ideal - resets whole game
	database.ref("Game").onDisconnect().update({
		user1Name: "EnterName",
		user1Input: "3",
		user1Chat: "NotInitiated",
		user2Name: "EnterName",
		user2Input: "3",
		user2Chat: "NotInitiated"
	});

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
			if(user != "user3" && snapshot.val("EnterName")){
				database.ref("Game").update({
					user1Name: name
				});
			}
			else{
				fromDatabaseArray[0].userName = snapshot.val();
			}
		}, function(errorObject){
			console.log(errorObject);
	});

	//Value handler for user2 name
	database.ref("Game/user2Name").on("value", function(snapshot){
		if(user != "user3" && snapshot.val("EnterName")){
			database.ref("Game").update({
				user1Name: name
			});
		}
		else{
			fromDatabaseArray[1].userName = snapshot.val();
		}
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

	//Click handler for "Leave Game" button
	$("body").on("click", "#leaveGame", function(event){
		event.preventDefault();
		$("#showUserName").text("Goodbye, " + username + "!");
		$(".panel").hide();
		resetUserInfo();
	});

	//Click handler for "Play Again" button
	$("body").on("click", "#resetGame", function(event){
		event.preventDefault();
		resetGameInfo();
		$("#results").empty();
		$("#btnDiv").empty();
		$("#weapon-choices").show();
	});

	//Click handler for chat button
	$("#chatBtn").click(function(event){
		event.preventDefault();
		var chatLine = $("#chatInput").val();
		sendChatToDb(chatLine);
		$("#chatInput").val("");
	});

	//Value Handler for Chat - User 1
	database.ref("Game/user1Chat").on("value", function(snapshot){
		var newChatLine = snapshot.val();
		displayChatLine(newChatLine);
	}, function(errorObject){
			console.log(errorObject);
	});

	//Value Handler for Chat - User 2
	database.ref("Game/user2Chat").on("value", function(snapshot){
		var newChatLine = snapshot.val();
		displayChatLine(newChatLine);
	}, function(errorObject){
			console.log(errorObject);
	});

});
