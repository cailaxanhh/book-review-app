const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username && !password) {
    return res.status(404).json({ message: "Unable to sign up" });
  }

  if (isValid(username, password)) {
    users.push({ username: username, password: password });
    return res.status(200).send("User successfully signed up");
  }

  return res.status(404).json({ message: "User already exists!" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  res.send(books)
  return res.status(200).json({ data: books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  if (isbn < 1 || isbn > 10) {
    res.send("Can not find the book under the isbn of " + isbn);
    return res.status(404).json({ message: "Cant found" });
  }
  res.send(books[isbn]);
  return res.status(200).json({ data: books[isbn] });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;

  const index = Object.keys(books).filter(i => books[i].author === author);

  const booksByAuthor = index.map(i => books[i])

  if (booksByAuthor.length < 1) {
    res.send("Can not find the book by author " + author);
    return res.status(404).json({ message: "Cant found" });
  }
  res.send(booksByAuthor);
  return res.status(200).json({ data: booksByAuthor });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.author.title

  const index = Object.keys(books).filter(i => books[i].title === title);

  const booksUnderTitle = index.map(i => books[i])[0];

  if (booksByAuthor.length < 1) {
    res.send("Can not find the book under the name " + title);
    return res.status(404).json({ message: "Cant found" });
  }

  res.send(booksUnderTitle);
  return res.status(200).json({ data: booksUnderTitle });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  if (isbn < 1 || isbn > 10) {
    res.send("Can not find the book under the isbn of " + isbn);
    return res.status(404).json({ message: "Cant found" });
  }
  res.send(books[isbn].reviews);
  return res.status(200).json({ data: books[isbn].reviews });
});


module.exports.general = public_users;
