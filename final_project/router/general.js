const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn],null,4));
  }

  return res.status(404).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let booksByAuthor = {};

  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      booksByAuthor[key] = books[key];
    }
  });

  return res.send(JSON.stringify(booksByAuthor,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let booksByTitle = {};

  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      booksByTitle[key] = books[key];
    }
  });

  return res.send(JSON.stringify(booksByTitle,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn].reviews,null,4));
  }

  return res.status(404).json({message: "Book not found"});
});

// Get all books using async-await with Axios
const getAllBooks = async () => {
  const response = await axios.get('http://localhost:5000/');
  return response.data;
};

// Get book details based on ISBN using Promises with Axios
const getBookByISBN = (isbn) => {
  return axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => response.data);
};

// Get book details based on author using Promises with Axios
const getBooksByAuthor = (author) => {
  return axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`)
    .then((response) => response.data);
};

// Get book details based on title using Promises with Axios
const getBooksByTitle = (title) => {
  return axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`)
    .then((response) => response.data);
};

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
