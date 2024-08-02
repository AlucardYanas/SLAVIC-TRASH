const express = require('express');
const { History } = require('../../db/models');

const router = express.Router();

// Получение истории просмотров для пользователя
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await History.findAll({ where: { userId } });
    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Добавление видео в историю
router.post('/', async (req, res) => {
  try {
    const { userId, videoId } = req.body;
    const historyEntry = await History.create({ userId, videoId });
    res.status(201).json(historyEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add history entry' });
  }
});

module.exports = router;
