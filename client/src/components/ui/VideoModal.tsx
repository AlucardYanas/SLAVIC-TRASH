// src/components/ui/VideoModal.tsx

import React from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
} from '@chakra-ui/react';

// Определяем интерфейс для пропсов
interface VideoModalProps {
  videoTitle: string; // Заголовок видео
  videoSrc: string;   // Ссылка на видео
}

const VideoModal: React.FC<VideoModalProps> = ({ videoTitle, videoSrc }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Хук для управления модальным окном

  return (
    <>
      {/* Кнопка для открытия модального окна */}
      <Button onClick={onOpen} colorScheme="blue" mb={2}>
        Open Video
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          mt={10}
          maxW="80vw" // Ограничивает максимальную ширину
          maxH="80vh" // Ограничивает максимальную высоту
          p={0} // Убираем внутренние отступы
        >
          <ModalCloseButton color="white" onClick={onClose} />
          <ModalBody p={0} display="flex" flexDirection="column" h="80%">
            {/* Заголовок видео */}
            <Box p={4} bg="black" color="white" textAlign="center">
              <Text>{videoTitle}</Text>
            </Box>
            {/* Видео */}
            <Box as="video" src={videoSrc} width="100%" height="100%" controls />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VideoModal;
