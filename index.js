const express = require("express");

var bodyParser = require("body-parser");

//database
const database=require("./database");

//initialise express
const booky=express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

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

/*Route         /book/new
Description     add new books
Access          public
parameters      none
methods         post
*/

booky.post("/book/new",(req,res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBook: database.books});
});

/*Route         /author/new
Description     add new authors
Access          public
parameters      none
methods         post
*/

booky.post("/author/new",(req,res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json(databse.author);
});

/*Route         /publication/new
Description     add new publications
Access          public
parameters      none
methods         post
*/

booky.post("/publication/new",(req,res) => {
    const newPublication = req.body;
    database.author.push(newPublication);
    return res.json(databse.publication);
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
            message: "Successfullu updated publications"
        }
    );
});

booky.listen(5111,() => {
    console.log("Server is up and  running");
});