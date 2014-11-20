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


var application = new mongoose.Schema({
  _step:      { type: Number, default: 1 },
  firstname:  { type: String, validate: [maxLengthValidator(30), alphaValidator] },
  lastname:   { type: String, validate: [maxLengthValidator(30), alphaValidator] },
  middlename: { type: String, validate: [maxLengthValidator(30), alphaValidator] },
  phone:      { type: Number },
  gender:     { type: String },
  passport: {
    number:      { type: Number, validate: [fixedLengthValidator(6), numericValidator] },
    series:      { type: Number, validate: [fixedLengthValidator(4), numericValidator] },
    dateOfIssue: { type: Date,   validate: [ /* Probably Date object, probably string... */ ] },
    issuedBy:    { type: String, validate: maxLengthValidator(150) },
    depCode:     { type: Number, validate: [fixedLengthValidator(6), numericValidator] },
    regAddress:  { type: String, validate: [maxLengthValidator(150)] }
  },
  job: {
    orgName: { type: String, validate: [maxLengthValidator(50), alphaNumericValidator] },
    address:  {  type: String,  validate: [maxLengthValidator(150)] },
    position: {  type: String,  validate: [maxLengthValidator(50), alphaNumericValidator] },
    phone:    {  type: String,  validate: [maxLengthValidator(20)] },
    contacts: [{ type: String,  validate: [alphaValidator, maxLengthValidator(50)] }]
  },
  misc: {
    residentialAddress: { type: String, validate: maxLengthValidator },
    officeCityId: mongoose.Schema.ObjectId,    
    officeId: mongoose.Schema.ObjectId,    
  }
});

module.exports = application;
