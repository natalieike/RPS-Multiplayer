/*
To set up authentication rules:
	{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
*/
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