import React, { useState } from 'react';
import { Flex, Text, Spinner, Checkbox } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useGetVideosQuery } from '../../redux/apiSlice';
import { useLikeVideoMutation } from '../../redux/like/likeSlice';
import VideoPlayer from '../ui/VideoPlayer';
import type { VideoType } from '../../types/types';
import type { RootState } from '../../redux/store';

export default function MainPage(): JSX.Element {
  const { data, error, isLoading } = useGetVideosQuery();
  const [likeVideo] = useLikeVideoMutation();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showShortTrash, setShowShortTrash] = useState(false); // Новое состояние для фильтрации коротких видео

  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user.status === 'logged' ? user.id : null;

  // Фильтрация видео по длине до 10 секунд, если включена опция "только короткий треш"
  const videos: VideoType[] = showShortTrash
    ? data?.data.filter((video) => video.length <= 10) || []
    : data?.data || [];

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
        poster={videos[currentVideoIndex].thumbnailPath}
        onEnd={handleVideoEnd}
        onLike={handleLike}
        handleNextVideo={handleNextVideo}
        handlePrevVideo={handlePrevVideo}
      />
    );
  }

  return (
    <Flex direction="column" align="center" justify="center" height="calc(100vh - 8rem)">
      <Flex direction="column" align="center" justify="center" flex="1">
        {content}
        <Flex
          as={Checkbox}
          width="100%"
          justifyContent="center"
          bg="rgba(255, 255, 255, 0.5)"
          color="black"
          p="2"
          mt="4"
          borderRadius="md"
          isChecked={showShortTrash}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowShortTrash(e.target.checked)}
          colorScheme="whiteAlpha"
        >
          Только короткий треш
        </Flex>
      </Flex>
    </Flex>
  );
}
