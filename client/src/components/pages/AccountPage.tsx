import React, { useState } from 'react';
import { Checkbox, Container, Flex, VStack, Button, Input, Box } from '@chakra-ui/react';
import { useUploadVideoMutation } from '../../redux/upload/uploadSlice';

export default function AccountPage(): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [uploadVideo, { isLoading }] = useUploadVideoMutation();

  // Обработчик выбора файла
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Обработчик изменения названия видео
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoTitle(event.target.value);
  };

  // Обработчик отправки данных
  const handleSubmit = async () => {
    if (selectedFile && videoTitle) {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('title', videoTitle);

      try {
        await uploadVideo(formData).unwrap();
        alert('Видео успешно загружено');
        setSelectedFile(null);
        setVideoTitle('');
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        alert('Не удалось загрузить видео');
      }
    } else {
      alert('Пожалуйста, выберите файл видео и введите название');
    }
  };

  return (
    <Container maxW="container.xl" p={4} position="relative">
      {/* Верхняя панель с кнопками */}
      <Box mb={4}>
        <Button colorScheme="teal" variant="solid" mr={4}>
          История просмотров
        </Button>
      </Box>

      {/* Скрытое поле для выбора файлов */}
      <input
        id="fileInput"
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Поле ввода названия видео и кнопка для отправки */}
      <Box mb={4}>
        <Input
          placeholder="Введите название видео"
          value={videoTitle}
          onChange={handleTitleChange}
          mb={2}
        />
        <Button
          colorScheme="teal"
          variant="solid"
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          Выбрать файл
        </Button>
        <br />
        <Button colorScheme="teal" variant="solid" onClick={handleSubmit} isLoading={isLoading}>
          Отправить
        </Button>
      </Box>

      {/* Основное содержимое страницы */}
      <Flex direction="row" align="center" justify="space-between" height="calc(100vh - 8rem)">
        {/* Левый блок с чекбоксами для фильтрации */}
        <VStack align="start" spacing={10}>
          <Checkbox>Фильтр 1</Checkbox>
          <Checkbox>Фильтр 2</Checkbox>
          <Checkbox>Фильтр 3</Checkbox>
        </VStack>

        {/* Центральная часть с видео */}
        <Flex direction="column" align="center" justify="center" flex="1">
          {/* Видео теперь будут отображаться на MainPage */}
        </Flex>

        {/* Правый блок с чекбоксами для тегов */}
        <VStack align="end" spacing={10}>
          <Checkbox>Тег 1</Checkbox>
          <Checkbox>Тег 2</Checkbox>
          <Checkbox>Тег 3</Checkbox>
        </VStack>
      </Flex>
    </Container>
  );
}
