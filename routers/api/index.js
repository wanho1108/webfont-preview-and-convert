import fs from 'fs-extra';
import express from 'express';
import multer from 'multer';
import randomstring from 'randomstring';

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
  res.send('/convert');
});

router.get('/download', (req, res) => {
  res.send('/download');
});

export default router;