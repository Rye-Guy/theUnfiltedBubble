//Get out required packages start with express, some middleware and our ORM. 
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//express session used to create user sessions for each login
const session = require('express-session');
//using handlebars as the templating engine of the project. 
const exphbs = require("express-handlebars");
//require our routes
const routes = require('./controllers/router');
//the data scraping functions that populate the databases in our utilities.
// const dataScraping = require('./utils/scapingIntoDB');

//store our user sessions in our MongoDB.
const MongoStore = require('connect-mongo')(session);
//lets get this show on the road!
const app = express();

//set up our views 
app.engine('.hbs', exphbs({defaultLayout: "main", extname: '.hbs'}));
app.set('view engine', '.hbs');
//get that middleware set up
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//express needs to know where it goes to find the files for the client side. 
app.use(express.static('public'));

//set up our database connection!
mongoose.connect('mongodb://localhost/theUnfilteredDB');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () =>{
    console.log('db connected');
});

//creates the object that we will have access to across the application. This is what Express session has been installed for as well as our Mongo Connection.
app.use(session({
    secret: 's9Kwp09n3zcM',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// app.get(dataScraping);

//use the routes we have set up here. Super important this gets used after most of the server code has run. That way we actually have access to the session. This issue has caused a lot of greif. 
app.use('/', routes);
app.listen(process.env.PORT || 8893, () => {
    console.log("Server is running!");
});