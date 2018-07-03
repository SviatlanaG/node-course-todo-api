var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL);

module.exports = {mongoose};


// process.env.NODE_ENV
