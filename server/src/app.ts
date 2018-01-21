
require('dotenv').config();

import { Request, Response, NextFunction } from "express";

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3001, MONGODB_HOST } = process.env;

if (!MONGODB_HOST) {
  throw new Error('.env MONGODB_HOST not found.');
}
 
async function initialize() {
  const app = express();

  // enable CORS
  app.use((req:Request, res:Response, next:NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  });

  console.log('api server initializing..');

  mongoose.Promise = global.Promise;
  const db = await mongoose.connect(MONGODB_HOST);

  console.log('model loading start');
  // load models
  require('./models/Label').default(db);
  require('./models/Memo').default(db);
  console.log('model all loaded.')

  // load api route
  app.use(bodyParser.json());
  app.use('/api', require('./api'));

  app.listen(PORT);

  console.log(`api server inialize complete. started on port : ${PORT}`);
}

try {
  initialize();
} catch (e) {
  console.error(e);
}