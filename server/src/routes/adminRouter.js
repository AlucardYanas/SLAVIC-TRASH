const express = require('express');
const fs = require('fs');
const path = require('path');
const { UploadVideo, Video } = require('../../db/models');

const router = express.Router();

// Проверка наличия файла
const checkFileExists = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

// Получение всех видео, ожидающих одобрения
router.get('/pending', async (req, res) => {
  try {
    const pendingVideos = await UploadVideo.findAll();
    if (pendingVideos.length === 0) {
      return res.status(200).json({ message: 'No new videos for approval' });
    }
    res.status(200).json(pendingVideos.map(video => ({
      ...video.toJSON(),
      videoPath: `/server/${video.videoPath}` // Обновляем путь для клиента
    })));
  } catch (error) {
    console.error('Ошибка при получении видео:', error);
    res.status(500).json({ error: 'Не удалось получить видео' });
  }
});

// Одобрение видео
router.post('/approve/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const uploadVideo = await UploadVideo.findByPk(id);

    if (!uploadVideo) {
      return res.status(404).json({ error: 'Видео не найдено' });
    }

    const oldPath = uploadVideo.videoPath;
    const newPath = path.join('public/videos', path.basename(oldPath));

    console.log('Old path:', oldPath);
    console.log('New path:', newPath);

    // Проверка существования файла
    try {
      await checkFileExists(oldPath);
    } catch (error) {
      console.error('Файл не найден:', oldPath);
      return res.status(404).json({ error: 'Файл не найден' });
    }

    fs.renameSync(oldPath, newPath);

    const video = await Video.create({
      title: uploadVideo.title,
      videoPath: `/server/public/videos/${path.basename(newPath)}`,
      length: 0, // This should be a valid number
      thumbnailPath: '',  // Превьюшки пока нет, оставляем пустым
    });

    await uploadVideo.destroy();

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
    const uploadVideo = await UploadVideo.findByPk(id);

    if (!uploadVideo) {
      return res.status(404).json({ error: 'Видео не найдено' });
    }

    fs.unlinkSync(uploadVideo.videoPath);
    await uploadVideo.destroy();

    res.status(200).json({ message: 'Видео отклонено и удалено' });
  } catch (error) {
    console.error('Ошибка при отклонении видео:', error);
    res.status(500).json({ error: 'Не удалось отклонить видео' });
  }
});

module.exports = router;
