import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import sassMiddleware from 'node-sass-middleware';
import api from './routers/api/';
import glyphs from './routers/glyphs/';
import index from './routers/';

const app = express();
const port = 3000;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public/scss'),
  dest: path.join(__dirname, 'public/css'),
  debug: true,
  outputStyle: 'compressed',
  prefix: '/public/css',
}));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use('/api', api);
app.use('/glyphs', glyphs);
app.use('/', index);

app.listen(port, () => {
  console.log(`Express server currently running on port ${port}`);
});