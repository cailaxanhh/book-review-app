const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  let usersWithTheSameName = users.filter(u => u.username === username);
  if (usersWithTheSameName.length > 0) {
    return true;
  }
  return false;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validUsers = users.filter(u => u.username === username && u.password === password);
  if (validUsers.length > 0) {
    return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username && !password) {
    return res.status(404).json({ message: "Error while logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', {
      expiresIn: 60 * 60,
    });

    req.session.authorization = {
      accessToken, username,
    }

    return res.status(200).send("User successfully logged in");
  }

  return res.status(208).json({ message: "Invalid login. Check username and password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  const newRev = req.query.review;
  const username = req.session.authorization.username;
  const reviews = books[isbn].reviews;

  if (isbn < 1 || isbn > 10) {
    res.send("Can not find the book under the isbn of " + isbn);
    return res.status(404).json({ message: "Cant found" });
  }

  if (Object.keys(reviews).includes(name)) {
    reviews[username] = newRev;
    res.send(books[isbn].reviews);
    return res.status(200).json({ message: "Edited your review successfully" });
  }
  reviews[username] = newRev;
  res.send(books[isbn].reviews);
  return res.status(200).json({ message: "Added a review successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const username = req.session.authorization.username;
  const reviews = books[isbn].reviews;

  if (isbn < 1 || isbn > 10) {
    res.send("Can not find the book under the isbn of " + isbn);
    return res.status(404).json({ message: "Cant found" });
  }

  if (Object.keys(reviews).includes(name)) {
    delete reviews[username];
    res.send(books[isbn].reviews);
    return res.status(200).json({ message: "Deleted your review successfully" });
  }
  return res.status(404).json({ message: "Can not delete other user/'s review" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
