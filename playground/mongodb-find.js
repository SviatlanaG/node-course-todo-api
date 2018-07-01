// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser: true}, (error, client) =>{
  if(error) {
    return console.log('Unable to connect to MongoDB server!');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

// db.collection('Todos').find({
//     _id: new ObjectID('5b38ce4460f5b878600d1323')
// }).toArray().then((docs) => {
//   console.log('Todos');
// console.log(JSON.stringify(docs, undefined, 2));
// }, (error) =>{
//   console.log('Unable to fetch todos', error);
// });

// db.collection('Todos').find().count().then((count) => {
//   console.log(`Todos count: ${count}`);
// console.log(JSON.stringify(docs, undefined, 2));
// }, (error) =>{
//   console.log('Unable to fetch todos', error);
// });
  //client.close();
  db.collection('Users').find({
      name: 'Varvara'
  }).toArray().then((docs) => {
    console.log('Users');
  console.log(JSON.stringify(docs, undefined, 2));
  }, (error) =>{
    console.log('Unable to fetch users', error);
  });

  // db.collection('Users').find({name: 'Varvara'}).count().then((count) => {
  //   console.log( `Users count: ${count}`);
  // console.log(JSON.stringify(docs, undefined, 2));
  // }, (error) =>{
  //   console.log('Unable to fetch users', error);
  // });

});
