import React, { useState, useEffect } from 'react';
import { Flex, Text, Spinner, Checkbox, useToast } from '@chakra-ui/react';
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
  const [showShortTrash, setShowShortTrash] = useState(false);
  const [noShortVideos, setNoShortVideos] = useState(false);

  const toast = useToast();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user.status === 'logged' ? user.id : null;

  const filteredVideos: VideoType[] = showShortTrash
    ? data?.data.filter((video) => video.length <= 10) || []
    : data?.data || [];

  useEffect(() => {
    setCurrentVideoIndex(0); // Reset current video index to 0 when the filter changes
    setNoShortVideos(showShortTrash && filteredVideos.length === 0);
  }, [showShortTrash, filteredVideos.length]);

  useEffect(() => {
    if (currentVideoIndex >= filteredVideos.length) {
      setCurrentVideoIndex(0);
    }
  }, [filteredVideos.length]);

  const handleVideoEnd = (): void => {
    if (currentVideoIndex < filteredVideos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handleLike = (): void => {
    if (!userId) {
      console.error('Пользователь не авторизован');
      return;
    }

    const videoId = filteredVideos[currentVideoIndex]?.id;

    likeVideo({ userId, videoId })
      .unwrap()

      .catch((err) => {
        console.error('Ошибка при лайке видео:', err);
      });
    toast({
      title: 'Лайк поставлен',
      description: 'Видео добавлено в список любимых',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    console.log('Видео лайкнуто!');
  };

  const handleNextVideo = (): void => {
    if (currentVideoIndex < filteredVideos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePrevVideo = (): void => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const handleShare = (): void => {
    void navigator.clipboard.writeText(
      `https://slavic-trash.chickenkiller.com/video/${data?.data[currentVideoIndex].id}`,
    );
    toast({
      title: 'Готово',
      description: 'Ссылка на видео успешно скопирована',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
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
    content = <Text color="white">Ошибка загрузки видео.</Text>;
  } else if (noShortVideos || filteredVideos.length === 0) {
    content = (
      <>
        <Text color="white">Нет доступных видео.</Text>
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
          colorScheme="blackAlpha"
        >
          Только короткий треш
        </Flex>
      </>
    );
  } else {
    content = (
      <>
        <VideoPlayer
          src={filteredVideos[currentVideoIndex]?.videoPath}
          poster={filteredVideos[currentVideoIndex]?.thumbnailPath}
          onEnd={handleVideoEnd}
          onLike={handleLike}
          handleNextVideo={handleNextVideo}
          handlePrevVideo={handlePrevVideo}
          handleShare={handleShare}
        />
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
          colorScheme="blackAlpha"
        >
          Только короткий треш
        </Flex>
      </>
    );
  }

  return (
    <Flex direction="column" align="center" justify="center" height="calc(100vh - 8rem)">
      <Flex direction="column" align="center" justify="center" flex="1">
        {content}
        {/* {user.status === 'logged' && content} */}
      </Flex>
    </Flex>
  );
}
