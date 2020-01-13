import express from 'express';

const router = express.Router();

router.get('/upload', (req, res) => {
  res.send('/upload');
});

router.post('/convert', (req, res) => {
  res.send('/convert');
});

router.get('/download', (req, res) => {
  res.send('/download');
});

export default router;