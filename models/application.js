var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var _ = require('lodash');

/**
 * Validation functions
 */
var maxLengthValidator = function(length) {
  return validate({
    validator: 'isLength',
    arguments: [1, length],
    message: 'Значение поля не должно превышать ' + length + ' символов'
  });
};

var fixedLengthValidator = function(length) {
  return validate({
    validator: 'isLength',
    arguments: [length],
    message: 'Поле должно содержпть ' + length  + ' символов'
  });
};

var numericValidator = validate({
  validator: 'isNumeric',
  message: 'Поле должно содержать только числа'
});

var alphaNumericValidator = validate({
  validator: 'isAlphanumeric',
  message: 'Поле содержит недопустимые символы'
});

var alphaValidator = validate({
  validator: 'isAlpha',
  message: 'Поле содержит недопустимые символы'
});

var reqMsg = '{PATH} Не может быть пустым'


var application = new mongoose.Schema({
  _step:      { type: Number, default: 1 },
  firstname:  { type: String, required: reqMsg, validate: [maxLengthValidator(30), alphaValidator] },
  lastname:   { type: String, required: reqMsg, validate: [maxLengthValidator(30), alphaValidator] },
  middlename: { type: String, required: reqMsg, validate: [maxLengthValidator(30), alphaValidator] },
  phone:      { type: Number, required: reqMsg },
  gender:     { type: String, required: reqMsg },
  passport: {
    number:      { type: Number, required: reqMsg, validate: [fixedLengthValidator(6), numericValidator] },
    series:      { type: Number, required: reqMsg, validate: [fixedLengthValidator(4), numericValidator] },
    dateOfIssue: { type: Date,   required: reqMsg, validate: [ /* Probably Date object, probably string... */ ] },
    issuedBy:    { type: String, required: reqMsg, validate: maxLengthValidator(150) },
    depCode:     { type: Number, required: reqMsg, validate: [fixedLengthValidator(6), numericValidator] },
    regAddress:  { type: String, required: reqMsg, validate: [maxLengthValidator(150)] }
  },
  job: {
    orgName: { type: String, validate: [maxLengthValidator(50), alphaNumericValidator] },
    address:  {  type: String,  required: reqMsg, validate: [maxLengthValidator(150)] },
    position: {  type: String,  required: reqMsg, validate: [maxLengthValidator(50), alphaNumericValidator] },
    phone:    {  type: String,  required: reqMsg, validate: [maxLengthValidator(20)] },
    contacts: [{ type: String,  required: reqMsg, validate: [alphaValidator, maxLengthValidator(50)] }]
  },
  misc: {
    residentialAddress: { type: String, validate: maxLengthValidator },
    officeCityId: mongoose.Schema.ObjectId,    
    officeId: mongoose.Schema.ObjectId,    
  }
});

application.pre('validate', function(next) {
  var t = this,
      passFields = ['passport.number', 'passport.series', 'passport.dateOfIssue', 
                    'passport.issuedBy', 'passport.depCode', 'passport.regAddress'],
      jobFields  = ['job.orgName', 'job.address', 'job.position', 'job.phone', 'job.contacts'],
      fieldsToOmmit = [];


  if(this._step == 1)
    fieldsToOmit = jobFields.concat(passFields);
  else if(this._step == 2)
    fieldsToOmit = jobFields;

  fieldsToOmit.forEach(function(f) {
    t.schema.path(f).required(false);
  });

  next();
});

module.exports = application;
