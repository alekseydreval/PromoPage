var express = require('express');
var request = require('request');
var dadataConfig = require('../config').dadata;
var _ = require('lodash');

module.exports = function (req, res) {
  var apiKey = dadataConfig.keys.API_KEY, 
      secretKey, apiUrl, body;

  if(req.body.queryType == 'fio') {
    apiUrl = dadataConfig.suggestionsURL;
    body = { query: req.body.query };
  } else {
    apiUrl = dadataConfig.standartizationURL;
    body = [ req.body.query ];
    secretKey = dadataConfig.keys.API_STANDARTIZATION_KEY;
  }

  apiUrl += req.body.queryType;

  options = {
    url: apiUrl,
    headers: {}
  };


  options['headers']['Authorization'] = 'Token ' + apiKey;
  if(secretKey) options['headers']['X-Secret']      = secretKey
  options['headers']['Accept']        = 'application/json';
  options['headers']['Content-Type']  = 'application/json';
  options['body'] = JSON.stringify(body);

  console.log(req.body, apiUrl, options);

  request.post(options, function(error, response, body) {
    console.log(error, body);
    if(!error) 
      res.json(response, 200);
    else
      res.json(error, 500);
  });

}
