const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
require('./services/passport');

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
