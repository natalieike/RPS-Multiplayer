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
	var username; //stores username for later use
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

	//Determines the winner
	var determineWinner = function(){
		var resultsArray = [["T", 2, 1], [1, "T", 2], [2, 1, "T"]];
		var user1 = userInputArray[0];
		var user2 = userInputArray[1];
		var result = resultsArray[user1][user2];
	};

	//Pushes the data to database
	var pushDataToDatabase = function(key){

	}

	//Hides Weapon Choice and Stats until Username is entered
	$(".panel").hide();

	//Button Handler for entering username
	$("#submit").click(function(event){
		event.preventDefault();
		username = $("#username").val();
		$("#getUserName").hide();
		$("#showUserName").text("Hello, " + username);
		sendUserToDb(username);
		console.log(user);
	});

	//Click Handler for Weapon Choice
	$(".choice-img").click(function(){
		var key = $(this).attr("data-key");
		$("#weapon-choices").hide();
		$("#choice-results-heading").text("Results");
		pushDataToDatabase(key);
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
