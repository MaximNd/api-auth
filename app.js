const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes/users');
const mongoose = require('mongoose');
const config = require('./config/config');
const auth = require('./passport');


mongoose.connect(config.dbUrl)
    .then((data) => console.log(`Database <${data.connections[0].name}> connection success`))
    .catch(err => console.log(`Database connection error: ${err}`));;

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(auth.initialize({}));


// Routes
app.use('/users', routes);


// Listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});