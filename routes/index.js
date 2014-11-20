var express = require('express');
var mongoose = require('mongoose');
var Application = mongoose.model('application', require('../models/application.js'));


/**
 * Check for a malicious user that might want to skip some application steps
 * @param  {[Number]} stepToPass [Step that should be passed now]
 * @return {[type]}              [A middleware function]
 */
var checkStep = function(stepToPass) {
  return function(req, res, next) {
    console.log(req.session._applicationStep, stepToPass);

    if(!req.session._applicationStep) {
      req.session._applicationStep = 1;
    }

    // Allow to redo a previous step
    if(stepToPass > req.session._applicationStep) {
      res.writeHead(403);
      res.end('Wrong application step');
    }
    else
      next();
  }
};

var moveToNextStep = function(req, res) {
  req.session._applicationStep += 1;
  res.json({}, 200);
};

var updateApplication = function(req, res, next) {
  if(!req.session._applicationId) {
    Application.create(req.body, function(err) {
      if(err)
        return next(err);
      req.session._applicationId = res._id;
      next()
    });
  } else {
    Application.update({ _id: req.session._applicationId }, function(err) {
      if(err)
        next(err);
      else
        next();
    })
  }
};


module.exports.step1 = [checkStep(1), updateApplication];

module.exports.step2 = [checkStep(2), updateApplication];

module.exports.step3 = [checkStep(3), updateApplication];

module.exports.step4 = [checkStep(4), updateApplication, function (req, res) {
  delete req.session.currentStep;
}];

module.exports.landing = function(req, res) {
  res.render('index', { title: 'Express' });
};

module.exports.moveToNextStep = moveToNextStep;
