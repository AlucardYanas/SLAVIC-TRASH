const express = require('express');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { Video } = require('../../db/models');

const router = express.Router();

// Получение всех видео, ожидающих одобрения
router.get('/pending', async (req, res) => {
  try {
    const pendingVideos = await Video.findAll({ where: { approved: false } });
    res.status(200).json(pendingVideos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch pending videos' });
  }
});

// Одобрение видео и добавление тегов
// eslint-disable-next-line consistent-return
router.post('/approve/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tags } = req.body;
    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Перемещение видео в постоянную папку
    const oldPath = video.videoPath;
    const newPath = path.join('public/videos', path.basename(oldPath));
    fs.renameSync(oldPath, newPath);

    // Создание превьюшки первого кадра
    const thumbnailPath = path.join('public/thumbnails', `${path.basename(oldPath, path.extname(oldPath))}.png`);
    ffmpeg(newPath)
      .screenshots({
        timestamps: [ '00:00:01.000' ],
        filename: path.basename(thumbnailPath),
        folder: 'public/thumbnails',
        size: '320x240'
      })
      .on('end', async () => {
        // Обновление записи в базе данных
        video.videoPath = newPath;
        video.link = `/public/videos/${path.basename(newPath)}`;
        video.approved = true;
        video.tags = tags;
        video.thumbnailPath = `/public/thumbnails/${path.basename(thumbnailPath)}`;
        await video.save();

        res.status(200).json(video);
      })
      .on('error', (err) => {
        console.error('Ошибка создания превьюшки:', err);
        res.status(500).json({ error: 'Failed to create thumbnail' });
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to approve video' });
  }
});

module.exports = router;
