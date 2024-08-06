import React, { useState, useEffect } from 'react';
import { Container, Flex, Text, Button } from '@chakra-ui/react';
import { useGetVideosQuery } from '../../redux/apiSlice';
import { useLikeVideoMutation } from '../../redux/like/likeSlice';
import VideoPlayer from '../ui/VideoPlayer';
import type { VideoType } from '../../types/types';

export default function MainPage(): JSX.Element {
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const { data, error, isLoading } = useGetVideosQuery();
  const [likeVideo] = useLikeVideoMutation();

  const videos: VideoType[] = Array.isArray(data?.data) ? data.data : [];

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleVideoEnd = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const handleLike = async () => {
    try {
      const userId = 1; // Убедитесь, что здесь правильный userId
      const videoId = videos[currentVideoIndex].id;
      await likeVideo({ userId, videoId }).unwrap();
      console.log('Видео лайкнуто!');
    } catch (error) {
      console.error('Ошибка при лайке видео:', error);
    }
  };

  return (
    <Container maxW="container.xl" p={4}>
      <Flex direction="row" align="center" justify="space-between" height="calc(100vh - 8rem)">
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
                onLike={handleLike}
              />
              <Button onClick={handleNextVideo} mt={4}>
                Следующее видео
              </Button>
              <Button onClick={handlePrevVideo} mt={4}>
                Предыдущее видео
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
