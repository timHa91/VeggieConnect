const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { appendFile } = require('fs');
const User = require('./models/user');
const Post = require('./models/post');
const { findOne } = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const { nextTick } = require('process');

// mongoose.connect('mongodb://localhost:27017/veggie-connect').
//     catch(error => console.log(error));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.engine('ejs', ejsMate);
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static("public"));

const sessionConfig = {
    secret: 'thiswillchange',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/index', async (req, res) => {
    // const testUser = await User.findOne({ username: 'Tester' });
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {

            res.redirect('/index');
        })
    } catch (e) {
        res.redirect('/register');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    res.render('index');
});

app.get('/:id/post', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('post', { user });
});

app.post('/:id/post', async (req, res) => {
    const post = new Post(req.body.post);
    console.log('post = ' + post);
    post.save();
    res.redirect('/index');
});



app.listen(3000, () => {
    console.log("Serving on port 3000");
});