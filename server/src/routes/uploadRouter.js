const express = require('express');
const multer = require('multer');
const path = require('path');
const { Video } = require('../../db/models');
const { VideoIntelligenceServiceClient } = require('@google-cloud/video-intelligence');
const { Storage } = require('@google-cloud/storage');
require('dotenv').config(); // Загружаем переменные окружения из .env файла

const router = express.Router();

// Инициализация клиентов Google Cloud
const videoIntelligenceClient = new VideoIntelligenceServiceClient();
const storage = new Storage();

// Настройка хранилища multer для промежуточной папки
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // Промежуточная папка для загруженных видео
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`); // Уникальное имя файла
  },
});

const upload = multer({ storage: storageConfig });

// Маршрут для загрузки видео
router.post('/', upload.single('video'), async (req, res) => {
  try {
    const { title } = req.body;
    const videoPath = req.file.path;

    // Удалено: Получение длины видео с помощью ffmpeg

    // Загрузка видео в Google Cloud Storage
    const bucketName = process.env.GCS_BUCKET_NAME;
    const destination = `uploads/${path.basename(videoPath)}`;

    try {
      await storage.bucket(bucketName).upload(videoPath, {
        destination,
        public: true,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });

      const gcsUri = `gs://${bucketName}/${destination}`;
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;

      // Анализ видео с помощью Google Cloud Video Intelligence API
      const [operation] = await videoIntelligenceClient.annotateVideo({
        inputUri: gcsUri,
        features: ['LABEL_DETECTION', 'EXPLICIT_CONTENT_DETECTION', 'TEXT_DETECTION', 'SPEECH_TRANSCRIPTION'],
        videoContext: {
          speechTranscriptionConfig: {
            languageCode: 'en-US', // Вы можете изменить это на нужный вам язык
          },
        },
      });

      const [response] = await operation.promise();

      // Проверка на наличие нежелательного контента
      const explicitContentAnnotation = response.annotationResults[0]?.explicitAnnotation || { frames: [] };
      const explicitLikelihood = explicitContentAnnotation.frames.map((frame) => frame.pornographyLikelihood);

      if (explicitLikelihood.some((likelihood) => likelihood >= 3)) {
        console.log('Видео содержит нежелательный контент');
        return res.status(400).json({ error: 'Video contains explicit content' });
      }

      // Извлечение текста из видео
      const textAnnotations = response.annotationResults[0]?.textAnnotations || [];
      const extractedTexts = textAnnotations.map((text) => text.text);

      // Транскрибирование аудио в текст
      const speechTranscriptions = response.annotationResults[0]?.speechTranscriptions || [];
      const transcribedText = speechTranscriptions.map(transcription =>
        transcription.alternatives.map(alternative => alternative.transcript).join('\n')
      ).join('\n\n');

      // Удалено: Создание превьюшки для видео

      // Сохранение информации о видео в базе данных
      const video = await Video.create({
        title,
        videoPath: publicUrl,
        length: 0, // Длина видео больше не извлекается
        approved: true,
        extractedTexts, // сохранение извлеченного текста
        transcribedText, // сохранение транскрибированного текста
        thumbnailPath: '', // Превью больше не создается
      });

      res.status(201).json({ message: 'Video uploaded and analyzed successfully', video });
    } catch (uploadError) {
      console.error('Ошибка при загрузке видео в GCS:', uploadError);
      res.status(500).json({ error: 'Failed to upload video to GCS' });
    }
  } catch (error) {
    console.error('Общая ошибка при загрузке видео:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

module.exports = router;
