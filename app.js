const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { appendFile } = require('fs');
const User = require('./models/user');
const Post = require('./models/post');
const { findOne, findByUsername, findById } = require('./models/user');
const bcrypt = require('bcrypt');
const session = require('express-session');

/*const passport = require('passport');
const LocalStrategy = require('passport-local');*/


mongoose.connect('mongodb://localhost:27017/veggie-connect', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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
/*
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
*/

app.get('/:id/index', async (req, res) => {
    if (!req.session.user_id) {
        res.send('You need to be logged in')
    }
    else {
        const user = await User.findById(req.session.user_id);
        res.render('index', { user });

    }
});

app.post('/:id/index', async (req, res) => {
    const post = new Post(req.body.post);
    const user = await User.findById(req.params.id).populate('posts');
    post.date = new Date();
    await post.save();
    user.posts.push(post);
    await user.save();
    console.log(user.posts)
    res.render('index', { user, post });
});

app.get('/register', (req, res) => {
    res.render('register');
});


app.post('/register', async (req, res) => {
    const { username, password, email, firstname, lastname, description, gender, age, displayGender } = req.body;

    try {
        const hash = await bcrypt.hash(password, 12);
        const user = new User({ password: hash, username, email, firstname, lastname, description, gender, age, displayGender });
        await user.save();
        req.session.user_id = user._id;
        res.redirect(`${user._id}/index`);
    } catch (e) {
        if (e.message.indexOf('11000') != -1) {
            res.send('User or E-Mail already exists!');
        }
    }
})

app.get('/create', (req, res) => {
    res.render('create');
});

app.get('/home', (req, res) => {
    res.render('home');
});


app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username })
    if (user !== null) {
        const validPassword = await bcrypt.compare(password, user.password)
        if (validPassword) {
            req.session.user_id = user._id;
            res.redirect(`${user._id}/index`);
        } else {
            res.send('Wrong credentials!');
        }
    } else {
        res.send('Wrong credentials!');
    }
});

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('login');
})

app.get('/:id/post', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('post', { user });
});

/* app.post('/:id/post', async (req, res) => {
    const post = new Post(req.body.post);
    console.log('post = ' + post);
    post.save();
    res.redirect('/index');
}); */



app.listen(3000, () => {
    console.log("Serving on port 3000");
});