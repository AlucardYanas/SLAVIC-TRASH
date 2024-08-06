import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, Container, Flex, VStack, Button, Input, Box, Text, Image, Spinner } from '@chakra-ui/react';
import Slider from 'react-slick';
import { useUploadVideoMutation } from '../../redux/upload/uploadSlice';
import { useGetLikedVideosQuery } from '../../redux/like/likeSlice'; // Импортируем из нового слайса
import type { RootState } from '../../redux/store';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function AccountPage(): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [uploadVideo, { isLoading }] = useUploadVideoMutation();

  const userId = useSelector((state: RootState) => state.auth.user.status === 'logged' ? state.auth.user.id : null);

  const { data: likedVideos, error, isLoading: isLoadingLikedVideos } = useGetLikedVideosQuery({ userId }, { skip: !userId });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoTitle(event.target.value);
  };

  const handleSubmit = async () => {
    if (selectedFile && videoTitle && userId) {
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
      alert('Пожалуйста, выберите файл видео, введите название и убедитесь, что вы авторизованы');
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };
  console.log(videoTitle)

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
          <Box width="full">
            <Text fontSize="2xl" mb={4}>
              Видео, которые вам понравились
            </Text>
            {isLoadingLikedVideos ? (
              <Spinner size="xl" />
            ) : error ? (
              <Text>Ошибка при загрузке данных.</Text>
            ) : (
              <Slider {...settings}>
                {likedVideos &&
                  likedVideos.map((video) => (
                    <Box key={video.id} p={4}>
                      <Flex direction="column" align="center">
                        <Image
                          src={video.thumbnailPath}
                          alt={video.title}
                          mb={2}
                          boxSize="200px"
                          objectFit="cover"
                        />
                        <Text noOfLines={2}>{video.title}</Text>
                      </Flex>
                    </Box>
                  ))}
              </Slider>
            )}
          </Box>
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
