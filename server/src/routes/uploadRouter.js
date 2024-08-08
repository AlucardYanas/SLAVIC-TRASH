const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const { Video } = require('../../db/models');
const { VideoIntelligenceServiceClient } = require('@google-cloud/video-intelligence');
const { Storage } = require('@google-cloud/storage');
require('dotenv').config();

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const router = express.Router();
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

// Функция для создания превью и получения длины видео
const processVideo = (videoPath, thumbnailPath) =>
  new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .on('filenames', filenames => {
        console.log('Скриншоты будут сохранены как: ' + filenames.join(', '));
      })
      .on('end', () => {
        console.log('Скриншот создан');
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
          if (err) {
            return reject(err);
          }
          const length = Math.ceil(metadata.format.duration);
          resolve({ thumbnailPath, length });
        });
      })
      .on('error', err => {
        console.error(err);
        reject(err);
      })
      .screenshots({
        timestamps: ['1'], // Временная метка, где делается скриншот
        filename: path.basename(thumbnailPath), // Имя файла для скриншота
        folder: path.dirname(thumbnailPath), // Папка для сохранения скриншота
        size: '320x240', // Размер скриншота
      });
  });

// Функция для загрузки файла в Google Cloud Storage
async function uploadToGCS(filePath, destination, folder = '') {
  const bucketName = process.env.GCS_BUCKET_NAME;
  const destinationPath = folder ? `${folder}/${destination}` : destination; // Добавляем папку, если она указана

  await storage.bucket(bucketName).upload(filePath, {
    destination: destinationPath,
    public: true, // Делает файл доступным для публичного доступа
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });

  const publicUrl = `https://storage.googleapis.com/${bucketName}/${destinationPath}`;
  return publicUrl;
}

// Маршрут для загрузки видео
router.post('/', upload.single('video'), async (req, res) => {
  try {
    const { title } = req.body;
    const videoPath = req.file.path;

    // Создание превью и получение длины видео
    const thumbnailFilename = `${path.basename(videoPath, path.extname(videoPath))}.png`;
    const thumbnailPath = path.join('public/thumbnails', thumbnailFilename);

    const { length } = await processVideo(videoPath, thumbnailPath);

    // Загрузка видео в корень бакета и скриншота в папку screenshots
    const videoPublicUrl = await uploadToGCS(videoPath, path.basename(videoPath));
    const thumbnailPublicUrl = await uploadToGCS(thumbnailPath, path.basename(thumbnailPath), 'screenshots'); // Загрузка в папку 'screenshots'

    // Удаление временных файлов
    fs.unlink(videoPath, (err) => {
      if (err) {
        console.error('Ошибка при удалении временного видео файла:', err);
      } else {
        console.log('Временный видео файл удален:', videoPath);
      }
    });

    fs.unlink(thumbnailPath, (err) => {
      if (err) {
        console.error('Ошибка при удалении временного файла превью:', err);
      } else {
        console.log('Временный файл превью удален:', thumbnailPath);
      }
    });

    // Анализ видео с помощью Google Cloud Video Intelligence API
    const gcsUri = `gs://${process.env.GCS_BUCKET_NAME}/${path.basename(videoPath)}`;
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

    // Сохранение информации о видео в базе данных
    const video = await Video.create({
      title,
      videoPath: videoPublicUrl,
      length,
      approved: false,
      extractedTexts,
      transcribedText,
      thumbnailPath: thumbnailPublicUrl, // Сохраняем публичный URL скриншота
    });

    res.status(201).json({ message: 'Video uploaded and analyzed successfully', video });
  } catch (error) {
    console.error('Общая ошибка при загрузке видео:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

module.exports = router;
