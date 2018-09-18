const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const exphbs = require("express-handlebars");
const routes = require('./controllers/router');
// const dataScraping = require('./utils/scapingIntoDB');
const MongoStore = require('connect-mongo')(session);
const app = express();

app.engine('.hbs', exphbs({defaultLayout: "main", extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost/theUnfilteredDB');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () =>{
    console.log('db connected');
});

app.use(session({
    secret: 's9Kwp09n3zcM',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// app.get(dataScraping);
app.use('/', routes);
app.listen(process.env.PORT || 8893, () => {
    console.log("Server is running!");
});