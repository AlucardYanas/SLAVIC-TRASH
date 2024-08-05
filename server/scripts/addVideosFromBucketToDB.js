const { Storage } = require('@google-cloud/storage');
const { Video } = require('../db/models'); // Убедитесь, что путь к модели правильный
const { VideoIntelligenceServiceClient } = require('@google-cloud/video-intelligence');
require('dotenv').config(); // Загружаем переменные окружения из .env файла

const storage = new Storage();
const videoIntelligenceClient = new VideoIntelligenceServiceClient();

async function addVideosFromBucketToDB() {
  const bucketName = process.env.GCS_BUCKET_NAME; // Имя вашего бакета в GCS
  const [files] = await storage.bucket(bucketName).getFiles(); // Получаем список всех файлов в корне бакета

  console.log(`Найдено файлов в бакете: ${files.length}`);

  for (const file of files) {
    const fileName = file.name.split('/').pop(); // Получаем имя файла
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${file.name}`; // Создаем URL для доступа к файлу
    const gcsUri = `gs://${bucketName}/${file.name}`; // Создаем URI для GCS

    // Проверяем, есть ли уже это видео в базе данных
    const existingVideo = await Video.findOne({ where: { videoPath: publicUrl } });
    if (existingVideo) {
      console.log(`Видео ${fileName} уже существует в базе данных.`);
      continue; // Пропускаем, если видео уже существует
    }

    try {
      // Анализ видео с помощью Google Cloud Video Intelligence API
      const [operation] = await videoIntelligenceClient.annotateVideo({
        inputUri: gcsUri,
        features: ['LABEL_DETECTION', 'EXPLICIT_CONTENT_DETECTION', 'TEXT_DETECTION', 'SPEECH_TRANSCRIPTION'],
        videoContext: {
          speechTranscriptionConfig: {
            languageCode: 'en-US', // Укажите нужный вам язык
          },
        },
      });

      const [response] = await operation.promise();

      // Проверка на наличие нежелательного контента
      const explicitContentAnnotation = response.annotationResults[0].explicitAnnotation;
      const explicitLikelihood = explicitContentAnnotation.frames.map((frame) => frame.pornographyLikelihood);

      if (explicitLikelihood.some((likelihood) => likelihood >= 3)) {
        console.log(`Видео ${fileName} содержит нежелательный контент`);
        continue; // Пропустить видео с нежелательным контентом
      }

      // Извлечение текста из видео
      const textAnnotations = response.annotationResults[0].textAnnotations;
      const extractedTexts = textAnnotations.map((text) => text.text);

      // Транскрибирование аудио в текст
      const speechTranscriptions = response.annotationResults[0].speechTranscriptions;
      const transcribedText = speechTranscriptions.map(transcription =>
        transcription.alternatives.map(alternative => alternative.transcript).join('\n')
      ).join('\n\n');

      // Сохранение информации о видео в базе данных
      await Video.create({
        title: fileName,
        videoPath: publicUrl,
        length: 0, // Укажите длину видео, если нужно
        approved: true,
        extractedTexts, // сохранение извлеченного текста
        transcribedText, // сохранение транскрибированного текста
        thumbnailPath: '', // Если вы хотите создать превью, добавьте его сюда
      });

      console.log(`Видео ${fileName} успешно добавлено в базу данных.`);
    } catch (error) {
      console.error(`Ошибка при обработке видео ${fileName}:`, error);
    }
  }
}

addVideosFromBucketToDB();
