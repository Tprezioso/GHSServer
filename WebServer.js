// Lets require/import the HTTP module
var http = require("http");

// Lets define a port we want to listen to
const PORT = 8080;
// We need a function which handles requests and send response
function handleRequest(request, response) {
  response.end('It works!! Path Hit: ' +request.url);
}

// Create a server
var server = http.createServer(handleRequest);

// Lets start our server
server.listen(PORT, function() {
  console.log("Server listening on: http://localhost:%s", PORT);
  var request = require('request');
  request('https://status.github.com/api/status.json', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the JSON for the GitHub status homepage.
    var newBody = JSON.parse(body);
    console.log(newBody.status);

    // Database Initialize
    var firebase = require("firebase");
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyBkUebaHxBKiKozeip3KKJj9WDg3gWhztc",
      authDomain: "gitstatuswebserver.firebaseapp.com",
      databaseURL: "https://gitstatuswebserver.firebaseio.com",
      //storageBucket: "<BUCKET>.appspot.com",
    };
// Sending push notification w/ database
var arrayOfDeviceID = [];
firebase.initializeApp(config);
var database = firebase.database();
 return firebase.database().ref('push-token').once('value').then(function(snapshot) {

  var countdown =  30 * 60 * 1000;
  var timerId = setInterval(function(){
    countdown -= 1000;
    // uncomment 2 lines below when done with testing
    var min = Math.floor(countdown / (60 * 1000));
    var sec = Math.floor((countdown - (min * 60 * 1000)) / 1000);  //correct

    if (countdown <= 0) {
       var fbDatabase = snapshot.val();
       arrayOfDeviceID = fbDatabase;
       console.log(arrayOfDeviceID.user_token);

       if (newBody.status == "good" || newBody.status == 'major') {
           var FCM = require('fcm-push');
           var serverKey = 'AAAAFcNgblc:APA91bEvvv8BgmAZ8Gru9PBb9zILNbjo9po75IuLCQtvJXeIDobFeGzErrguiYaZznSWQ54wG_YCdhaP3o011wgRg9izTez-7tHcnc8T2vATo4eJFRJnNBSMgciZ01qlZOwLIj5LnGVt';
           var fcm = new FCM(serverKey);
           var message = {
               to: arrayOfDeviceID.user_token.Token, // required fill with device token or topics
               // collapse_key: 'your_collapse_key',
               // data: {
               //     your_custom_data_key: 'your_custom_data_value'
               // },
               notification: {
                   title: 'Current Github Status',
                   body: newBody.status
                 }
               };
           // promise style
             fcm.send(message)
             .then(function(response){
                 console.log("Successfully sent with response: ", response);
               })
             .catch(function(err){
                 console.log("Something has gone wrong!");
                 console.error(err);
               })
           }
           // 30 min count
           // uncomment line below after testing
           countdown = 30 * 60 * 1000;
    } else {
      console.log(countdown);
    }
    // uncomment line below after testing
  }, 1000);
    });
  });
});
