import React from 'react';
import { Checkbox, Container, Flex, VStack, Button } from '@chakra-ui/react';
import VideoModal from '../ui/VideoModal';

export default function AccountPage(): JSX.Element {
  return (
    <Container maxW="container.xl" p={4} position="relative">
      {/* Верхняя кнопка истории просмотров */}
      <Button position="absolute" top={4} left={4} colorScheme="teal" variant="solid">
        История просмотров
      </Button>

      <Flex direction="row" align="center" justify="space-between" height="calc(100vh - 8rem)">
        {/* Левый блок с чекбоксами для фильтрации */}
        <VStack align="start" spacing={10}>
          <Checkbox>Filter Option 1</Checkbox>
          <Checkbox>Filter Option 2</Checkbox>
          <Checkbox>Filter Option 3</Checkbox>
        </VStack>

        {/* Центральная часть с модальным окном */}
        <Flex direction="column" align="center" justify="center" flex="1">
          <VideoModal
            videoTitle="Sample Video"
            videoSrc="https://videos.pexels.com/video-files/9001899/9001899-hd_1920_1080_25fps.mp4"
          />
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
