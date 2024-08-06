import React, { useState } from 'react';
import { Container, Flex, Text, Button } from '@chakra-ui/react';
import { useGetVideosQuery } from '../../redux/apiSlice';
import { useLikeVideoMutation } from '../../redux/like/likeSlice';
import VideoPlayer from '../ui/VideoPlayer';
import type { VideoType } from '../../types/types';

export default function MainPage(): JSX.Element {
  const { data, error, isLoading } = useGetVideosQuery();
  const [likeVideo] = useLikeVideoMutation();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const videos: VideoType[] = Array.isArray(data?.data) ? data.data : [];

  const handleVideoEnd = (): void => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handleLike = async (): Promise<void> => {
    try {
      const userId = 1; // Убедитесь, что здесь правильный userId
      const videoId = videos[currentVideoIndex].id;
      await likeVideo({ userId, videoId }).unwrap();
      console.log('Видео лайкнуто!');
    } catch (err) {
      console.error('Ошибка при лайке видео:', err);
    }
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
    content = <Text>Загрузка...</Text>;
  } else if (error) {
    content = <Text>Ошибка загрузки видео.</Text>;
  } else if (videos.length === 0) {
    content = <Text>Нет доступных видео.</Text>;
  } else {
    content = (
      <VideoPlayer
        src={videos[currentVideoIndex].videoPath}
        poster={videos[currentVideoIndex].poster} // Передаем poster, если он есть
        onEnd={handleVideoEnd}
        onLike={handleLike}
        videos={videos} // Передаем список видео
        currentVideoIndex={currentVideoIndex}
        handleNextVideo={handleNextVideo}
        handlePrevVideo={handlePrevVideo}
      />
    );
  }

  return (
    <Container maxW="container.xl" p={4}>
      <Flex direction="row" align="center" justify="space-between" height="calc(100vh - 8rem)">
        <Flex direction="column" align="center" justify="center" flex="1">
          {content}
        </Flex>
      </Flex>
    </Container>
  );
}
