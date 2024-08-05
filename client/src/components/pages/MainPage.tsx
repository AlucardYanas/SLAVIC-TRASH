import React, { useState } from 'react';
import { Container, Flex, VStack, Box, Text, Button } from '@chakra-ui/react';
import { useGetVideosQuery } from '../../redux/apiSlice';
import VideoPlayer from '../ui/VideoPlayer';
import type { VideoType } from '../../types/types';

export default function MainPage(): JSX.Element {
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const { data, error, isLoading } = useGetVideosQuery();
  console.log(data);

  // Безопасная обработка данных видео
  const videos: VideoType[] = Array.isArray(data) ? data : []; // Проверяем, является ли data массивом

  // Обработчик завершения видео
  const handleVideoEnd = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } 
  };

  // Обработчик переключения на следующее видео
  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  return (
    <Container maxW="container.xl" p={4}>
      <Flex direction="row" align="center" justify="space-between" height="calc(100vh - 8rem)">
        {/* Левый блок с чекбоксами для тегов */}
        

        {/* Центральная часть с видео */}
        <Flex direction="column" align="center" justify="center" flex="1">
          {isLoading ? (
            <Text>Загрузка...</Text>
          ) : error ? (
            <Text>Ошибка загрузки видео.</Text>
          ) : videos.length === 0 ? (
            <Text>Нет доступных видео.</Text>
          ) : (
            <>
              <VideoPlayer
                src={videos[currentVideoIndex].videoPath}
                onEnd={handleVideoEnd}
              />
              <Button onClick={handleNextVideo} mt={4}>
                Следующее видео
              </Button>
            </>
          )}
        </Flex>

        {/* Правый блок с чекбоксами для тегов */}
      
      </Flex>
    </Container>
  );
}
