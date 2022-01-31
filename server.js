'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Book = require('./model/book');
const verifyUser = require('./auth.js');
// const { application } = require('express');
// const axios  = require('axios');

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
app.put('/books/:id', handlePutBooks);
app.get('/user', handleGetUser);

async function handlePostBooks(request, response) {
  verifyUser(request, async (error, user) => {
    if (error) {
      console.log(error);
      response.send('invalid token');
    } else {
      try {
        let book = await Book.findOne({_id: id, email: user.email});
        if (!book) {
          response.status(400).send('unable to find book');
        } else {
          const newBook = await Book.create(request.body);
          response.status(201).send(newBook);
        }
      } catch (error) {
        response.status(500).send('Server Error');
      };
    }
  })
}

async function handleDeleteBooks(request, response) {
  verifyUser(request, async (error, user) => {
    if (error) {
      console.log(error);
      response.send('invalid token');
    } else {
      let id = request.params.id;
      try {
        // use await findByIdAndDelete method on <modelSchema> passing in the saved param
        let book = await Book.findOne({_id: id, email: user.email});
        if (!book) {
          response.status(400).send('unable to find book');
        } else {
          let deletedBook = await Book.findByIdAndDelete(id);
          response.status(204).send(deletedBook);
        };
      } catch (error) {
        response.status(404).send(`unable to delete ${id}`)
      }
    }
  })
}


async function handleGetBooks(request, response) {

  verifyUser(request, async (error, user) => {
    if (error) {
      console.log(error);
      response.send('invalid token');
    } else {
      try {
        let booksFromDb = await Book.find({ email: user.email });
        if (booksFromDb.length > 0) {
          response.status(200).send(booksFromDb);
        } else {
          response.status(404).send('No Books Found');
        }

      } catch (error) {
        response.status(500).send('Server Error');
      }
    }
  })
};

// use await <modelSchema>.find(queryObj)
// if the result is not empty
// send it to the client
// else send not found
// catch error 


async function handlePutBooks(request, response) {
  verifyUser(request, async (error, user) => {
    if (error) {
      console.log(error);
      response.send('invalid token');
    } else {
      let id = request.params.id;
      try {
        let book = await Book.findOne({_id: id, email: user.email});
        if (!book) {
          response.status(400).send('unable to find book');
        } else {
          let updatedBook = await Book.findByIdAndUpdate(id, request.body, { new: false, overwrite: true });
          response.status(200).send(updatedBook);
        }
      } catch (error) {
        response.status(400).send(`Unable to update book ${id}`);
      };
    }
  })
}



function handleGetUser(request, response) {
  verifyUser(request, (error, user) => {
    if (error) {
      response.send(error);
    } else {
      response.send(user)
    }
  })
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
