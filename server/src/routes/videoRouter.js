const express = require('express');
const { Video, Like } = require('../../db/models');

const router = express.Router();

// Маршрут для получения всех видео
router.get('/', async (req, res) => {
  try {
    const videos = await Video.findAll();
    res.status(200).json(videos);
  } catch (error) {
    console.error('Ошибка при получении видео:', error);
    res.status(500).json({ error: 'Не удалось получить видео' });
  }
});

// Маршрут для получения всех полайканных видео пользователем
router.get('/liked/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const likes = await Like.findAll({ where: { userId } });
    const videoIds = likes.map((like) => like.videoId);
    const likedVideos = await Video.findAll({ where: { id: videoIds } });
    res.status(200).json(likedVideos);
  } catch (error) {
    console.error('Ошибка при получении полайканных видео:', error);
    res.status(500).json({ error: 'Не удалось получить полайканные видео' });
  }
});

module.exports = router;
