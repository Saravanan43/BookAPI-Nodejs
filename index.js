require('dotenv').config();

const express=require("express"); // using express

const booky=express();// intitialization

const mongoose = require("mongoose");// installing mogoose 

const database=require("./database/database");//import db js file

// const BookModel=require("./database/book");

//const AuthorModel=require("./database/author");

//const PublicationModel=require("./database/publication");

booky.use(express.json()); // using json 


mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
}).then(() => console.log("Connection established"));

//Microservices route
const books=require("./API/Book");
const authors=require("./API/Author/index")//index can be added if we are not adding also it will detect if one file is there;
const publication=require("./API/Publication");

//initializing with prefixes so it will check the prefix and go to the respective file
booky.use("/book",books);
booky.use("/author",authors);
booky.use("/pub",publication);

//Server
booky.listen(3000,console.log("working"));