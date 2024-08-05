const app = require('./app');
const addVideosFromBucketToDB = require('../scripts/addVideosFromBucketToDB');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

addVideosFromBucketToDB().then(() => {
  console.log('Добавление видео из бакета завершено.');
}).catch((error) => {
  console.error('Ошибка при добавлении видео из бакета:', error);
});

app.listen(PORT, () => {
  console.log('Server has started on port', PORT);
});
