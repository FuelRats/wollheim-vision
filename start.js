var express = require('express'),
    stylus = require('stylus'),
    nib = require('nib'),
    morgan = require('morgan');

const fs = require('fs');

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

app.get('/videos/background.webm', function(req, res) {
    const path = './public/videos/wollheim.webm'
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/webm',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/webm',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
});

app.get('/videos/background.mp4', function(req, res) {
    const path = './public/videos/wollheim_background_video_no_sound.mp4'
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
});

app.set('trust proxy', true);

app.listen(process.env.PORT || 3003)
