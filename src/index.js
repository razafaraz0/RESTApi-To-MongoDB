var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var rateLimit = require("express-rate-limit");

app.use(express.static('statics'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("listening at http://%s:%s", host, port);

})

const apiLimiter = rateLimit({
  windowMs: 1, // 15 minutes
  max: 5 // max number of requests before sending too many users
});
app.use("/customers/", apiLimiter);

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';  // -----local Host------ 
// const url = "mongodb+srv://raza_faraz:raza123@ponyx-fz5ug.mongodb.net/test?retryWrites=true" //------ORM 
const dbName = 'pony_challangeDB';
const client = new MongoClient(url, { useNewUrlParser: true });

client.connect();

// on default load the home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/statics/home.html');
  });

// when user clicks the the submit page
app.post("/customers", apiLimiter ,async function (req, res) {
  const db=client.db(dbName);
  const apikey =   req.body.api_key;
  const pageNumber = parseInt( req.body.page , 10); 
  const pageSize = parseInt(req.body.pageS);
  const skip = ((pageNumber-1)*pageSize);

  // awaits until the pony account is retrieved 
  let AccID=await db.collection("pony_accounts").findOne({api_key: apikey});
  if(AccID)
  {
    let customers=await db.collection("pony_contacts").find({ownerAccountId: AccID.id}).skip(skip).limit(pageSize).toArray();
    if(customers[0]) // To check if the array is indeed populated
    {
      console.log(customers);
      res.send(customers);
      return;
    }
    else{
      res.send("0");
      return;
    }
  }
  res.send("0"); // if there is no api_key for that user
  return;  
});
