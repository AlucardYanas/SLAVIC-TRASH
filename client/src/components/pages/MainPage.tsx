import React, { useState } from 'react';
import { Flex, Text, Spinner } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useGetVideosQuery } from '../../redux/apiSlice'; // Запрос для получения видео
import { useLikeVideoMutation } from '../../redux/like/likeSlice'; // Запрос для лайков
import VideoPlayer from '../ui/VideoPlayer';
import type { VideoType } from '../../types/types';
import type { RootState } from '../../redux/store';

export default function MainPage(): JSX.Element {
  const { data, error, isLoading } = useGetVideosQuery(); // Получаем видео
  const [likeVideo] = useLikeVideoMutation(); // Мутация для лайка
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Проверяем статус пользователя и получаем его id
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user.status === 'logged' ? user.id : null; // Проверяем, что пользователь авторизован

  // Извлекаем массив видео из объекта data
  const videos: VideoType[] = data?.data || []; // Проверяем, что data существует и извлекаем поле data, если оно есть

  const handleVideoEnd = (): void => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handleLike = (): void => {
    if (!userId) {
      console.error('Пользователь не авторизован');
      return;
    }

    const videoId = videos[currentVideoIndex].id;

    // Оптимистичное обновление
    likeVideo({ userId, videoId })
      .unwrap()
      .catch((err) => {
        console.error('Ошибка при лайке видео:', err);
      });
    console.log('Видео лайкнуто!');
  };

  const handleNextVideo = (): void => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePrevVideo = (): void => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  let content;

  if (isLoading) {
    content = (
      <Flex direction="column" align="center" justify="center" height="100%">
        <Spinner size="xl" />
        <Text mt={4}>Загрузка...</Text>
      </Flex>
    );
  } else if (error) {
    content = <Text>Ошибка загрузки видео.</Text>;
  } else if (videos.length === 0) {
    content = <Text>Нет доступных видео.</Text>;
  } else {
    content = (
      <VideoPlayer
        src={videos[currentVideoIndex].videoPath}
        poster={videos[currentVideoIndex].thumbnailPath} // Используем thumbnailPath для изображения
        onEnd={handleVideoEnd}
        onLike={handleLike}
        handleNextVideo={handleNextVideo}
        handlePrevVideo={handlePrevVideo}
      />
    );
  }

  return (
    <Flex direction="row" align="center" justify="space-between" height="calc(100vh - 8rem)">
      <Flex direction="column" align="center" justify="center" flex="1">
        {content}
      </Flex>
    </Flex>
  );
}
