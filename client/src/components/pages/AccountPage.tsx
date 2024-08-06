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
  IconButton,  // Импортируем IconButton
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';  // Импортируем иконку для кнопки удаления
import { useUploadVideoMutation } from '../../redux/upload/uploadSlice';
import { useGetLikedVideosQuery, useUnlikeVideoMutation } from '../../redux/like/likeSlice'; // Импортируем мутацию удаления лайка
import VideoPlayer from '../ui/VideoPlayer'; // Импортируем видеоплеер
import type { RootState } from '../../redux/store';
import type { VideoType } from '../../types/types'; // Обязательно убедитесь, что у вас есть тип VideoType

export default function AccountPage(): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertStatus, setAlertStatus] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [uploadVideo, { isLoading }] = useUploadVideoMutation();

  const userId = useSelector((state: RootState) =>
    state.auth.user.status === 'logged' ? state.auth.user.id : null
  );

  // Используем RTK Query для получения данных о понравившихся видео
  const {
    data: likedVideosData,
    error,
    isLoading: isLoadingLikedVideos,
  } = useGetLikedVideosQuery({ userId: userId ?? 0 }, { skip: !userId });

  const likedVideos: VideoType[] = likedVideosData || []; // Проверяем, что likedVideosData существует и извлекаем поле data, если оно есть

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0); // Изначально 0, т.е. первый элемент

  // Мутация для удаления лайка
  const [unlikeVideo] = useUnlikeVideoMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoTitle(event.target.value);
  };

  // Функция для проверки нежелательного контента
  const isUndesirableContent = (title: string) => {
    const undesirableKeywords = ['bad', 'offensive', 'undesirable'];
    return undesirableKeywords.some((keyword) =>
      title.toLowerCase().includes(keyword)
    );
  };

  const handleSubmit = async () => {
    if (!selectedFile || !videoTitle || userId === null) {
      // Если нет файла, заголовка или пользователь не авторизован
      setAlertMessage('Пожалуйста, выберите файл видео, введите название и убедитесь, что вы авторизованы.');
      setAlertStatus('info');
      setShowAlert(true);
      return; // Выход из функции, если условия не выполнены
    }

    if (isUndesirableContent(videoTitle)) {
      // Устанавливаем сообщение и статус предупреждения
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
    } catch (error: any) {
      console.error('Ошибка загрузки:', error);

      if (error.status === 400) {
        // Если сервер вернул 400, это значит, что видео содержит нежелательный контент
        setAlertMessage('Видео содержит нежелательный контент и не может быть загружено.');
        setAlertStatus('warning');
      } else {
        setAlertMessage('Не удалось загрузить видео. Пожалуйста, попробуйте еще раз.');
        setAlertStatus('error');
      }
    } finally {
      setShowAlert(true); // Всегда показываем уведомление после попытки загрузки
    }
  };

  // Открытие модального окна для видео
  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentVideoIndex(0); // Возвращаем индекс на начало при закрытии
  };

  const handleNextVideo = () => {
    if (likedVideos && likedVideos.length > 0) {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % likedVideos.length);
    }
  };

  const handlePrevVideo = () => {
    if (likedVideos && likedVideos.length > 0) {
      setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + likedVideos.length) % likedVideos.length);
    }
  };

  // Функция для удаления видео из избранного
  const handleUnlike = async (videoId: number) => {
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
      {/* Верхняя панель с кнопками */}
      <Box mb={4}>
        <Button colorScheme="teal" variant="solid" mr={4}>
          История просмотров
        </Button>
      </Box>

      {/* Modal для предупреждений */}
      <Modal isOpen={showAlert && alertStatus === 'warning'} onClose={() => setShowAlert(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Предупреждение!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" align="center" justify="center">
              <Image
                src="/yee-boy.gif" // GIF Shrek с мечом, расположенный в папке public
                alt="Funny Shrek GIF"
                boxSize="60vh"  // Размер GIF
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

      {/* Скрытое поле для выбора файлов */}
      <input
        id="fileInput"
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Поле ввода названия видео и кнопка для отправки */}
      <Box mb={4}>
        <Input
          placeholder="Введите название видео"
          value={videoTitle}
          onChange={handleTitleChange}
          mb={2}
        />
        <Button
          colorScheme="teal"
          variant="solid"
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          Выбрать файл
        </Button>
        <br />
        <Button
          colorScheme="teal"
          variant="solid"
          onClick={handleSubmit}
          isLoading={isLoading}
        >
          Отправить
        </Button>
      </Box>

      {/* Основное содержимое страницы */}
      <Flex direction="column" align="center" justify="center">
        <Text fontSize="2xl" mb={4}>
          Видео, которые вам понравились
        </Text>
        {isLoadingLikedVideos ? (
          <Spinner size="xl" />
        ) : error ? (
          <Text>Ошибка при загрузке данных.</Text>
        ) : (
          <SimpleGrid columns={[1, 2, 3]} spacing={8} w="full" maxW="1200px">
            {likedVideos?.map((video: VideoType, index: number) => ( // Добавляем типизацию
              <Box
                key={video.id}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                position="relative" // Добавляем позиционирование
                onClick={() => handleVideoSelect(index)} // Выбор видео для просмотра
                cursor="pointer"
                _hover={{ bg: "gray.100" }} // Эффект наведения
              >
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={video.thumbnailPath} // Убедитесь, что у вас есть запасной путь
                    alt={video.title}
                    boxSize="full"
                    objectFit="cover"
                  />
                </AspectRatio>
                <Text noOfLines={2} mt={2} fontSize="lg" fontWeight="medium">
                  {video.title}
                </Text>
                {/* Кнопка удаления лайка */}
                <IconButton
                  aria-label="Удалить из избранного"
                  icon={<FaTrash />}
                  colorScheme="red"
                  size="sm"
                  position="absolute"
                  top="4"
                  right="4"
                  onClick={(e) => {
                    e.stopPropagation(); // Останавливаем всплытие события
                    handleUnlike(video.id);
                  }}
                />
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Flex>

      {/* Модальное окно для просмотра видео */}
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
                  videos={likedVideos}
                  currentVideoIndex={currentVideoIndex}
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
