const router=require("express").Router();

const PublicationModel=require("../../database/publication");

/*
Route - /publication
Task  - Get publication details
Access - public
Parameter - None
Methods  - GET
*/

router.get("/",async (req,res) =>
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

router.get("/publication/:book",async (req,res) => {
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


/*
Route - /update/bookName
Task  - add book to pub and update pubid in book section 
Access - public
Parameter - isbn,BOOKNAMR,isbn
Methods  - PUT
*/

router.put("/update/publication/book/:ID/:isbn",async (req,res) => {

    //Add book to publication using id
    const {ID}=req.params;
   // const {bookName}=req.params;
    const {isbn}=req.params;
    //console.log(ID,bookName,isbn);

    const getPubList= await PublicationModel.findOneAndUpdate(
      {
              id: parseInt(ID)
      },
      {
          $addToSet : {
              books: isbn
          }
      },
      {
          new : true
      }
    );
    /*database.Publication.forEach((i) => {
          if(i.id===parseInt(ID))
          {
              i.books.push(isbn);
              return;
          }
    });*/

    //Add pub ID in book
    const getAllBooks = await BookModel.findOneAndUpdate(
        {
              ISBN:isbn
        },
        {
          publication: ID
        },
        {
            new : true
        }
    );
    /*database.Book.forEach((i) => {
         if(i.ISBN===(isbn))
          {i.publication=parseInt(ID);
          return;}
    });*/
    return res.json({updatedpubList : getPubList, updatedbookList : getAllBooks});
});


module.exports=router;