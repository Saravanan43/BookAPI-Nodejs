const router=require("express").Router();
const AuthorModel=require("../../database/author");

/*
Route - /author
Task  - Get all author details
Access - public
Parameter - None
Methods  - GET
*/

router.get("/",async (req,res) => {
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

router.get("/author/:book",async (req,res) => {
    const book=req.params.book;
    const getSpecificAuthor= await AuthorModel.findOne({books:book});
    //const authorData= database.Author.filter((i) => i.books.includes(book));
    if(!getSpecificAuthor)
    return res.json({error : `${book} is not found in author`});
    return res.json({Author : getSpecificAuthor});

});

/*
Route - /add/author
Task  - add new author
Access - public
Parameter - none
Methods  - POST
*/

router.post("/add/author",async (req,res) => {
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
 
 router.post("/add/pub", async (req,res) => {
     const pubData=req.body.pubData;
     PublicationModel.create(pubData);
     return res.json({Message : "Publication added"});
 });

 router.delete("/book/author/delete/:isbn/:authorId",async (req,res) => {
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

 module.exports = router;