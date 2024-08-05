const express = require('express');
const fs = require('fs');
const path = require('path');
const { Video } = require('../../db/models');
const { Storage } = require('@google-cloud/storage');
require('dotenv').config(); // Загружаем переменные окружения из .env файла

const router = express.Router();
const storage = new Storage();

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

    video.approved = true;
    video.tags = tags || [];
    await video.save();

    res.status(200).json(video);
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

    const bucketName = process.env.GCS_BUCKET_NAME;
    const fileName = path.basename(video.videoPath);

    try {
      await storage.bucket(bucketName).file(fileName).delete();
    } catch (deleteError) {
      console.error('Ошибка при удалении файла из GCS:', deleteError);
      return res.status(500).json({ error: 'Failed to delete video from GCS' });
    }

    await video.destroy();

    res.status(200).json({ message: 'Видео отклонено и удалено' });
  } catch (error) {
    console.error('Ошибка при отклонении видео:', error);
    res.status(500).json({ error: 'Не удалось отклонить видео' });
  }
});

module.exports = router;
