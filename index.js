/*if(process.env.NODE_ENV != "production"){

  require("dotenv").config({ path: "./config.env"})
}
const express = require("express");
const path = require("path")
const engine = require("ejs-mate")
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session")
const flash = require("connect-flash");
const User = require("./models/User")
const passport = require("passport");
var LocalStrategy = require('passport-local');

const dbUrl = process.env.DB_URI ||"mongodb://127.0.0.1:27017/shopping-cart"


const port = process.env.PORT || 5000

const sessionSecret = process.env.SESSION_SECRET || 'this is a secret session'

//Connect to DB
mongoose.connect(dbUrl, { useNewUrlParser: true,useUnifiedTopology: true })
.then(()=> console.log(" DB CONNECTED!"))
.catch((err)=> console.log(err));



const sessionflash = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {

      httpOnly:true,
      expires: Date.now()  + 7 *24*60*60*1000
    }
  };
  
  app.use(session(sessionflash))
  app.use(flash());
  app.use(passport.authenticate('session'));


  app.use((req, res, next) => {

    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();

  });
  


// All Product Routes
const productRouter = require("./routes/productRoutes");

//Review Routes

const reviewRouter = require("./routes/reviewRoutes")

// Auth router

const authRouter = require("./routes/authRoutes")


// Middlewares
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.engine("ejs", engine)
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views" ))
app.use(express.static(path.join(__dirname,'public')))



// Passport 

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//home route
app.get("/", (req,res)=>{

    res.render("index")
})



// Routers

app.use( productRouter); 
app.use(reviewRouter);
app.use(authRouter);



app.listen(port, ()=>{

    console.log(` server running at port ${port}`)
})
*/


const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


// Routes
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');

// APIs
const productApis = require('./routes/api/productapi');


mongoose.connect('mongodb://localhost:27017/shopping-app')
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log(err));


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


const sessionConfig = {
    secret: 'weneedsomebettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000* 60 * 60 * 24 * 7 * 1,
        maxAge:1000* 60 * 60 * 24 * 7 * 1
    }
}

app.use(session(sessionConfig));
app.use(flash());


// Initialising middleware for passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Telling the passport to check for username and password using authenticate method provided by the passport-local-mongoose package
passport.use(new LocalStrategy(User.authenticate())); 

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});





app.get('/', (req, res) => {
    res.render('home');
});


app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(productApis);
app.use(cartRoutes);


const port = 3000;

app.listen(port, () => {
    console.log(`server running at port ${port}`);
});