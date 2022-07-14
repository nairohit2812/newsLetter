//jshint eversion:6

const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");


const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res){
    const nameVigilante = req.body.vigilante;
    const nameNemesis = req.body.nemesis;
    const mailId = req.body.email;

    console.log(nameVigilante);
    console.log(nameNemesis);
    console.log(mailId);

    const data = {
        members : [
            {
                email_address : mailId,
                status: "subscribed",
                merge_fields: {
                    FNAME : nameVigilante,
                    LNAME : nameNemesis,
                }
            }
        ]
    };


    const jsonDATA = JSON.stringify(data);
    const url = "https://us12.api.mailchimp.com/3.0/lists/413d805607";
    const options = {
        method : "POST",
        auth : "nai7rohit:5efe863cbf128f8992de0073dac7fcc6-us12"
    }
    
    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200){
            console.log("Status code is : "+response.statusCode);
            res.sendFile(__dirname + "/success.html");
        }else{
            console.log("Status code is : "+response.statusCode);
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });


    
    request.write(jsonDATA);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});






app.listen(process.env.PORT || 3000, function () {
    console.log("Server running on 3000 port");
})


//API KEY : 5efe863cbf128f8992de0073dac7fcc6-us12
//Audience ID : 413d805607