import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Flex,
  Button,
  Input,
  Box,
  Text,
  Image,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  AspectRatio,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import type { AxiosError } from 'axios';

import { useUploadVideoMutation } from '../../redux/upload/uploadSlice';
import { useGetLikedVideosQuery, useUnlikeVideoMutation } from '../../redux/like/likeSlice';
import VideoPlayer from '../ui/VideoPlayer';
import type { RootState } from '../../redux/store';
import type { VideoType } from '../../types/types';

export default function AccountPage(): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertStatus, setAlertStatus] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [uploadVideo, { isLoading }] = useUploadVideoMutation();
  const toast = useToast();

  const userId = useSelector((state: RootState) =>
    state.auth.user.status === 'logged' ? state.auth.user.id : null,
  );

  const {
    data: likedVideosData,
    error,
    isLoading: isLoadingLikedVideos,
  } = useGetLikedVideosQuery({ userId: userId ?? 0 }, { skip: !userId });

  const likedVideos: VideoType[] = likedVideosData || [];

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);

  const [unlikeVideo] = useUnlikeVideoMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setVideoTitle(event.target.value);
  };

  // Функция для проверки нежелательного контента
  const isUndesirableContent = (title: string): boolean => {
    const undesirableKeywords = ['bad', 'offensive', 'undesirable'];
    return undesirableKeywords.some((keyword) => title.toLowerCase().includes(keyword));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!selectedFile || !videoTitle || userId === null) {
      setAlertMessage(
        'Пожалуйста, выберите файл видео, введите название и убедитесь, что вы авторизованы.',
      );
      setAlertStatus('info');
      setShowAlert(true);
      return;
    }

    if (isUndesirableContent(videoTitle)) {
      setAlertMessage('Видео содержит нежелательный контент и не может быть загружено.');
      setAlertStatus('warning');
      setShowAlert(true);
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('title', videoTitle);

    try {
      await uploadVideo(formData).unwrap();
      setAlertMessage('Видео успешно загружено.');
      setAlertStatus('success');
      setSelectedFile(null);
      setVideoTitle('');

      toast({
        title: 'Успех!',
        description: 'Мы его посмотрим и добавим, если всё ок.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err: unknown) {
      console.error('Ошибка загрузки:', err);

      toast({
        title: 'Произошла лажа',
        description: 'Не могу грузануть(',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      if ((err as AxiosError).status === 400) {
        setAlertMessage('Видео содержит нежелательный контент и не может быть загружено.');
        setAlertStatus('warning');
      } else {
        setAlertMessage('Не удалось загрузить видео. Пожалуйста, попробуйте еще раз.');
        setAlertStatus('error');
      }
    } finally {
      setShowAlert(true);
    }
  };
  const handleSubmitClick = (): void => {
    void handleSubmit();
  };
  // Открытие модального окна для видео
  const handleVideoSelect = (index: number): void => {
    setCurrentVideoIndex(index);
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setCurrentVideoIndex(0);
  };

  const handleNextVideo = (): void => {
    if (likedVideos && likedVideos.length > 0) {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % likedVideos.length);
    }
  };

  const handlePrevVideo = (): void => {
    if (likedVideos && likedVideos.length > 0) {
      setCurrentVideoIndex(
        (prevIndex) => (prevIndex - 1 + likedVideos.length) % likedVideos.length,
      );
    }
  };

  // Функция для удаления видео из избранного
  const handleUnlike = async (videoId: number): Promise<void> => {
    if (!userId) {
      console.error('Пользователь не авторизован');
      return;
    }
    try {
      await unlikeVideo({ userId, videoId }).unwrap();
      console.log('Видео удалено из избранного!');
    } catch (err) {
      console.error('Ошибка при удалении видео из избранного:', err);
    }
  };

  return (
    <Container maxW="container.xl" p={4} position="relative">
      <Modal isOpen={showAlert && alertStatus === 'warning'} onClose={() => setShowAlert(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Предупреждение!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" align="center" justify="center">
              <Image
                src="/yee-boy.gif"
                alt="Funny Shrek GIF"
                boxSize="60vh" // Размер GIF
                mb={4}
                objectFit="cover"
              />
              <Text fontSize="xl" fontWeight="bold" textAlign="center">
                {alertMessage}
              </Text>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      <input
        id="fileInput"
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Flex direction="column" alignItems="center" mb={4}>
        <Input
          placeholder="Введите название видео"
          value={videoTitle}
          onChange={handleTitleChange}
          mb={2}
          width="600px"
          bg="orange.200"
          _placeholder={{ color: 'orange.600' }}
        />
        <Button
          size="lg"
          variant="solid"
          colorScheme="gray"
          background="#DD6B20"
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          {selectedFile ? 'Видео выбрано' : 'Выбрать видео'}
        </Button>
        <Button
          size="lg"
          variant="solid"
          colorScheme="gray"
          background="#DD6B20"
          onClick={handleSubmitClick}
          isLoading={isLoading}
          mt={2}
        >
          Загрузить видео
        </Button>
      </Flex>

      <Flex direction="column" align="center" justify="center">
        <Text
          fontSize="4xl"
          mb={4}
          width="620px"
          height="48px"
          gap="0px"
          opacity="1"
          color="white"
          textAlign="center"
          as="b"
          fontWeight="800"
          size="48px"
          lineHeight="48px"
        >
          Лайкосы
        </Text>
        {isLoadingLikedVideos && <Spinner size="xl" />}
        {!isLoadingLikedVideos && error && <Text>Ошибка при загрузке данных.</Text>}
        {!isLoadingLikedVideos && !error && (
          <SimpleGrid columns={[1, 2, 3]} spacing={8} w="full" maxW="1200px">
            {likedVideos?.map((video: VideoType, index: number) => (
              <Box
                key={video.id}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                position="relative"
                onClick={() => handleVideoSelect(index)}
                cursor="pointer"
                _hover={{ bg: 'gray.100' }}
              >
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={video.thumbnailPath}
                    alt={video.title}
                    boxSize="full"
                    objectFit="cover"
                  />
                </AspectRatio>
                <Text noOfLines={2} mt={2} fontSize="lg" fontWeight="medium">
                  {video.title}
                </Text>
                <IconButton
                  aria-label="Удалить из избранного"
                  icon={<FaTrash />}
                  colorScheme="red"
                  size="sm"
                  position="absolute"
                  top="4"
                  right="4"
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleUnlike(video.id);
                  }}
                />
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Flex>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Просмотр видео</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {likedVideos && likedVideos.length > 0 && (
              <Box maxW="100%" w="100%">
                <VideoPlayer
                  src={likedVideos[currentVideoIndex].videoPath}
                  poster={likedVideos[currentVideoIndex].thumbnailPath}
                  onEnd={handleNextVideo}
                  onLike={() => console.log('Лайкнули видео!')}
                  handleNextVideo={handleNextVideo}
                  handlePrevVideo={handlePrevVideo}
                />
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
