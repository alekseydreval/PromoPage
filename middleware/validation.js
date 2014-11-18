// A list of validation middlewares for each application step

module.exports = new Array(4);

module.exports[0] = function(req, res, next) {
  var errors,
      data = req.body,
      requiredFields = ['firstname', 'lastname', 'middlename', 'phone', 'gender'],
      alphaFields = ['firstname', 'lastname', 'middlename'];

  
  requiredFields.forEach(function(field) {
    req.assert(data[field], 'Не может быть пустым').notEmpty();
  });

  alphaFields.forEach(function(field) {
    req.assert(data[field], 'Содержит некорректные символы').isAlpha();
  });


  errors = req.validationErrors();
  if (errors)
    res.json({ errors: errors }, 400);
  else
    next();

};

module.exports[1] = function(req, res, next) {
  var errors,
      data = req.body,
      requiredFields = ['number', 'series', 'date_of_issue', 'issued_by', 'dep_code', 'reg_address'],
      numericalFields = ['number', 'series', 'dep_code'];

  req.sanitize('dep_code').blacklist('-');

  requiredFields.forEach(function(field) {
    req.assert(data[field], 'Не может быть пустым').notEmpty();
  });

  numericalFields.forEach(function(field) {
    req.sanitize(field).toInt();
    req.assert(data[field], 'Содержит некорректные символы').isInt();
  });

  req.assert(data['number'], 'Номер паспорта должен составлять 6 символов').len(6);
  req.assert(data['series'], 'Серия паспорта должена составлять 4 символа').len(4);
  req.assert(data['issued_by'], 'Название подразделения не должно превышать 150 символов').len(1, 150);
  req.assert(data['date_of_issue'], 'Неверный формат даты').matches('\d\d\.\d\d.\d\d\d\d');

  errors = req.validationErrors();
  if (errors)
    res.json({ errors: errors }, 400);
  else
    next();

};

module.exports[2] = function(req, res, next) { next(); };
module.exports[3] = function(req, res, next) { next(); };
