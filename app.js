// Dependencies
// =============================================================
require("dotenv").config();
// { path: './.env' }

//Create an Express application. 
const express = require("express");
const https = require("https");
const bodyParser =  require("body-parser");
const { type } = require("os");
const { RSA_NO_PADDING } = require("constants");
const { resourceUsage } = require("process");

//initialize an instance of express
// =============================================================
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// Dependencies -> Pug: a templating engine for Express
// =============================================================
app.set('view engine', 'pug');
app.set('views','./views');

// =============================================================
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html")
})

// =============================================================
app.post("/", function(req, res) {
    const emotion = req.body.userEmotion;
    var APIkey = process.env.API_KEY;
    console.log("apiKey", APIkey);

    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + emotion + "&api_key=" + APIkey + "&limit=1";

    // res.writeHead(200, {
    //     'Content-Type': 'text/html'
    // });

    https.get(queryURL, function(response) {
        console.log("status", response.statusCode);  //200
        console.log("typeof response: ", typeof response);  //RESPONSE is ALREADY AN OBJECT
        // console.log(response.data); //UNDEFINED ****
        // console.log("JSON.parse(response.data)", JSON.parse(response.data)); //[object Object]
    
        //testing:
        // console.log("before", response);
        // response.setEncoding('utf8');
        // console.log("after**", response);

        var body = "";
        response.on("data", function(data) {
            console.log("response.on(data): ", data);   // <Buffer 7b 22 64 61 74 .... >   ...with response.setEncoding('utf8'); we get readable data
            //add up all data chuncks and store them in a var
            body += data;
        })  //response.on ENDS  

        response.on("end", function() {
            var parsedJson = JSON.parse(body);
            console.log(parsedJson);
       
            var pickedData = parsedJson.data[0].images.original.url;
            const giphy = {
                imgSrc: pickedData,
                text: "test"
            } 
            res.render("response", giphy);     
        })   
    })  //https.get ENDS

})  //app.post("/", function(req, res) ENDS

// =============================================================
app.listen(3000 || process.env.PORT, function() {
    console.log("Listening on port 3000");
})