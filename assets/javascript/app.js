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
var userInputArray = []; //stores the user inputs

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

//Click Handler for Weapon Choice
$(".choice-img").click(function(){
	var key = $(this).attr("data-key");
	$("#weapon-choices").hide();
	$("#choice-results-heading").text("Results");
	pushDataToDatabase(key);
});

});
