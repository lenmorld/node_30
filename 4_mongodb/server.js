// mLab instawnce

// mongodb://<dbuser>:<dbpassword>@ds141952.mlab.com:41952/sample

// check visually here
// login to mLab using username: lenmorld
// https://mlab.com/databases/sample/collections/people

var collection_1 = "people";

function createCollection(dbInstance,collection_1) {
  const dbo = dbInstance.db("sample");
  dbo.createCollection(collection_1, (err, res) => {
    if (err) throw err;
    console.log("Collection created");
    dbInstance.close()
  });
}

function insertOne(dbInstance) {
    const dbo = dbInstance.db("sample");
    const obj = {
      id: 1,
      name: "Lenny"
    };

    dbo.collection(collection_1).insertOne(obj, (err, res) => {
        if (err) throw err;
        console.log("Inserted one document");
        dbInstance.close();
    });
}

function doStuff(dbInstance) {
  // createCollection(dbInstance, collection_1);

  insertOne(dbInstance);


}


var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://lenmor:markoj2049@ds141952.mlab.com:41952/sample';

MongoClient.connect(url, function(err, dbInstance) {
  if (err) throw err;
  console.log("Connected to mLab instance");

  doStuff(dbInstance);

  // dbInstance.close();  // -> will cause errors if doStuff has async ops
                          // since this line will close db before async resolves
});
