const express = require('express');
const { WatchedVideo } = require('../../db/models');

const router = express.Router();

// Получение всех просмотренных видео для пользователя
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const watchedVideos = await WatchedVideo.findAll({ where: { userId } });
    res.status(200).json(watchedVideos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch watched videos' });
  }
});

// Добавление видео в список просмотренных
router.post('/', async (req, res) => {
  try {
    const { userId, videoId } = req.body;
    const watchedVideo = await WatchedVideo.create({ userId, videoId });
    res.status(201).json(watchedVideo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add watched video' });
  }
});

module.exports = router;
