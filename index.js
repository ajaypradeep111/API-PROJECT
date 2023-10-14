require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

var bodyParser = require("body-parser");

//database
const database=require("./database/database");

//models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//initialise express
const booky=express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,

).then(() => console.log("Connection Established"));

/*Route         /
Description     get all the books
Access          public
parameters      none
methods         get
*/

booky.get("/",async(req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/*Route         /is
Description     get specific book on ISBN
Access          public
parameters      isbn
methods         get
*/

booky.get("/is/:isbn",async(req,res) => {
const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

    if(!getSpecificBook){
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
    }
    return res.json({book: getSpecificBook});
});

/*Route         /c
Description     get specific book on category
Access          public
parameters      category
methods         get
*/

booky.get("/c/:category",async(req,res) => {
    const getSpecificBook = await BookModel.findOne({category: req.params.category});
    
        if(!getSpecificBook){
            return res.json({error: `No book found for the category of ${req.params.category}`});
        }
        return res.json({book: getSpecificBook});
    });

/*Route         /l
Description     get specific book on language
Access          public
parameters      language
methods         get
*/

booky.get("/l/:language",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language.includes(req.params.language)
    );
    if(getSpecificBook.length === 0) {
        return res.json({error: `No book found for the language of ${req.params.language}`});
    }
    return res.json({book: getSpecificBook});
});

/*Route         /author
Description     get all authors
Access          public
parameters      none
methods         get
*/

booky.get("/author", async(req,res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});

/*Route         /author/book
Description     get all authors based on books
Access          public
parameters      isbn
methods         get
*/

booky.get("/author/book/:isbn", (req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );
    if(getSpecificAuthor.length ===0) {
        return res.json({error: `No author found for the book of ${req.params.isbn}`});
    }
    return res.json({authors: getSpecificAuthor});
});

/*Route         /publications
Description     get all publications
Access          public
parameters      none
methods         get
*/

booky.get("/publications", async(req,res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
});

/*Route         /book/new
Description     add new books
Access          public
parameters      none
methods         post
*/

booky.post("/book/new",async(req,res) => {
    const {newBook} = req.body;
    const addNewBook = BookModel.create(newBook);
    return res.json({
        books: addNewBook,
        message: "Book was added !!!"
    });
});

/*Route         /author/new
Description     add new authors
Access          public
parameters      none
methods         post
*/

booky.post("/author/new",async(req,res) => {
    const {newAuthor} = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor);
    return res.json({
        author: addNewAuthor,
        message: "Author was added!!!"
    });
});

/*Route         /publication/new
Description     add new publications
Access          public
parameters      none
methods         post
*/

booky.post("/publication/new",async(req,res) => {
    const {newPublication} = req.body;
    const addNewPublication = PublicationModel.create(newPublication);
    return res.json({
        publication:addNewPublication,
        message:"Publication was added!!!"
    });
});

/*Route         /publication/update/book
Description     update /add new publications
Access          public
parameters      isbn
methods         put
*/

booky.put("/publication/update/book/:isbn",(req,res) => {
    //update the publication database
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn);
        }
    });
    //update the book databse
    database.books.forEach((book) =>{
        if(book.ISBN === req.params.isbn) {
            book.publications = req.body.pubId;
            return;
        }
    });

    return res.json(
        {
            books: database.books,
            publications: database.publication,
            message: "Successfully updated publications"
        }
    );
});

/*Route         /book/update
Description     Update a book
Access          public
parameters      isbn
methods         put
*/

booky.put("/book/update/:isbn",async(req,res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            title: req.body.bookTitle
        },
        {
            new:true
        }
    );

    return res.json({
        books:updatedBook
    });
});
/*******Updating new Author****** */

/*Route         /publication/update/book
Description     update /add new publications
Access          public
parameters      isbn
methods         put
*/

booky.put("/book/author/update/:isbn", async (req,res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet:{
                authors:req.body.newAuthor
            }

        },
        {
            new:true
        }
    );
    //update the Author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor
        },
        {
            $addToSet:{
                books: req.params.isbn
            }
        },
        {
            new:true
        }
    );

    return res.json(
        {
            books: updatedBook,
            authors: updatedAuthor,
            message: "New author was added"
        }
    );
});
/*Delete */
/*Route         /book/delete
Description     Delete a book
Access          public
parameters      isbn
methods         delete
*/

booky.delete("/book/delete/:isbn", async(req,res) => {
    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        }
    );

    return res.json({
        books: updatedBookDatabase
    });
});

/*Route         /book/delete
Description     Delete a book
Access          public
parameters      isbn
methods         delete
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });
    database.author.forEach((eachAuthor) => {
        if(eachAuthor.id === parseInt(req.params.authorId)) {
            const newBookList = eachAuthor.books.filter(
                (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }
    });
    return res.json({
        book: database.books,
        author: database.author,
        message: "Author was deleted!!!"
    });

});

booky.listen(5111,() => {
    console.log("Server is up and  running");
});