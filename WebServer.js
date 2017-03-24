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

    var firebase = require("firebase");
    // Initialize Firebase
    // TODO: Replace with your project's customized code snippet
    var config = {
      apiKey: "<AIzaSyAe1N8MZR33dAcqZSIZyWCkadCyEa6N8kY",
      authDomain: "github-status-a8907.firebaseapp.com",
      databaseURL: "https://github-status-a8907.firebaseio.com",
      //storageBucket: "<BUCKET>.appspot.com",
    };
firebase.initializeApp(config);
 var database = firebase.database();
 console.log(database);

    if (newBody.status == "minor" || newBody.status == 'major') {
      var FCM = require('fcm-push');
      var serverKey = 'AAAAFcNgblc:APA91bEvvv8BgmAZ8Gru9PBb9zILNbjo9po75IuLCQtvJXeIDobFeGzErrguiYaZznSWQ54wG_YCdhaP3o011wgRg9izTez-7tHcnc8T2vATo4eJFRJnNBSMgciZ01qlZOwLIj5LnGVt';
      var fcm = new FCM(serverKey);
      var message = {
        // TODO : needs a for loop of device id
        to: 'e-dt2khziqY:APA91bEOaqIuH2zHWuGreijaR6wJnbV0CWCLQmfpaDryUA9POJAnCOXlfTexf6_Rx2rgsMpUwKmNF84tOjsBvKT3SuB4EyDh8mvpCteqPxxk2Z-z0nI7S8PWEBR6Np_HcOy9oHB3jkiw', // required fill with device token or topics
        // collapse_key: 'your_collapse_key',
        // data: {
        //     your_custom_data_key: 'your_custom_data_value'
        // },
        notification: {
            title: 'Current Github Status',
            body: newBody.status
          }
        };

        // Commented out for different send of message
        //callback style
        // fcm.send(message, function(err, response){
        //     if (err) {
        //         console.log("Something has gone wrong!");
        //     } else {
        //         console.log("Successfully sent with response: ", response);
        //     }
        // });

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
  });
});
