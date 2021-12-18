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

booky.get("/",(req,res)=>
{
  return res.json({book:database.Book});
}
);

/*
Route - /book
Task  - Get specific books
Access - public
Parameter - isbn
Methods  - GET
*/

booky.get("/book/:ISBN",(req,res)=>{
  const bookId=req.params.ISBN;
  const bookData=database.Book.filter((i) => //bookId===i.ISBN
  i.ISBN.includes(bookId)//method 1
  );
  if(bookData.length==0)
  return res.json({SpecificBook : `${bookId} Not Found`});

  return res.json({SpecificBook : bookData});
});

/*
Route - /book/c
Task  - Get specific books on category
Access - public
Parameter - category
Methods  - GET
*/

booky.get("/book/c/:category",(req,res)=>{
  const categoryName=req.params.category;
  const bookData=database.Book.filter((i)=>{
      if(i.category.includes(categoryName))//method 2
      return i;
  });
  return res.json({SpecificBook : bookData});
});

/*
Route - /author
Task  - Get all author details
Access - public
Parameter - None
Methods  - GET
*/

booky.get("/author",(req,res) => {
   return res.json({Author : database.Author});
});

/*
Route - /author
Task  - Get author details based on books
Access - public
Parameter - book
Methods  - GET
*/

booky.get("/author/:book",(req,res) => {
     const book=req.params.book;
     const authorData= database.Author.filter((i) => i.books.includes(book));
     if(authorData.length ===0)
     return res.json({error : `${book} is not found`})
     return res.json({Author : authorData});

});

/*
Route - /publication
Task  - Get publication details
Access - public
Parameter - None
Methods  - GET
*/

booky.get("/publication",(req,res) =>
{
    return res.json({publication : database.Publication});
});

/*
Route - /publication
Task  - Get pub details based on books
Access - public
Parameter - book
Methods  - GET
*/

booky.get("/publication/:book",(req,res) => {
    const book=req.params.book;
    const pubData= database.Publication.filter((i) => i.books.includes(book));
    if(pubData.length ===0)
    return res.json({error : `${book} is not found`})
    return res.json({Author : pubData});

});

/*
Route - /add/book
Task  - add new book
Access - public
Parameter - none
Methods  - PUSH
*/

booky.post("/add/book",(req,res) => {
     const newBook =req.body.newBook;
     database.Book.push(newBook);
     return res.json({updatedList : database.Book});
});

/*
Route - /add/author
Task  - add new author
Access - public
Parameter - none
Methods  - POST
*/

booky.post("/add/author",(req,res) => {
   const {authorData}=req.body;
   database.Author.push(authorData);
   return res.json({updatedList : database.Author});
});

/*
Route - /update/bookName
Task  - update book name
Access - public
Parameter - isbn
Methods  - PUT
*/

booky.put("/update/bookName/:isbn",(req,res) => {
     const {isbn}=req.params;
     const {bookName}=req.body;
     database.Book.forEach((i) => {
         if(i.ISBN===isbn)
         {i.title=bookName;
         return;}
     });
     return res.json({updatedList : database.Book});
});

/*
Route - /update/bookName
Task  - update book name
Access - public
Parameter - isbn
Methods  - PUT
*/

booky.put("/update/book/:isbn/:Id",(req,res) => {
    const {isbn}=req.params;
    const {Id}=req.params;
    let bookName;
    //add author
    database.Book.forEach((i) => {
        if(i.ISBN===isbn)
        {
         i.authors.push(parseInt(id));
         bookName=i.title;
         return;
        }
    });

    //add book isbn and title in authro

    database.Author.forEach((i) => {
        if(i.id===parseInt(Id))
        {
            return i.books.push(bookName);
        }
    });

    res.json({book : database.Book, author : database.Author});
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

booky.delete("/book/delete/:isbn",(req,res) => {
    const filterList= database.Book.filter((i) => i.ISBN!== req.params.isbn);
    database.Book=filterList;
    return res.json({deletedList : database.Book});
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