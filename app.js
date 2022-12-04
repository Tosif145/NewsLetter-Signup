// requiring all the modules using node
const express = require("express");

const bodyParser = require("body-parser");

const request = require("request");

const app = express();



const https = require("https");


// to access local file system or static page we use special function of express
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});



// post route it contains infromation user entered
// It is used to submit the data of the user input
app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.Lname;
  const email = req.body.email;


  // this data belongs to the user it is in the form of object
  // and it will be in jason flat packet
  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };


  // this method is used to reformat jason data from flat packet as string
  // this data will be submitted to mailchimp server
  const jasonData = JSON.stringify(data);

  // this url belongs to mailchimp api END POINT

  // in the below url usX is replaced by 21 THAT IS PRESENT IN THE API KEY
  const url = "https://us21.api.mailchimp.com/3.0/lists/daa3d20fff";
  // LIST ID : daa3d20fff

  const options = {
    method: "POST",

    // API KEY will be the authentication password
    auth:"tosif:4d0395ff87298b55103087f3f5604ef8-us21"      // API KEY: 4d0395ff87298b55103087f3f5604ef8-us21

  }


  // this data will be logged on hyper terminal in the form of jason
   const request = https.request(url, options , function(response){

     if(response.statusCode === 200){
       res.sendFile(__dirname + "/success.html");
     }else{
       res.sendFile(__dirname + "/failure.html");
     }
   response.on("data", function(data){
     console.log(JSON.parse(data));
   })
  });

  // it will pass the jasonData to the mailchimp
  request.write(jasonData);

  //  this method will be used when we are done with the request
  request.end();

});

// Redirecting to home route to tru azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC
app.post("/failure", function(req, res){
  res.redirect("/")
});


// process.env.PORT will allocate port dynamicall by the heroku
app.listen(process.env.PORT ||  3000, function() {
  console.log("The server is running at port 3000");
})
