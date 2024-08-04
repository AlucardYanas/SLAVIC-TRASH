const express = require('express');
const { Video } = require('../../db/models');
const router = express.Router();

// Маршрут для получения всех видео с возможностью фильтрации, пагинации и сортировки
router.get('/', async (req, res) => {
  try {
    // Извлечение параметров запроса для фильтрации, сортировки и пагинации
    const { page = 1, limit = 10, sort = 'createdAt', order = 'DESC', tag, search } = req.query;

    const whereClause = {};

    // Фильтрация по тегу
    if (tag) {
      whereClause.tags = { [Op.contains]: [tag] };
    }

    // Фильтрация по поисковому запросу (например, по названию)
    if (search) {
      whereClause.title = { [Op.iLike]: `%${search}%` };
    }

    // Получение видео с учетом параметров фильтрации и сортировки
    const videos = await Video.findAll({
      where: whereClause,
      limit: parseInt(limit, 10),
      offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
      order: [[sort, order.toUpperCase()]],
      attributes: ['id', 'title', 'videoPath', 'length', 'thumbnailPath'], // Выборочные поля
    });

    // Подсчет общего количества видео для пагинации
    const totalVideos = await Video.count({ where: whereClause });

    res.status(200).json({
      data: videos,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(totalVideos / limit),
      totalVideos,
    });
  } catch (error) {
    console.error('Ошибка при получении видео:', error);
    res.status(500).json({ error: 'Не удалось получить видео' });
  }
});

module.exports = router;
