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
Route - /:ISBN
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
Route - /c/:category
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
Task  - update book name and update in author
Access - public
Parameter - id,isbn
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

 
 router.delete("/book/delete/:isbn",async (req,res) => {
    await BookModel.findOneAndDelete({ISBN : req.params.isbn});
     /*const filterList= database.Book.filter((i) => i.ISBN!== req.params.isbn);
     database.Book=filterList;*/
     return res.json({deletedList : "Deleted"});
 });

 module.exports=router;