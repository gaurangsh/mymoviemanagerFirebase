module.exports.init = function(){
    const mongoose = require('mongoose');
    mongoose.connect('mongodb+srv://app:1234567890@cluster0.rq2ix.mongodb.net/fasal_project?retryWrites=true&w=majority')
    .then(function(){
      console.log("db is on");
    }).catch(function(){
      console.log("db is off");
    })
};