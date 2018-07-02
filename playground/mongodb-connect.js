// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var object = new ObjectID();
// console.log(object);

// var user = {name: 'Sv', age: 29};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser: true}, (error, client) =>{
  if(error) {
    return console.log('Unable to connect to MongoDB server!');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (error, result) => {
  //   if (error){
  //     return console.log('Unable to insert todo', error);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });


  // db.collection('Users').insertOne({
  //   name: 'Sergei',
  //   age: 34,
  //   location: 'Russia',
  //   completed: false
  // }, (error, result) => {
  //   if(error) {
  //     return console.log('Unable to insert a user.', error);
  //   }
      // console.log(JSON.stringify(result.ops, undefined, 2));
  //     console.log(result.ops[0]._id.getTimestamp());
  //
  // });

  client.close();
});
