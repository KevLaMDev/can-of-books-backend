'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Book = require('./model/book');
const { application } = require('express');

mongoose.connect(process.env.DB_URL)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('Mongoose is connected')
});

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;


app.get('/test', (request, response) => {

  response.send('test request received')

})

app.get('/books', handleGetBooks);
app.post('/books', handlePostBooks);
app.delete('/books/:id', handleDeleteBooks);

async function handlePostBooks(request, response) {
  try {
    const newBook =  await Book.create(request.body);
    response.status(201).send(newBook);
  } catch (error){
    response.status(500).send('Server Error');
  };
}


async function handleDeleteBooks(request, response){
  let id = request.params.id;
  try {
    await Book.findByIdAndDelete(id);
    response.status(204).send('book deleted');

  }catch(error){
    response.status(404).send(`unable to delete ${id}`)

  }
}

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
