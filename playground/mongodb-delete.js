// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser: true}, (error, client) =>{
  if(error) {
    return console.log('Unable to connect to MongoDB server!');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

          //deleteMany
// db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
//   console.log(result);
// });

          //deleteOne
  // db.collection('Todos').deleteOne({text: 'Watch football'}).then((result) => {
  //   console.log(result);
  // })

          //findOneAndDelete
// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
//   console.log(result);
// });

        //deleteMany : users
  // db.collection('Users').deleteMany({name: 'Sergei'}).then((result) => {
  //   console.log(result);
  // });

        //deleteOne : by id
  // db.collection('Users').deleteOne({_id: new ObjectID('5b38d65926a7e2e2e44bb436')}).then((result) => {
  //   console.log(JSON.stringify(result, undefined, 2);
  // });



  //client.close();
});
