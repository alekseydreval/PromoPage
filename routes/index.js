var express = require('express');
var router = express.Router();
var validators = require('../middleware/validation');


/**
 * Check for a malicious user that might want to skip some application steps
 * @param  {[Number]} stepToPass [Step that should be passed now]
 * @return {[type]}              [A middleware function]
 */
var checkStep = function(stepToPass) {
  return function(req, res, next) {
    if(!req.session.currentStep) {
      req.session.currentStep = 1;
      next();
      return;
    }

    // Allow to redo a previous step
    if(stepToPass > req.session.currentStep)
      res.write('Wrong application step', 403);
    else
      next();

  }
};

var moveToNextStep = function(req, res) {
  req.session.currentStep += 1;
  res.json({}, 200);
};

var updateApplication = function(req, res, next) {
  if(req.session.currentApplication) {
    // Find and update
  } else {
    // Find or create
  }
};



router.post('/step1', checkStep(1), validators[0], updateApplication, moveToNextStep);
router.post('/step2', checkStep(2), validators[1], updateApplication, moveToNextStep);
router.post('/step3', checkStep(3), validators[2], updateApplication, moveToNextStep);
router.post('/step4', checkStep(4), validators[3], updateApplication, function (req, res) {
  delete req.session.currentStep;
});


/* GET landing page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
