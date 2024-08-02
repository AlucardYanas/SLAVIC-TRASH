const express = require('express');
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { Video } = require('../../db/models');

const router = express.Router();

// Настройка хранилища multer для промежуточной папки
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // Промежуточная папка для загруженных видео
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`); // Уникальное имя файла
  },
});

const upload = multer({ storage });

// Маршрут для загрузки видео
router.post('/', upload.single('video'), async (req, res) => {
  try {
    const { title } = req.body;
    const videoPath = req.file.path;

    // Получение длины видео с помощью ffmpeg
    // eslint-disable-next-line consistent-return
    ffmpeg.ffprobe(videoPath, async (err, metadata) => {
      if (err) {
        console.error('Ошибка при получении метаданных видео:', err);
        return res.status(500).json({ error: 'Failed to process video' });
      }

      const length = Math.floor(metadata.format.duration);

      // Сохранение информации о видео в базе данных (временная запись)
      const video = await Video.create({ title, videoPath, length, approved: false });

      res.status(201).json({ message: 'Video uploaded successfully', video });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

module.exports = router;
