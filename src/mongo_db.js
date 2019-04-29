var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url , { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("pony_challangeDB");
  console.log(" MongolDb Connection Sucessfull");
  var query = { api_key: "wgoRFPM5P25JVi980ehm" };

  dbo.collection("pony_accounts").findOne(query , function(err, result) {
    if (err) throw err;
    if(result.id)
    {
        var query2 = { ownerAccountId: result.id};
        dbo.collection("pony_contacts").find(query2).toArray(function(err2, result2) {
            if (err2) throw err2;
            console.log(result2);
            db.close();  // Added close here because connection closed somewhere in the middle
          });

    }
    else{
        console.log("NOthing");
    }
  });

});


// ---------------------------Other working ------------------------------------------------
//   dbo.collection("pony_accounts").find(query).toArray(function(err, result) {
//     if (err) throw err;
//     if(result[0].id)
//     {
//         var query2 = { ownerAccountId: "3"};
//         console.log(query2);
//         dbo.collection("pony_contacts").find(query2).toArray(function(err2, result2) {
//             if (err2) throw err2;
//             console.log(result2);
//             db.close();
//           });

//     }
//     else{
//         console.log("NOthing");
//     }
//   });
// ------------------------------------------------------------------------------------
    