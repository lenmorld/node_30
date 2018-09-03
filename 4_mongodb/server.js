var collection_1 = "people";

function createCollection(dbInstance,collection_1) {
  const dbo = dbInstance.db("sample");
  dbo.createCollection(collection_1, (err, res) => {
    if (err) throw err;
    console.log("Collection created");
    dbInstance.close()
  });
}

function insertOne(dbInstance, name) {
  // https://www.w3schools.com/nodejs/nodejs_mongodb_insert.asp

    const dbo = dbInstance.db("sample");
    const obj = {
      id: 1,
      name: name
    };

    dbo.collection(collection_1).insertOne(obj, (err, res) => {
        if (err) throw err;
        console.log("Inserted one document");
        dbInstance.close();
    });

    // insertMany() for Multiple docs
}



function doStuff(dbInstance) {
  // createCollection(dbInstance, collection_1);
  // insertOne(dbInstance, "Timmy");
  // insertOne(dbInstance, "Jimmy");

  const dbo = dbInstance.db("sample");
  const coll = dbo.collection(collection_1);

  // https://www.w3schools.com/nodejs/nodejs_mongodb_find.asp

  // findOne
  coll.findOne({}, (err, result) => {
    if (err) throw err;
    console.log("Found one: ", result);
    dbInstance.close();
  });
  // Found one:  { _id: 5b8c4a45a3c67910eb0aaa32, id: 1, name: 'Lenny' }

  // // find all
  coll.find({}).toArray((err, result) => {
    if (err) throw err;
    console.log("Found these: ", result);
    dbInstance.close();
  });
  /* -> Found these:  [ { _id: 5b8c4a45a3c67910eb0aaa32, id: 1, name: 'Lenny' },
  { _id: 5b8d4c0bef1a57179854e72c, id: 1, name: 'Timmy' },
  { _id: 5b8d4c0bef1a57179854e72d, id: 1, name: 'Jimmy' } ]
  */

  // find by params, by undefined/defined
  const defined_params = {
      name: 1,  // name is truthy, 0 if not
  }

  let search_params = {
    name: "Timmy"
  }

  coll.find(search_params, defined_params).toArray((err, result) => {
    if (err) throw err;
    console.log("Found some: ", result);
    dbInstance.close();
  });
  // Found some:  [ { _id: 5b8d4cacefe2b517d76bd979, id: 1, name: 'Timmy' } ]


// can use Regex too
  search_params = {
    name: /.*immy/
  }

  coll.find(search_params, defined_params).toArray((err, result) => {
    if (err) throw err;
    console.log("Found some: ", result);
    dbInstance.close();
  });

  // Found some:  [ { _id: 5b8d4cacefe2b517d76bd979, id: 1, name: 'Timmy' },
//  { _id: 5b8d4cacefe2b517d76bd97a, id: 1, name: 'Jimmy' } ]

  // TODO:
  // edit, delete, search
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
