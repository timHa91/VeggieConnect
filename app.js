const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { appendFile } = require('fs');
const User = require('./models/user');
const Post = require('./models/post');
const { findOne } = require('./models/user');

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

app.get('/index', async (req, res) => {
    const testUser = await User.findOne({ username: 'Tester' });
    console.log(testUser)
    res.render('index', { testUser });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.post('/register', async (req, res) => {
    const user = new User(req.body.user);
    user.save();
    res.redirect('/index');
    console.log('user = ' + user);
})

app.get('/login', (req, res) => {
    res.render('login');
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