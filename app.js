var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var applicationsApi = require('./routes/api/application');

mongoose.connect('mongodb://localhost');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(expressSession({ secret: 'keyboard cat' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', index.landing);
app.post('/step1', index.step1, index.moveToNextStep);
app.post('/step2', index.step2, index.moveToNextStep);
app.post('/step3', index.step3, index.moveToNextStep);
app.post('/step4', index.step4, index.moveToNextStep);
// app.use('/api/applications', applicationsApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(3000)

module.exports = app;
