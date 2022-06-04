const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const userModel = require("./models");

const app = express();
app.use(cors());

// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set the region
AWS.config.update({
  region: "eu-west-3",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
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

app.get("/", (req, res) => {
  res.status(200).send("Hello server is running").end();
});

app.get("/details", async (req, res) => {
  /* 
    res.send({data: 'Hello World, from express'}); */
  const user = await userModel.findOne({ id: 123 });
  //const user = await userModel.find({});
  console.log("user " + user);
  res.send(user);
});

app.get("/images", async (req, res) => {
  console.log(req.query.pays + '/' + req.query.ville);
  var bucketParams = {
    Bucket: "guidemichmich",
    Prefix: req.query.pays + '/' + req.query.ville,
  };

  s3.listObjects(bucketParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success");
      console.log("-----------------------");
      console.log(data);
      console.log("-----------------------");
      var AllUrls = [];
      var urlsByTown = [];
      var folderName = '';
      // 0:{Key: 'TH/Baan Mama Compressed/Baan Mama Thailande (101).jpg', LastModified: Sat Apr 09 2022 17:06:40 GMT+0700 (heure d’Indochine), ETag: '"3fd14a2826e8438c91c82e7358393d56"', ChecksumAlgorithm: Array(0), Size: 145831, …}

      for (let index = 1; index < data["Contents"].length; index++) {
        url =
          "https://guidemichmich.s3.eu-west-3.amazonaws.com/" +
          data["Contents"][index]["Key"];
        urlsByTown.push(url);
      }
      res.send(urlsByTown);
    }
  });
});

app.get("/imageUrl", async (req, res) => {
  res.send("https://guidemichmich.s3.eu-west-3.amazonaws.com/" + req.query.pays + '/' + req.query.ville + '/' + req.query.fileName);
});

app.get("/");

module.exports = app;
