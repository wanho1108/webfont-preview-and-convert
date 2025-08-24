import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as sass from 'sass';
import fs from 'fs';
import api from './routers/api/index.js';
import glyphs from './routers/glyphs/index.js';
import index from './routers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public/css', (req, res, next) => {
  if (req.url.endsWith('.css')) {
    const scssPath = path.join(__dirname, 'public/scss', req.url.replace('.css', '.scss'));
    const cssPath = path.join(__dirname, 'public/css', req.url);

    if (fs.existsSync(scssPath)) {
      try {
        const result = sass.compile(scssPath, { style: 'compressed' });

        // Create directory if it doesn't exist
        fs.mkdirSync(path.dirname(cssPath), { recursive: true });

        // Write compiled CSS
        fs.writeFileSync(cssPath, result.css);

        res.setHeader('Content-Type', 'text/css');
        res.send(result.css);
        return;
      } catch (error) {
        console.error('SCSS compilation error:', error);
        res.status(500).send('SCSS compilation error');
        return;
      }
    }
  }
  next();
});
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use('/api', api);
app.use('/glyphs', glyphs);
app.use('/', index);

export default app;