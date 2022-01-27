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
    // use create method on <modelSchema> passing in request.body
    // send back 201 status and the posted data 
    const newBook =  await Book.create(request.body);
    response.status(201).send(newBook);
  } catch (error){
    response.status(500).send('Server Error');
  };
}


async function handleDeleteBooks(request, response){
  // retrieve id from request params and save to var
  let id = request.params.id;
  try {
    // use await findByIdAndDelete method on <modelSchema> passing in the saved param
    let deletedBook = await Book.findByIdAndDelete(id);
    response.status(204).send(deletedBook);

  }catch(error){
    response.status(404).send(`unable to delete ${id}`)
  }
}

async function handleGetBooks(request, response) {
  let queryObject = {}; // create the query obj
  
  // if the request has an email query param
    // make email prop with email value on query obj
  if (request.query.email){ 
    queryObject = {
      email: request.query.email
    };
  };

  // use await <modelSchema>.find(queryObj)
  // if the result is not empty
    // send it to the client
  // else send not found
  // catch error 
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
