const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    const userMaches = users.filter((user)=> user.username=== username);
    return userMaches.lenght > 0;
}

const authenticatedUser = (username,password)=>{ 
const matchingUsers = users.filter((user)=>user.username === username && user.password === password);
return matchingUsers.lenght > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(authenticatedUser(username,password)){
    let accessToken= jwt.sign({data:password}, "access", {expiresIn: 3600});
    req.session.authorization = {accessToken,username};
    return res.status(200).json({message:"User is login sucessfully"})
  }
  else{
  return res.status(401).json({message: "wrong password or username try again"});
}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;
  if(books[isbn]){
    let book = books[isbn];
    book.reviews[username]=review;
    return res.status(200).json({message:"review of the book is save sucessfully"})
  }
  else{
  return res.status(404).json({message: "Book not found"});
}
});

// Creating the delete api to delete review
regd_users.delete("/auth/review/:isbn",(req,res)=>{
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if(books[isbn]){
    let book = books[isbn];
    delete book.reviews[username]
    return res.status(200).send("Review is deleted sucessfully")
  }
  else {
    return res.status(404).json({message: `ISBN ${isbn} not found`});
}
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
