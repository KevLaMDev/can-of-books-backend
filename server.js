'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Book = require('./model/book');

mongoose.connect(process.env.DB_URL)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('Mongoose is connected')
});

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;


app.get('/test', (request, response) => {

  response.send('test request received')

})

app.get('/books', handleGetBooks);


async function handleGetBooks(request, response) {
  let queryObject = {}; 
  
  if (request.query.email){
    queryObject = {
      email: request.query.email
    };
  };

  // let booksFromDb = await Book.find(queryObject);
  // response.send(booksFromDb);

  try {
    let booksFromDb = await Book.find(queryObject);
    if (booksFromDb.length > 0) {
      response.status(200).send(booksFromDb);
    } else {
      response.status(404).send('No Books Found');
    }

  } catch (error) {
    response.status(500).send('Server Error');
  }

 }

app.listen(PORT, () => console.log(`listening on ${PORT}`));
