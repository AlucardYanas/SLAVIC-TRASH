const express = require('express');
const { Video } = require('../../db/models');

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

module.exports = router;
