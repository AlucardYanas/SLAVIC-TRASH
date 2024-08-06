const express = require('express');
const { Like, Video } = require('../../db/models');
const router = express.Router();

// Маршрут для лайков
router.post('/', async (req, res) => {
  try {
    const { userId, videoId } = req.body;

    if (!userId || !videoId) {
      return res.status(400).json({ error: 'Необходимо указать userId и videoId' });
    }

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

// Маршрут для получения лайкнутых видео пользователем
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'Необходимо указать userId' });
    }

    const likedVideos = await Like.findAll({
      where: { userId },
      include: [Video]
    });

    const videos = likedVideos.map(like => like.Video);

    res.status(200).json(videos);
  } catch (error) {
    console.error('Ошибка при получении лайкнутых видео:', error);
    res.status(500).json({ error: 'Не удалось получить лайкнутые видео' });
  }
});

module.exports = router;
