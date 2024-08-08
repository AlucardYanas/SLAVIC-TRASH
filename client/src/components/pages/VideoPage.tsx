// VideoPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Text } from '@chakra-ui/react';
import type { VideoType } from '../../types/types';
import { useGetVideosQuery } from '../../redux/apiSlice';
import VideoPlayer from '../ui/VideoPlayer';

export default function VideoPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetVideosQuery();
  const [currentVideo, setCurrentVideo] = useState<VideoType | null>(null);

  useEffect(() => {
    if (data?.data) {
      const video = data.data.find((v: VideoType) => v.id === (id ? parseInt(id, 10) : null));
      setCurrentVideo(video || null);
    }
  }, [data, id]);

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
        showShare={false} // Hide the Share button
        showNextPrev={false} // Hide the Next and Previous buttons
      />
    );
  }

  return (
    <Flex direction="column" align="center" justify="center" height="calc(100vh - 8rem)">
      <Flex direction="column" align="center" justify="center" flex="1">
        {content}
      </Flex>
    </Flex>
  );
}
