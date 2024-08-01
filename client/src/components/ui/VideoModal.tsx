import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useGetPopularVideosQuery } from '../../redux/videoApi';

interface VideoModalProps {
  videoTitle: string;
  videoSrc: string;
}

export default function VideoModal(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, error, isLoading } = useGetPopularVideosQuery({});
  const [videos, setVideos] = useState<any[]>([]);
  const [processedVideos, setProcessedVideos] = useState<string[]>([]);
  const cloudName = 'dfg8oyokw';

  useEffect(() => {
    if (data && data.videos) {
      console.log('Полученные видео:', data.videos);

      const filteredVideos = data.videos
        .map((video: any) => {
          const sdFile = video.video_files.find((file: any) => file.quality === 'sd');
          return sdFile ? { ...video, sdFileLink: sdFile.link } : null;
        })
        .filter((video): video is any => video !== null)
        .slice(0, 5);

      console.log('Отфильтрованные видео:', filteredVideos);
      setVideos(filteredVideos);
    }
  }, [data]);

  useEffect(() => {
    const processVideos = async () => {
      const urls = await Promise.all(
        videos.map((video) => processVideo(video.video_files[0].link)),
      );
      setProcessedVideos(urls);
    };

    if (videos.length > 0) {
      processVideos();
    }
  }, [videos]);

  const uploadToCloudinary = async (videoUrl: string) => {
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        {
          file: videoUrl,
          upload_preset: 'my_upload_preset',
          resource_type: 'video',
        },
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Ошибка загрузки на Cloudinary:', error);
      return videoUrl; // Возвращаем оригинальный URL в случае ошибки
    }
  };

  const processVideo = async (videoUrl: string) => {
    const processedUrl = await uploadToCloudinary(videoUrl);
    return processedUrl;
  };

  return (
    <>
      <Button onClick={onOpen}>Open Video</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          mt={10}
          maxW="80vw"
          maxH="80vh"
          p={0}
        >
          <ModalCloseButton color="white" onClick={onClose} />
          <ModalBody p={0} display="flex" flexDirection="column" h="80%">
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                <Spinner size="lg" />
                <Text ml={4}>Загрузка видео...</Text>
              </Box>
            ) : error ? (
              <Text color="red.500">Ошибка загрузки видео.</Text>
            ) : processedVideos.length > 0 ? (
              processedVideos.map((url, index) => (
                <Box key={videos[index].id} mb={4}>
                  <Text fontSize="lg" mb={2}>{videos[index].title}</Text>
                  <Box as="video" src={url} width="100%" height="100%" controls />
                </Box>
              ))
            ) : (
              <Text>Нет доступных видео.</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
