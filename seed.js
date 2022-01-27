'use strict'

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);
//import book schema
const Book = require('./model/book.js');

async function seed() {
   await Book.create({
    title: 'Simulation Hypothesis',
    description: 'Book for lovers of sci-fi, computer science, and video games',
    status: true,
    email: 'rivkadavidowski@fakeuser.com'
  });
  console.log('saved Simulation Hypothesis');

  await Book.create({
    title: 'Rising Above',
    description: 'A story of overcoming childhood trauma and healing',
    status: true,
    email: 'kevinlamarca@fakeuser.com'
  });
  console.log('saved Rising Above');

  await Book.create({
    title: 'Cracking the Coding Interview',
    description: 'A guide to preparing and cracking technical interviews',
    status: true,
    email: 'hambalieujallow@fakeuser.com'
  });
  console.log('saved Cracking the Coding Interview');
  
  mongoose.disconnect();
};

seed();
