import express from 'express';
import fontkit from 'fontkit';

const router = express.Router();

router.get('/', (req, res) => {
  const files = [{
      originalname: 'NotoSansKR-Regular.woff2',
      destination: 'upload/',
      filename: 'NotoSansKR-Regular.woff2',
      path: 'upload/NotoSansKR-Regular.woff2',
    },
    {
      path: 'upload/Spoqa Han Sans Regular.woff2',
      filename: 'Spoqa Han Sans Regular.woff2',
      originalname: 'Spoqa Han Sans Regular.woff2',
      destination: 'upload/'
    }];
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

  res.render('typefaces', { title: '', fonts });
});

export default router;