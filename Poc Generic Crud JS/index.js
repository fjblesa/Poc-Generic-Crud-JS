'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const crudRouter = require('./router/crud.js');
const dataSource = require('./dataSource/sqlite.js');
const validationFactory = require('./validations/validationFactory.js');

const app = express();



app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));



const data = new dataSource();
const validations = new validationFactory();
const crud = new crudRouter(app, data, validations);



app.listen(3000);
