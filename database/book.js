const mongoose = require("mongoose");

//create book schema
const BookSchema = mongoose.Schema (
    {
        ISBN:String,
        title:String,
        pubDate:String,
        language:String,
        numPage:Number,
        author:[Number],
        publication:[Number],
        category:[String]
       }
);

//create book model

const BookModel = mongoose.model("books",BookSchema);

module.exports = BookModel;