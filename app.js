var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var Blog = require('./models/blog');
var User = require('./models/user')
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var flash = require('connect-flash');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

var blogRoutes = require('./routes/blogs')
var authRoutes = require('./routes/auth')
// var passportFile = require('./routes/passportfile');


var app = express();

mongoose.connect('mongodb://localhost:27017/rest',{useNewUrlParser: true});

//APP CONFIG
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());




// //PASSPORT CONFIG
app.use(require('express-session')({
	secret: 'i am back again...',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   next();
});

app.use(blogRoutes);
app.use(authRoutes);



app.listen(3000, function(){
	console.log('RESTful Server has started!!!')
});
