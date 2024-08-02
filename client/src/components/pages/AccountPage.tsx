import React, { useState } from 'react';
import { Checkbox, Container, Flex, VStack, Button } from '@chakra-ui/react';
import VideoModal from '../ui/VideoModal';
import { useUploadVideoMutation } from '../../redux/update/updateSlice';


export default function AccountPage(): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadVideo, { isLoading }] = useUploadVideoMutation();

  // Обработчик выбора файла
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      const formData = new FormData();
      formData.append('video', event.target.files[0]);

      try {
        await uploadVideo(formData).unwrap();
        alert('Video uploaded successfully');
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload video');
      }
    }
  };

  return (
    <Container maxW="container.xl" p={4} position="relative">
      {/* Верхняя кнопка истории просмотров */}
      <Button position="absolute" top={4} left={4} colorScheme="teal" variant="solid">
        История просмотров
      </Button>

      {/* Кнопка загрузки видео */}
      <Button
        position="absolute"
        top={4}
        right={4}
        colorScheme="teal"
        variant="solid"
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        Загрузить видео
      </Button>

      {/* Скрытое поле для выбора файлов */}
      <input
        id="fileInput"
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Flex direction="row" align="center" justify="space-between" height="calc(100vh - 8rem)">
        {/* Левый блок с чекбоксами для фильтрации */}
        <VStack align="start" spacing={10}>
          <Checkbox>Filter Option 1</Checkbox>
          <Checkbox>Filter Option 2</Checkbox>
          <Checkbox>Filter Option 3</Checkbox>
        </VStack>

        {/* Центральная часть с модальным окном */}
        <Flex direction="column" align="center" justify="center" flex="1">
          <VideoModal
            videoTitle="Sample Video"
            videoSrc="https://videos.pexels.com/video-files/9001899/9001899-hd_1920_1080_25fps.mp4"
          />
        </Flex>

        {/* Правый блок с чекбоксами для тегов */}
        <VStack align="end" spacing={10}>
          <Checkbox>Tag Option 1</Checkbox>
          <Checkbox>Tag Option 2</Checkbox>
          <Checkbox>Tag Option 3</Checkbox>
        </VStack>
      </Flex>
    </Container>
  );
}
