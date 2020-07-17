const express = require('express');
const apis = new express.Router();

apis.use('/user', require('./../controller/user'))
apis.use('/gallery', require('./../controller/gallery'));

module.exports = apis;