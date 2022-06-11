const mongoose = require("mongoose");


const movieSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true
  },
  Year: {
    type: String,
    required: true
  },
  MovieDesc:{
    type: String,
  },
  imdbID: {
    type: String,
    required: true
  },
  PosterImg: {
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
  objId:{
    type: String,
    required: true
  },
  imdbRating:{
    type: String,
    required:true
  },
  Language:{
    type: String,
    required:true
  },
  addedOn:{
      type: Number,
      required: true
  }
},
{ 
    timestamps: true
}
);

const movieModel = mongoose.model('movies',movieSchema);

module.exports.model = movieModel;