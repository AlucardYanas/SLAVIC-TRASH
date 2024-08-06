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
} from '@chakra-ui/react';
import { useUploadVideoMutation } from '../../redux/upload/uploadSlice';
import { useGetLikedVideosQuery } from '../../redux/like/likeSlice'; // Импортируем из нового слайса
import type { RootState } from '../../redux/store';

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

  const {
    data: likedVideos,
    error,
    isLoading: isLoadingLikedVideos,
  } = useGetLikedVideosQuery({ userId: userId ?? 0 }, { skip: !userId });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoTitle(event.target.value);
  };

  // Function to check for undesirable content
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

  // Video Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handlers for carousel navigation
  const handleNext = () => {
    if (likedVideos) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % likedVideos.length);
    }
  };

  const handlePrev = () => {
    if (likedVideos) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + likedVideos.length) % likedVideos.length
      );
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

      {/* Modal for undesirable content */}
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
      <Flex direction="row" align="center" justify="space-between" height="calc(100vh - 8rem)">
        <Flex direction="column" align="center" justify="center" flex="1">
          <Box width="full">
            <Text fontSize="2xl" mb={4}>
              Видео, которые вам понравились
            </Text>
            {isLoadingLikedVideos ? (
              <Spinner size="xl" />
            ) : error ? (
              <Text>Ошибка при загрузке данных.</Text>
            ) : (
              <Flex align="center" justify="center" position="relative">
                {likedVideos && likedVideos.length > 0 && (
                  <>
                    <Button
                      onClick={handlePrev}
                      position="absolute"
                      left="10px"
                      top="50%"
                      transform="translateY(-50%)"
                      zIndex={1}
                      bg="transparent"
                      _hover={{ bg: 'rgba(0, 0, 0, 0.1)' }}
                    >
                      <Box
                        width="0"
                        height="0"
                        borderLeft="10px solid transparent"
                        borderRight="10px solid transparent"
                        borderBottom="20px solid black"
                        transform="rotate(270deg)"
                      />
                    </Button>

                    <Box key={likedVideos[currentIndex].id} p={4}>
                      <Flex direction="column" align="center">
                        <Image
                          src={likedVideos[currentIndex].thumbnailPath}
                          alt={likedVideos[currentIndex].title}
                          mb={2}
                          boxSize="400px"
                          objectFit="cover"
                        />
                        <Text noOfLines={2}>{likedVideos[currentIndex].title}</Text>
                      </Flex>
                    </Box>

                    <Button
                      onClick={handleNext}
                      position="absolute"
                      right="10px"
                      top="50%"
                      transform="translateY(-50%)"
                      zIndex={1}
                      bg="transparent"
                      _hover={{ bg: 'rgba(0, 0, 0, 0.1)' }}
                    >
                      <Box
                        width="0"
                        height="0"
                        borderLeft="10px solid transparent"
                        borderRight="10px solid transparent"
                        borderBottom="20px solid black"
                        transform="rotate(90deg)"
                      />
                    </Button>
                  </>
                )}
              </Flex>
            )}
          </Box>
        </Flex>  
      </Flex>
    </Container>
  );
}
