const express = require("express");

var bodyParser = require("body-parser");

//database
const database=require("./database");

//initialise express
const booky=express();

booky.use(bodyParser.urlencoded({extended: true}));

/*Route         /
Description     get all the books
Access          public
parameters      none
methods         get
*/

booky.get("/",(req,res) => {
    return res.json({books: database.books});
});

/*Route         /is
Description     get specific book on ISBN
Access          public
parameters      isbn
methods         get
*/

booky.get("/is/:isbn",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length ===0 ){
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

booky.get("/c/:category",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );
    if(getSpecificBook.length === 0) {
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

booky.get("/author", (req,res) => {
    return res.json({authors: database.author});
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

booky.get("/publications", (req,res) => {
    return res.json({publications: database.publication});
});

booky.listen(5111,() => {
    console.log("Server is up and  running");
});