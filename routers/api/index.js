import fs from 'fs-extra';
import express from 'express';
import multer from 'multer';
import randomstring from 'randomstring';
import Fontmin from 'fontmin';
import JSZip from 'node-zip';

const router = express.Router();

router.post('/upload', (req, res) => {
  const path = `upload/${Date.now() + randomstring.generate()}/`;
  const destination = (req, file, callback) => {
    fs.exists(path, exist => {
      if (!exist) {
        return fs.mkdir(path, error => callback(error, path));
      }

      return callback(null, path);
    });
  };
  const filename = (req, file, callback) => {
    callback(null, file.originalname);
  };
  const storage = multer.diskStorage({ destination, filename });
  const upload = multer({ storage }).array('file[]', 10);

  upload(req, res, error => {
    if (error) res.status(500).end();

    const data = { path, files: [] };

    req.files.forEach(file => {
      data.files.push({
        name: file.filename,
        originalname: file.originalname
      });
    });

    const dataStringify = JSON.stringify(data);

    res.cookie('font', dataStringify, {
      maxAge: 10000 * 60 * 60, // 1시간
      httpOnly: true
    });
    res.send(dataStringify);
  });
});

router.get('/cookie', (req, res) => {
  console.log(req.cookies.font);
  res.send('/cookie');
});

router.post('/convert', (req, res) => {
  const { characters } = req.body;
  const { path, files } = JSON.parse(req.cookies.font);
  const fonts = files.map(file => path + file.originalname);
  const fontmin = new Fontmin()
    .src(fonts)
    .use(Fontmin.glyph({
      text: characters,
      hinting: false
    }))
    .use(Fontmin.ttf2svg())
    .use(Fontmin.ttf2woff2())
    .use(Fontmin.ttf2woff())
    .use(Fontmin.ttf2eot())
    .dest(path + 'convert');

  fontmin.run((error) => {
    if (error) {
      res.sendStatus(500);
      throw  error;
    }

    res.sendStatus(200);
  });
});

router.get('/download', (req, res) => {
  const zip = new JSZip();
  const { path } = JSON.parse(req.cookies.font);
  const fonts = fs.readdirSync(path + 'convert');

  fonts.forEach((font => {
    zip.file(font, fs.readFileSync(`${path}/convert/${font}`));
  }));

  const generateZip = zip.generate({ base64: false, compression: 'DEFLATE' });

  fs.writeFileSync(path + 'font-subset.zip', generateZip, 'binary');
  res.download(path + 'font-subset.zip');
});

router.get('/glyphs/recommend', (req, res) => {
  const glyphs = fs.readFileSync('public/data/glyphs.txt');
  res.send(glyphs);
});

export default router;