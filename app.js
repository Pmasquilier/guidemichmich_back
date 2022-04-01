const express = require("express");


const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const userModel = require("./models");

const app = express();
app.use(cors());

// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "eu-west-3" });

// Create S3 service object
s3 = new AWS.S3({ apiVersion: "2006-03-01" });


/* mongoose.connect('mongodb+srv://guide_mich_mich_atlasdb_user:a6A3Ms7JH6mD5TRSGnhFgk8unU@cluster0.1j9ta.mongodb.net/guide_mich_mich_db?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
}); */


// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res
    .status(200)
    .send('Hello server is running')
    .end();
});

app.get('/details', async (req, res) => {/* 
    res.send({data: 'Hello World, from express'}); */
    const user = await userModel.findOne({id: 123});
    //const user = await userModel.find({});
    console.log('user ' + user);
    res.send(user);
});


app.get("/images", async (req, res) => {

    console.log(req.params.pays)
    var bucketParams = {
      Bucket: "guidemichmich",
      Prefix: req.query.pays
    };
  
    s3.listObjects(bucketParams, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success");
        var urls = [];
        for (let index = 1; index < data['Contents'].length; index++) {
            url = 'https://guidemichmich.s3.eu-west-3.amazonaws.com/' + data['Contents'][index]['Key'];
            console.log(url);
            urls.push(url);        
        }
        res.send(urls);
      }
    });
  });
/* app.use((req, res, next) => {
  console.log("Requête reçus");
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: "Votre requête a bien été reçue !" });
  next();
});

app.use((req, res, next) => {
  console.log("Réponse envoyée avec succès !");
}); */

module.exports = app;
