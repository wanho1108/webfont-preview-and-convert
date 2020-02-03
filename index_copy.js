import fs from 'fs-extra';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import sassMiddleware from 'node-sass-middleware';
import fontkit from 'fontkit';
import JSZip from 'node-zip';
import randomstring from 'randomstring';
import shellExec from 'shell-exec';
import Fontmin from 'fontmin';
// import CFonts from 'cfonts';
// import figlet from 'figlet';

const app = express();

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

app.get('/', (req, res) => {
  res.render('index', {title: 'index.html'});
});

app.get('/file-drag-upload', (req, res) => {
  res.render('file-drag-upload', { title: 'file-drag-upload.html' });
});

app.post('/template', (req, res) => {
  res.render('template', {fontname: "Malgun Gothic"});
});

app.get('/lorem', (req, res) => {
  res.render('lorem');
});

app.get('/3d', (req, res) => {
  const options = {
    font: '3d',              // define the font face
    align: 'left',              // define text alignment
    colors: ['system'],         // define all colors
    background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: 1,           // define letter spacing
    lineHeight: 1,              // define the line height
    space: false,                // define if the output text should have empty lines on top and on the bottom
    maxLength: '0',             // define how many character can be on one line
  };
  // const prettyFont = CFonts.render('DRAG & DROP FILES HERE', options);
  // res.render('3d', { prettyFont });

  // const a = CFonts.render('DRAG & DROP', options).string;
  // const b = CFonts.render('TTF FILES HERE', options).string;


  const a = figlet.textSync('DRAG & DROP', 'Ghost');
  const b = figlet.textSync('TTF FILES HERE', 'Ghost');
  res.render('3d', { data: [a, b] });

  // figlet.text('DRAG & DROP FILES HERE', {
  //   font: 'Ghost',
  //   horizontalLayout: 'default',
  //   verticalLayout: 'default'
  // }, function (err, data) {
  //   if (err) {
  //     console.log('Something went wrong...');
  //     console.dir(err);
  //     return;
  //   }
  //     console.log(data);
  //     res.render('3d', { data });
  // });
});

app.get('/otf2ttf', (req, res) => { // otf 올린 경우 ttf 로 변환
  const path = 'upload/test.ttf';
  const fontmin = new Fontmin()
    .src(path)
    .use(Fontmin.glyph({
      text: 'abcd efg',
      hinting: false         // keep ttf hint info (fpgm, prep, cvt). default = true
    }))
    .use(Fontmin.ttf2svg())
    .use(Fontmin.ttf2woff2())
    .use(Fontmin.ttf2woff())
    .use(Fontmin.ttf2eot())
    .dest('upload/test9/');
    fontmin.run(function (err, files) {
      if (err) {
          throw err;
      }
      console.log('succ');
  });
  res.send('otf2ttf');
});

app.get('/pip', (req, res) => { // pyftsubset로 폰트 변환
  // const path = ['upload/test.ttf', 'upload/123/NanumSquareB.ttf'];
  const command = `pyftsubset "upload/tt.ttf" --text="abcdefg" --output-file="upload/test.ttf"`;
  // const command = `pyftsubset`;
  // const command = 'test.py';
  // console.log(command);
  shellExec(command).then((e) => {
    console.log(e);
    res.send(e);
  }).catch(() => {
    console.log('catch');
    res.end();
  });

});

app.get('/download', (req, res) => {
  const zip = new JSZip();
  const fonts = JSON.parse(req.cookies.fonts);
  const path = fonts.path + 'subset/';
  const exists = fs.pathExistsSync(path);

  console.log(exists);
  if (!exists) {
    fs.removeSync(path);
  }

  const dir = fs.readdirSync(path, 'utf-8');

  dir.forEach(file => {
    zip.file(file, fs.readFileSync(path + file));
  });

  const data = zip.generate({ base64: false, compression: 'DEFLATE' });

  fs.writeFileSync(fonts.path + 'subset.zip', data, 'binary');
  res.download(fonts.path + 'subset.zip');
});

app.get('/downloads/:filename(*)', (req, res) => {
  const zip = new JSZip();
  zip.file('NanumSquareB.ttf', fs.readFileSync(__dirname + '/upload/1577437150263/NanumSquareB.ttf'));
  zip.file('NotoSansCJKkr-Regular.ttf', fs.readFileSync(__dirname + '/upload/1577437150263/NotoSansCJKkr-Regular.ttf'));
  const data = zip.generate({ base64: false, compression: 'DEFLATE' });
  fs.writeFileSync(__dirname + '/upload/1577437150263.zip', data, 'binary');
  res.download(__dirname + '/upload/1577437150263.zip');
});

app.get('/test', (req, res) => {
  const files = [ { fieldname: 'file[]',
    originalname: 'NanumSquareB.ttf',
    encoding: '7bit',
    mimetype: 'application/octet-stream',
    destination: 'upload/',
    filename: 'NanumSquareB.ttf',
    path: 'upload/NanumSquareB.ttf',
    size: 733500 },
  { fieldname: 'file[]',
    originalname: 'NotoSansCJKkr-Regular.ttf',
    encoding: '7bit',
    mimetype: 'application/octet-stream',
    destination: 'upload/',
    filename: 'NotoSansCJKkr-Regular.ttf',
    path: 'upload/NotoSansCJKkr-Regular.ttf',
    size: 367940 }, {
      path: 'upload/NotoSans-Regular.ttf',
      filename: 'NotoSans-Regular.ttf',
      originalname: 'NotoSans-Regular.ttf',
      destination: 'upload/'
    } , {
      path: 'upload/NotoSansCJKkr-Regular.otf',
      filename: 'NotoSansCJKkr-Regular.otf',
      originalname: 'NotoSansCJKkr-Regular.otf',
      destination: 'upload/'
    } ];
  const fonts = [];
  files.forEach((file) => {
    const font = fontkit.openSync(file.path);
    const name = file.filename;
    const originalName = file.originalname;
    const path = file.destination;
    const characters = font.characterSet;
    const charactersDecoding = characters.map(character => String.fromCharCode(character)).join('');
    fonts.push({ name, originalName, path, characters, charactersDecoding });
  });
  res.render('font-preview', { title: 'font-preview', fonts });
});

app.post('/upload-bak', (req, res) => {
  try {

    const floderName = Date.now() + randomstring.generate();
    const storage = multer.diskStorage({
      destination(req, file, callback) {
        const path = `upload/${floderName}/`;
        console.log(path);
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
    const upload = multer({ storage }).array('file[]', 10);
    upload(req, res, (error) => {
      if (error) {
        res.res(500).end();
      }
      console.log(req.files);
      const fonts = [];
      req.files.forEach((file) => {
        const font = fontkit.openSync(file.path);
        const name = file.filename;
        const originalName = file.originalname;
        const path = file.destination;
        const characters = font.characterSet;
        const charactersDecoding = characters.map(character => {
          if (character !== 65535) return String.fromCharCode(character);
        }).join('');
        console.log(characters);
        console.log(charactersDecoding);
        fonts.push({ name, originalName, path, characters, charactersDecoding });
      });
      res.render('font-preview', { title: 'font-preview', fonts });
    });



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

app.get('/cookie', (req, res) => {
  const val = req.cookies;
  console.log(val);
  res.send(val);
});

app.get('/set', (req, res) => {
  res.cookie('hasVisiteda', '1', {
      maxAge: 3600000,
      httpOnly: true
  });
  res.send('test');
});

app.get('/view', (req, res) => {
  const files = JSON.parse(req.cookies.fonts);
  const data = [];
  console.log(files);
  files.fonts.forEach((file) => {
    const font = fontkit.openSync(files.path + file.name);
    const name = file.name;
    const originalName = file.originalName;
    const path = files.path;
    const characters = font.characterSet;
    const charactersDecoding = characters.map(character => {
      if (character !== 65535) return String.fromCharCode(character);
    }).join('');
    data.push({ name, originalName, path, characters, charactersDecoding });
  });
  console.log(data);
  res.render('font-preview', { title: 'font-preview', fonts: data });
});

app.post('/subset', (req, res) => {
  // console.log(req.body);
  const data = req.body;
  const fonts = req.cookies.fonts;
  const path = JSON.parse(fonts).path;
  data.forEach(item => {
    const filename = item.filename;
    const characters = [...item.characters].join('');
    // console.log(path + filename);
    const fontmin = new Fontmin()
      .src(path + filename)
      .use(Fontmin.glyph({
        text: characters,
        hinting: false
      }))
      .use(Fontmin.ttf2svg())
      .use(Fontmin.ttf2woff2())
      .use(Fontmin.ttf2woff())
      .use(Fontmin.ttf2eot())
      .dest(path + 'subset');

    fontmin.run(function (err, files) {
      if (err) {
          throw err;
      }
      console.log('succ');
      setTimeout(() => {

        res.send('a');
      }, 3000);
    });
  });
});

app.post('/upload', (req, res) => {
  try {
    const floderName = Date.now() + randomstring.generate();
    const path = `upload/${floderName}/`;
    const storage = multer.diskStorage({
      destination(req, file, callback) {
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
    const upload = multer({ storage }).array('file[]', 10);
    upload(req, res, (error) => {
      if (error) {
        res.res(500).end();
      }
      const fonts = {
        path,
        fonts: []
      };
      req.files.forEach((file) => {
        fonts.fonts.push({
          name: file.filename,
          originalName: file.originalname
        });
      });
      const stringify = JSON.stringify(fonts);
      res.cookie('fonts', stringify, {
        maxAge: 3600000,
        httpOnly: true
      });
      res.send(fonts);
    });
  } catch (err) {
    // error
  }
});

app.listen(3000, () => {
  console.log('Hello Webfont Preview and Convert');
});
