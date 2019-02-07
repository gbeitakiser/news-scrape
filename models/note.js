// Requirements
var mongoose = require("mongoose");
var Schema = mongoose.Schema;


// My Schema
var NoteSchema = new Schema({
  title: String,
  body: String
});

// Create a model for schema
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
