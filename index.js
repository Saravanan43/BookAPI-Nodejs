require('dotenv').config();

const express=require("express"); // using express

const booky=express();// intitialization

const mongoose = require("mongoose");// installing mogoose 

const database=require("./database/database");//import db js file

const BookModel=require("./database/book");

const AuthorModel=require("./database/author");

const PublicationModel=require("./database/publication");

booky.use(express.json()); // using json 


mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
}).then(() => console.log("Connection established"));
/*
Route - /
Task  - Get all books
Access - public
Parameter - None
Methods  - GET
*/

booky.get("/",async (req,res)=>
{ 
  const getAllBooks=await BookModel.find();
  return res.json({book:getAllBooks});
}
);

/*
Route - /book
Task  - Get specific books
Access - public
Parameter - isbn
Methods  - GET
*/

booky.get("/book/:ISBN",async (req,res)=>{
  const bookId=req.params.ISBN;
  const getSpecificBook= await BookModel.findOne({ISBN:bookId});
  /*const bookData=database.Book.filter((i) => //bookId===i.ISBN
  i.ISBN.includes(bookId)//method 1
  );*/
  if(getSpecificBook===null)
  return res.json({SpecificBook : `${bookId} Not Found`});

  return res.json({SpecificBook : getSpecificBook});
});

/*
Route - /book/c
Task  - Get specific books on category
Access - public
Parameter - category
Methods  - GET
*/

booky.get("/book/c/:category",async (req,res)=>{
  const categoryName=req.params.category;
  const getSpecificBook= await BookModel.find({category: categoryName});
  /*const bookData=database.Book.filter((i)=>{
      if(i.category.includes(categoryName))//method 2
      return i;
  });*/

  if(getSpecificBook===null)
  return res.json({SpecificBook : `${categoryName} category Not Found`});
  else
  return res.json({SpecificBook : getSpecificBook});
});

/*
Route - /author
Task  - Get all author details
Access - public
Parameter - None
Methods  - GET
*/

booky.get("/author",async (req,res) => {
    const getAllAuthor=await AuthorModel.find();
   return res.json({Author : getAllAuthor});
});

/*
Route - /author
Task  - Get author details based on books
Access - public
Parameter - book
Methods  - GET
*/

booky.get("/author/:book",async (req,res) => {
     const book=req.params.book;
     const getSpecificAuthor= await AuthorModel.findOne({books:book});
     //const authorData= database.Author.filter((i) => i.books.includes(book));
     if(!getSpecificAuthor)
     return res.json({error : `${book} is not found in author`});
     return res.json({Author : getSpecificAuthor});

});

/*
Route - /publication
Task  - Get publication details
Access - public
Parameter - None
Methods  - GET
*/

booky.get("/publication",async (req,res) =>
{   const publication=await PublicationModel.find();
    return res.json({publication : publication});
});

/*
Route - /publication
Task  - Get pub details based on books
Access - public
Parameter - book
Methods  - GET
*/

booky.get("/publication/:book",async (req,res) => {
    const book=req.params.book;
    const getSpecificPublication= await PublicationModel.findOne({books : book});
    //const pubData= database.Publication.filter((i) => i.books.includes(book));
    if(getSpecificPublication===null)
    {
      return res.json({error : `${book} is not found in pub`});
    }
    console.log(getSpecificPublication);
    return res.json({Punlication : getSpecificPublication});

});

/*
Route - /add/book
Task  - add new book
Access - public
Parameter - none
Methods  - PUSH
*/

booky.post("/add/book",async (req,res) => {
     const newBook =req.body.newBook;
     BookModel.create(newBook);
     return res.json({Message : " Book is added"});
});

/*
Route - /add/author
Task  - add new author
Access - public
Parameter - none
Methods  - POST
*/

booky.post("/add/author",async (req,res) => {
   const {authorData}=req.body;
   AuthorModel.create(authorData);
   return res.json({Message: "Author is added"});
});

/*
Route - /add/pub
Task  - add new publication
Access - public
Parameter - none
Methods  - POST
*/

booky.post("/add/pub", async (req,res) => {
    const pubData=req.body.pubData;
    PublicationModel.create(pubData);
    return res.json({Message : "Publication added"});
});

/*
Route - /update/bookName
Task  - update book name
Access - public
Parameter - isbn
Methods  - PUT
*/

booky.put("/update/bookName/:isbn",async (req,res) => {
     const {isbn}=req.params;
     const {bookName}=req.body;
     const updatedBookList =await BookModel.findOneAndUpdate({
           ISBN:isbn
     },
     {
          title:bookName
     },
     {
          new: true //to get upadate data inpostman
     });

     /*database.Book.forEach((i) => {
         if(i.ISBN===isbn)
         {i.title=bookName;
         return;}
     });*/
     return res.json({updatedList : updatedBookList});
});

/*
Route - /update/bookName
Task  - update book name
Access - public
Parameter - isbn
Methods  - PUT
*/

booky.put("/update/book/:isbn/:Id",async (req,res) => {
    const {isbn}=req.params;
    const {Id}=req.params;
    let bookName;
    //add author

    const getBookList =await BookModel.findOneAndUpdate(
        {
            ISBN : isbn
        },
        {
            $addToSet : {
                authors : parseInt(Id)
            }
        },
        {
            new : true
        }
    );
    /*database.Book.forEach((i) => {
        if(i.ISBN===isbn)
        {
         i.authors.push(parseInt(id));
         bookName=i.title;
         return;
        }
    });*/

    //add book isbn and title in authro
    
    const authorList =await AuthorModel.findOneAndUpdate(
        {
           id :parseInt(Id) 
        },
        {
            $addToSet : {
                books : isbn //push to array
            }
        },
        {
            new :true
        }
        );
    /*database.Author.forEach((i) => {
        if(i.id===parseInt(Id))
        {
            return i.books.push(bookName);
        }
    });*/

    res.json({book : getBookList, author : authorList});
});

/*
Route - /update/bookName
Task  - add book to pub and update pubid in book section 
Access - public
Parameter - isbn,BOOKNAMR,isbn
Methods  - PUT
*/

booky.put("/update/publication/book/:ID/:bookName/:isbn",(req,res) => {

    //Add book to publication using id
    const {ID}=req.params;
    const {bookName}=req.params;
    const {isbn}=req.params;
    //console.log(ID,bookName,isbn);
    database.Publication.forEach((i) => {
          if(i.id===parseInt(ID))
          {
              i.books.push(isbn);
              return;
          }
    });

    //Add pub ID in book

    database.Book.forEach((i) => {
         if(i.ISBN===(isbn))
          {i.publication=parseInt(ID);
          return;}
    });
    return res.json({updatedpubList : database.Publication, updatedbookList : database.Book});
});

/*
Route - /book/delete/
Task  - delete book using isbn
Access - public
Parameter - isbn
Methods  - DELETE
*/

booky.delete("/book/delete/:isbn",async (req,res) => {
   await BookModel.findOneAndDelete({ISBN : req.params.isbn});
    /*const filterList= database.Book.filter((i) => i.ISBN!== req.params.isbn);
    database.Book=filterList;*/
    return res.json({deletedList : "Deleted"});
});

booky.delete("/book/author/delete/:isbn/:authorId",(req,res) => {
   //delete author from the book
   database.Book.forEach((i) => {
     if(i.ISBN===req.params.isbn)
     {
         const filterAuthorList=i.authors.filter((j) => j !== parseInt(req.params.authorId));
         i.authors=filterAuthorList;
         return ;
     }
   });

   // delete isbn from author
   database.Author.forEach((i) => {
      if(i.id === parseInt(req.params.authorId))
      {
        const filterBooksList=i.books.filter((j) => j !== (req.params.isbn));
        i.books=filterBooksList;
        return ;
      }
   });

   return res.json ({deletebookList : database.Book,deleteAuthorList : database.Author});
});
//Server
booky.listen(3000,console.log("working"));