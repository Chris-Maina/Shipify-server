
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('errorhandler');
const passport = require('passport');

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

//Initiate our app
const app = express();

//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// PassportJS
app.use(passport.initialize());


// Endpoints
app.use(require('./app/api/routes'));

if (!isProduction) {
    app.use(errorHandler());
}

//Error handlers & middlewares
if (isProduction) {
    app.use((err, req, res) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err,
            }
        });
    });
}

app.listen(8000, () => console.log('Server running on http://localhost:8000/'));
