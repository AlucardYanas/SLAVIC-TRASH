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
  AspectRatio,
  IconButton,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import { useUploadVideoMutation } from '../../redux/upload/uploadSlice';
import { useGetLikedVideosQuery, useUnlikeVideoMutation } from '../../redux/like/likeSlice';
import VideoPlayer from '../ui/VideoPlayer';
import type { RootState } from '../../redux/store';
import type { VideoType, UploadVideoResponse } from '../../types/types';

export default function AccountPage(): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertStatus, setAlertStatus] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [uploadVideo] = useUploadVideoMutation();
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);

      const formData = new FormData();
      formData.append('video', event.target.files[0]);
      formData.append('title', videoTitle);

      const uploadPromise = uploadVideo(formData).unwrap();

      const toastPromise = async (
        promise: Promise<UploadVideoResponse>,
        options: {
          loading: { title: string; description: string };
          success: { title: string; description: string };
          error: { title: string; description: string };
        },
      ): Promise<void> => toast.promise(promise, options);

      try {
        await toastPromise(uploadPromise, {
          loading: { title: 'Видос грузится в облако', description: 'Положди чуть-чуть, братан' },
          success: {
            title: 'Ништяк!',
            description: 'Видос Подгружен, Мы его посмотрим и добавим, если всё ок.',
          },
          error: { title: 'Произошла лажа', description: 'Не могу грузануть' },
        });
        setSelectedFile(null);
        setVideoTitle('');
      } catch (err) {
        console.error('Ошибка загрузки:', err);
      }
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    void handleFileChange(event); // Оборачиваем вызов асинхронной функции
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setVideoTitle(event.target.value);
  };

  const isUndesirableContent = (title: string): boolean => {
    const undesirableKeywords = ['bad', 'offensive', 'undesirable'];
    return undesirableKeywords.some((keyword) => title.toLowerCase().includes(keyword));
  };

  const handleVideoSelect = (index: number): void => {
    setCurrentVideoIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setCurrentVideoIndex(0);
  };

  const handleNextVideo = (): void => {
    if (likedVideos && likedVideos.length > 0) {
      setCurrentVideoIndex((prevIndex) => {
        if (prevIndex + 3 < likedVideos.length) {
          return prevIndex + 3;
        }
        return prevIndex;
      });
    }
  };

  const handlePrevVideo = (): void => {
    if (likedVideos && likedVideos.length > 0) {
      setCurrentVideoIndex((prevIndex) => {
        if (prevIndex - 3 >= 0) {
          return prevIndex - 3;
        }
        return 0;
      });
    }
  };

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

  const handleShare = (): void => {
    void navigator.clipboard.writeText(
      `https://slavic-trash.chickenkiller.com/video/${likedVideos[currentVideoIndex].id}`,
    );
    toast({
      title: 'Готово',
      description: 'Ссылка на видео успешно скопирована',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
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
                boxSize="60vh"
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
        onChange={handleFileInputChange}
      />

      <Flex direction="column" alignItems="center" mb={4}>
        <Input
          placeholder="Введите название видео"
          focusBorderColor='white'
          value={videoTitle}
          onChange={handleTitleChange}
          mb={2}
          width="600px"
          bg="orange.200"
          _placeholder={{ color: 'orange.600' }}
        />
        <Button
          size="lg"
          _placeholder={{ color: 'orange.600' }}
          variant="solid"
          opacity='0.85'
         
          // colorScheme="orange.600"
          background="#ff3b00"
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          Выбрать видео и загрузить
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
          color="yellow"
          fontFamily="Rubik Marker Hatch"
          fontWeight="550"
          textAlign="center"
          as="b"
          size="48px"
          lineHeight="48px"
        >
          Лайкосы
        </Text>
        {isLoadingLikedVideos && <Spinner size="xl" />}
        {!isLoadingLikedVideos && error && <Text>Ошибка при загрузке данных.</Text>}
        {!isLoadingLikedVideos && !error && (
          <Flex align="center" justify="center" position="relative" w="full" maxW="1200px">
            <IconButton
              icon={<FaChevronLeft />}
              aria-label="Previous Video"
              onClick={handlePrevVideo}
              position="absolute"
              left="-60px"
              zIndex="1"
              variant="solid"
              colorScheme="orange"
              bgColor="#ff3b00"
              size="xl"
              _hover={{ opacity: 0.7 }}
            />
            <HStack spacing={4} overflow="hidden" w="full" justifyContent="center">
              {likedVideos.slice(currentVideoIndex, currentVideoIndex + 3).map((video, index) => (
                <Box key={video.id} position="relative" w="380px">
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={video.thumbnailPath}
                      alt={video.title}
                      boxSize="full"
                      objectFit="cover"
                      onClick={() => handleVideoSelect(currentVideoIndex + index)}
                      cursor="pointer"
                    />
                  </AspectRatio>
                  <Text fontFamily="Rubik Marker Hatch"
                  color='yellow' noOfLines={2} mt={2} fontSize="lg" fontWeight="medium">
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
            </HStack>
            <IconButton
              icon={<FaChevronRight />}
              aria-label="Next Video"
              onClick={handleNextVideo}
              position="absolute"
              right="-60px"
              zIndex="1"
              variant="solid"
              colorScheme="orange"
              bgColor="#ff3b00"
              size="xl"
              _hover={{ opacity: 0.7 }}
            />
          </Flex>
        )}
      </Flex>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {likedVideos.length > 0 ? likedVideos[currentVideoIndex].title : 'Video'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {likedVideos.length > 0 && (
              <VideoPlayer
                src={likedVideos[currentVideoIndex].videoPath}
                poster={likedVideos[currentVideoIndex].thumbnailPath}
                onEnd={handleNextVideo}
                handleShare={handleShare}
                showLike={false} // Hide the Like button
                showShare // Show the Share button
                showNextPrev={false}
              />
            )}
            {likedVideos.length === 0 && <Text>No videos available.</Text>}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
