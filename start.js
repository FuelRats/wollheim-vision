var express = require('express'),
    stylus = require('stylus'),
    nib = require('nib'),
    morgan = require('morgan');

var app = express();

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib())
}
app.set('views', 'views');
app.set('view engine', 'pug');
app.use(morgan('combined'));
app.use(stylus.middleware({
    src: 'public',
    compile: compile
}));
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('index', {
        title: 'Home'
    })
});

app.set('trust proxy', true);

app.listen(process.env.PORT || 3003)
