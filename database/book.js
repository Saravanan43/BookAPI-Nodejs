const mongoose=require("mongoose");

//Creating schema
const BookSchema=mongoose.Schema({
        ISBN: {
          type:String,
          required:true,
          minLength : 8
        },
        title: String,
        authors: [Number],
        language: String,
        pubDate: String,
        numOfPage: Number,
        category: [String],
        publication: Number,
});
//creating model
const BookModel=mongoose.model("books",BookSchema);
module.exports=BookModel;