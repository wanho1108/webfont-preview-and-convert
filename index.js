import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import sassMiddleware from 'node-sass-middleware';
import fontkit from 'fontkit';

const app = express();
const storage = multer.diskStorage({
  destination(req, file, callback) {
    console.log(file);
    const path = `upload/${Date.now()}/`;
    fs.exists(path, exist => {
      if (!exist) {
        return fs.mkdir(path, error => callback(error, path));
      }
      return callback(null, path);
    });
  },
  filename(req, file, callback) {
    callback(null, file.originalname);
  }
});
const upload = multer({ storage });

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public/scss'),
  dest: path.join(__dirname, 'public/css'),
  debug: true,
  outputStyle: 'compressed',
  prefix: '/public/css',
}));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static(path.join(__dirname, 'upload')));

app.get('/', (req, res) => {
  res.render('index', {title: 'index.html'});
});

app.get('/file-drag-upload', (req, res) => {
  res.render('file-drag-upload', { title: 'file-drag-upload.html' });
});

app.post('/template', (req, res) => {
  res.render('template', {fontname: "Malgun Gothic"});
});

app.get('/download/:path/:filename', (req, res) => {
  const filePath = path.join(__dirname, req.params.path, req.params.filename);
  res.download(filePath);  
});

app.post('/upload', upload.array('file[]', 10), (req, res) => {
  try {
    const fonts = [];
    req.files.forEach((file) => {
      const font = fontkit.openSync(file.path);
      const name = file.filename;
      const originalName = file.originalname;
      const path = file.destination;
      const characters = font.characterSet;
      const charactersDecoding = characters.map(character => String.fromCharCode(character)).join('');
      fonts.push({ name, originalName, path, characters, charactersDecoding });
    });    
    // res.render('font-preview', { title: 'font-preview', fonts });
    // res.render('font-preview', {fontName, fontOriginalName, fontPath, fontCharactersDecoding, fontLength});
    // res.render('font-preview', { title: 'font-preview', fontName, fontOriginalName, fontPath, fontCharactersDecoding, fontLength });

    // let originalName = '';
    // let fileName = '';
    // let mimeType = '';
    // let size = 0;

    // if (Array.isArray(files)) {
    //   console.log(`files is array~`);
    //   originalName = files[0].originalname;
    //   fileName = files[0].filename;
    //   mimeType = files[0].mimetype;
    //   size = files[0].size;
    // } else {
    //   console.log(`files is not array~`);
    //   originalName = files[0].originalname;
    //   fileName = files[0].filename;
    //   mimeType = files[0].mimetype;
    //   size = files[0].size;
    // }
    // res.status(200);
    // res.json({
    //   status: 200,
    //   mesasge: 'ok'
    // });
    // res.end();
    // console.log(`file inform : ${originalName}, ${fileName}, ${mimeType}, ${size}`);
    // res.writeHead('200', { 'Content-type': 'text/html; charset=utf8' });
    // res.write('<h3>upload success</h3>');
    // res.write(`<p>original name = ${originalName}, saved name = ${fileName}<p>`);
    // res.write(`<p>mime type : ${mimeType}<p>`);
    // res.write(`<p>file size : ${size}<p>`);
    // res.end();
  } catch (err) {    
    console.dir(err.stack);
    res.writeHead('200', { 'Content-type': 'text/html; charset=utf8' });
    res.write('<h3>upload fail</h3>');
    res.end();
  }
});

app.listen(3000, () => {
  console.log('Hello Webfont Preview and Convert');
});
