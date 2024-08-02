// src/components/pages/MainPage.tsx

import React, { useState } from 'react';
import { Checkbox, Container, Flex, VStack, Box, Text } from '@chakra-ui/react';
import VideoModal from '../ui/VideoModal'; // Убедитесь, что путь к компоненту правильный
import { useGetVideosQuery } from '../../redux/apiSlice';
import type { VideoType } from '../../types/types';

export default function MainPage(): JSX.Element {
  const [filters, setFilters] = useState({
    lessThan10: false,
    lessThan20: false,
    lessThan30: false,
  });

  const { data: videos, error, isLoading } = useGetVideosQuery();

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  const filteredVideos = videos?.filter((video) => {
    if (filters.lessThan10 && video.length <= 10) {
      return true;
    }
    if (filters.lessThan20 && video.length <= 20) {
      return true;
    }
    if (filters.lessThan30 && video.length <= 30) {
      return true;
    }
    return false;
  });

  return (
    <Container maxW="container.xl" p={4}>
      <Flex direction="row" align="center" justify="space-between" height="calc(100vh - 8rem)">
        {/* Левый блок с чекбоксами для фильтрации */}
        <VStack align="start" spacing={10}>
          <Checkbox name="lessThan10" onChange={handleFilterChange} isChecked={filters.lessThan10}>
            Видео не более 10 секунд
          </Checkbox>
          <Checkbox name="lessThan20" onChange={handleFilterChange} isChecked={filters.lessThan20}>
            Видео не более 20 секунд
          </Checkbox>
          <Checkbox name="lessThan30" onChange={handleFilterChange} isChecked={filters.lessThan30}>
            Видео не более 30 секунд
          </Checkbox>
        </VStack>

        {/* Центральная часть с видео */}
        <Flex direction="column" align="center" justify="center" flex="1">
          {isLoading ? (
            <Text>Загрузка...</Text>
          ) : error ? (
            <Text>Ошибка загрузки видео.</Text>
          ) : (
            filteredVideos?.map((video: VideoType) => (
              <Box key={video.id} mb={4}>
                <VideoModal videoTitle={video.title} videoSrc={video.link} />
              </Box>
            ))
          )}
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
