// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser: true}, (error, client) =>{
  if(error) {
    return console.log('Unable to connect to MongoDB server!');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

        // db.collection('Todos').findOneAndUpdate({
        //   _id: new ObjectID("5b3a09a5187f4fadd131069f")
        // }, {
        //   $set: {
        //     completed: true
        //   }
        // }, {
        //   returnOriginal: false
        // }).then((result) =>{
        //   console.log(result);
        // });

db.collection('Users').findOneAndUpdate({
_id: new ObjectID("5b38d66b0576f0dbc015cd98")
}, {
  $set: {
    name: 'Varya'
  },
  $inc: {
    age: 1
  }
}, {
  returnOriginal: false
}).then((result) => {
  console.log(result);
});

  //client.close();
});
