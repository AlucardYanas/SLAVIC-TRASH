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
    if (pendingVideos.length === 0) {
      return res.status(200).json({ message: 'No new videos for approval' });
    }
    res.status(200).json(pendingVideos);
  } catch (error) {
    console.error('Ошибка при получении видео:', error);
    res.status(500).json({ error: 'Не удалось получить видео' });
  }
});

// Одобрение видео
router.post('/approve/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tags } = req.body;
    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({ error: 'Видео не найдено' });
    }

    const oldPath = video.videoPath;
    const newPath = path.join('public/videos', path.basename(oldPath));
    fs.renameSync(oldPath, newPath);

    const thumbnailPath = path.join('public/thumbnails', `${path.basename(oldPath, path.extname(oldPath))}.png`);
    ffmpeg(newPath)
      .screenshots({
        timestamps: ['00:00:01.000'],
        filename: path.basename(thumbnailPath),
        folder: 'public/thumbnails',
        size: '320x240'
      })
      .on('end', async () => {
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
        res.status(500).json({ error: 'Не удалось создать превьюшку' });
      });

  } catch (error) {
    console.error('Ошибка при одобрении видео:', error);
    res.status(500).json({ error: 'Не удалось одобрить видео' });
  }
});

// Отклонение видео
router.delete('/disapprove/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({ error: 'Видео не найдено' });
    }

    fs.unlinkSync(video.videoPath);
    await video.destroy();

    res.status(200).json({ message: 'Видео отклонено и удалено' });
  } catch (error) {
    console.error('Ошибка при отклонении видео:', error);
    res.status(500).json({ error: 'Не удалось отклонить видео' });
  }
});

module.exports = router;
