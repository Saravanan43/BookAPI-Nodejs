//Prefix - /book

const router = require("express").Router();

const BookModel = require("../../database/book");

/*
Route - /
Task  - Get all books
Access - public
Parameter - None
Methods  - GET
*/

router.get("/",async (req,res)=>
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

router.get("/:ISBN",async (req,res)=>{
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

router.get("/c/:category",async (req,res)=>{
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
Route - /add/book
Task  - add new book
Access - public
Parameter - none
Methods  - PUSH
*/

router.post("/add/book",async (req,res) => {
    try {
        const newBook =req.body.newBook;
    await BookModel.create(newBook);
    return res.json({Message : " Book is added"});
    } catch (error) {
        return res.json({error:error.message});
    }
    
});

/*
Route - /update/bookName
Task  - update book name
Access - public
Parameter - isbn
Methods  - PUT
*/

router.put("/update/bookName/:isbn",async (req,res) => {
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

router.put("/update/book/:isbn/:Id",async (req,res) => {
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
Route - /book/delete/
Task  - delete book using isbn
Access - public
Parameter - isbn
Methods  - DELETE
*/

router.delete("/delete/:isbn",async (req,res) => {
    await BookModel.findOneAndDelete({ISBN : req.params.isbn});
     /*const filterList= database.Book.filter((i) => i.ISBN!== req.params.isbn);
     database.Book=filterList;*/
     return res.json({deletedList : "Deleted"});
 });
 
 router.delete("/book/delete/:isbn",async (req,res) => {
    await BookModel.findOneAndDelete({ISBN : req.params.isbn});
     /*const filterList= database.Book.filter((i) => i.ISBN!== req.params.isbn);
     database.Book=filterList;*/
     return res.json({deletedList : "Deleted"});
 });
 
 router.delete("/author/delete/:isbn/:authorId",async (req,res) => {
    //delete author from the book
 
    const updatedBookList=await BookModel.findOneAndUpdate(
        {
            ISBN :req.params.isbn
        },
        {
            $pull : {
                authors : parseInt(req.params.authorId)
            }
        },
        {
            new:true
        }
    );
    /*database.Book.forEach((i) => {
      if(i.ISBN===req.params.isbn)
      {
          const filterAuthorList=i.authors.filter((j) => j !== parseInt(req.params.authorId));
          i.authors=filterAuthorList;
          return ;
      }
    });*/
 
    // delete isbn from author
    const updateAuthorList =await AuthorModel.findOneAndUpdate(
        {
             id : parseInt(req.params.authorId)
        },
        {
           $pull : {
               books :req.params.isbn
           }
        },
        {
            new : true
        }
    );
    /* database.Author.forEach((i) => {
       if(i.id === parseInt(req.params.authorId))
       {
         const filterBooksList=i.books.filter((j) => j !== (req.params.isbn));
         i.books=filterBooksList;
         return ;
       }
    });*/
 
    return res.json ({deletebookList : updatedBookList,deleteAuthorList : updateAuthorList});
 });

 module.exports=router;