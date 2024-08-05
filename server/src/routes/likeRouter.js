const express = require('express');
const { Like } = require('../../db/models');
const router = express.Router();

// Маршрут для лайков
router.post('/', async (req, res) => {
  try {
    const { userId, videoId } = req.body;

    const existingLike = await Like.findOne({ where: { userId, videoId } });

    if (existingLike) {
      return res.status(400).json({ message: 'Вы уже лайкнули это видео.' });
    }

    await Like.create({ userId, videoId });

    res.status(200).json({ message: 'Видео лайкнуто.' });
  } catch (error) {
    console.error('Ошибка при лайке видео:', error);
    res.status(500).json({ error: 'Не удалось лайкнуть видео.' });
  }
});

module.exports = router;
