const mongoose = require("mongoose");


const librarySchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true
  },
  Description: {
      type: String,
      required: true
  },
  user: {
    type: String,
    required: true
  },
  libraryId:{
    type: String,
    required: true
  },
  createdOn:{
      type: Number,
      required: true
  },
  dateOfCreation:{
      type: String,
      required: true
  }
},
{ 
    timestamps: true
}
);

const libraryModel = mongoose.model('library',librarySchema);

module.exports.model = libraryModel;