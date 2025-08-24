import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('glyphs', { title: 'Glyphs' });
});

export default router;