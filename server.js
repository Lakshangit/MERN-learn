const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-Parser');
const passport = require("passport");

// require api/items
const users = require('./routs/api/Users');

const app = express();

// bodyparser midleware
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;

// connect db
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('db connect'))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// use routes(items)
app.use('/api/Users', users);

const port = process.env.PORT || 5000; 

app.listen(port, () => console.log(`server run on ${port}`)); 

