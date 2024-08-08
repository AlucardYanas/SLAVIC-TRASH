// VideoPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Flex, Text } from '@chakra-ui/react';
import { useGetVideosQuery } from '../../redux/apiSlice';
import VideoPlayer from '../ui/VideoPlayer';
import type { RootState } from '../../redux/store';

export default function VideoPage():JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetVideosQuery();
  const [currentVideo, setCurrentVideo] = useState(null); // Измените тип по необходимости
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (data?.data) {
      const video = data.data.find((v: any) => v.id === parseInt(id!));
      setCurrentVideo(video || null);
    }
  }, [data, id]);

  const handleShare = () => {
    if (currentVideo) {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована!');
    }
  };

  let content;

  if (isLoading) {
    content = <Text>Загрузка...</Text>;
  } else if (error) {
    content = <Text>Ошибка загрузки видео.</Text>;
  } else if (!currentVideo) {
    content = <Text>Видео не найдено.</Text>;
  } else {
    content = (
      <VideoPlayer
        src={currentVideo.videoPath}
        poster={currentVideo.thumbnailPath}
        onEnd={() => {}}
        onLike={() => {}}
        handleNextVideo={() => {}}
        handlePrevVideo={() => {}}
        handleShare={handleShare} // Передайте обработчик Share в VideoPlayer
      />
    );
  }

  return (
    <Flex direction="column" align="center" justify="center" height="100vh">
      {content}
    </Flex>
  );
}
