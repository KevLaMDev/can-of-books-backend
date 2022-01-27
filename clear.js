'use strict'

//require in mongoose
require('dotenv').config();
const mongoose = require('mongoose');
// require in dotenv config
//connect to mongoose
mongoose.connect(process.env.DB_URL);
// require in model
const Book = require('./model/book')

async function clear() {
  try {
    await Book.deleteMany({});
    console.log('books deleted');
  } catch (err){
    console.error(err);
  } finally {
    mongoose.disconnect(); // don't forget to disconnect from the server in the finally code block
  }
};

// we need to call the func clear at the end
clear();

