var express = require('express');
var mongoose = require('mongoose');
var Application = mongoose.model('application', require('../models/application.js'));


/**
 * Check for a malicious user that might want to skip some application steps
 * @param  {[Number]} stepToPass [Step that should be passed now]
 * @return {[type]}              [A middleware function]
 */

module.exports.checkStep = function(req, res, next) {
  if(!req.session._applicationStep)
    req.session._applicationStep = 1;

  if(!req.body.stepToPass)
    req.body.stepToPass = 0;

  // Allow to redo a previous step
  if(req.body.stepToPass > req.session._applicationStep) {
    res.writeHead(403);
    res.end('Wrong application step');
  }
  else
    next();
};

module.exports.update = function(req, res, next) {
  if(!req.session._applicationId) {
    Application.create(req.body, function(err, res) {
      if(err)
        return next(err);
      console.log(res)
      
      req.session._applicationId = res._id;
      next()
    });
  } else {
    Application.findOneAndUpdate({ _id: req.session._applicationId }, req.body.application, 
                                                       { new: true }, function(err) {
      if(err)
        next(err);
      else
        next();
    })
  }
};

module.exports.nextStep = function(req, res) {
  req.session._applicationStep = req.session._applicationStep < 4 ? req.session._applicationStep + 1 : 'finished'

  res.json({ nextStep: req.session._applicationStep }, 200);
};

module.exports.landing = function(req, res) {
  res.render('index', { title: 'Express' });
};

