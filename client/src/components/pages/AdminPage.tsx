import React, { useState, useEffect } from 'react';
import { Button, Container, Flex, VStack, Box, Text, Alert, AlertIcon } from '@chakra-ui/react';
import AdminModal from '../ui/AdminModal';
import { useGetPendingVideosQuery, useApproveVideoMutation, useDisapproveVideoMutation, useGetExtractedTextsQuery } from '../../redux/upload/uploadSlice';
import type { VideoType } from '../../types/types';

export default function AdminPage(): JSX.Element {
  const { data: pendingVideos = [], refetch, error } = useGetPendingVideosQuery();
  const [approveVideo] = useApproveVideoMutation();
  const [disapproveVideo] = useDisapproveVideoMutation();
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Fetching extracted texts
  const { data: extractedTexts } = useGetExtractedTextsQuery(selectedVideo?.id || 0, {
    skip: !selectedVideo,
  });

  useEffect(() => {
    if (error) {
      setAlertMessage('Ошибка при получении видео');
    } else if (pendingVideos.length === 0) {
      setAlertMessage('Нет новых видео для одобрения');
    } else {
      setAlertMessage(null);
    }
  }, [pendingVideos, error]);

  const handleApprove = async () => {
    if (selectedVideo) {
      await approveVideo({ id: selectedVideo.id, tags: selectedVideo.tags || [] });
      refetch();
    }
  };

  const handleDisapprove = async () => {
    if (selectedVideo) {
      await disapproveVideo(selectedVideo.id);
      refetch();
    }
  };

  return (
    <Container maxW="container.xl" p={4}>
      <Flex direction="column" align="center" justify="center" height="100vh">
        {alertMessage && (
          <Alert status="info" mb={4}>
            <AlertIcon />
            {alertMessage}
          </Alert>
        )}
        <VStack spacing={4} width="100%">
          {pendingVideos.map((video: VideoType) => (
            <Box key={video.id} p={4} borderWidth="1px" borderRadius="lg" width="100%" onClick={() => setSelectedVideo(video)}>
              <Text>{video.title}</Text>
            </Box>
          ))}
        </VStack>
        {selectedVideo && (
          <>
            <AdminModal videoTitle={selectedVideo.title} videoSrc={selectedVideo.videoPath} />
            <Flex mt={4}>
              <Button mr={2} colorScheme="green" onClick={handleApprove}>Одобрить</Button>
              <Button colorScheme="red" onClick={handleDisapprove}>Отклонить</Button>
            </Flex>
            <Box mt={4}>
              <Text fontWeight="bold">Извлеченные тексты:</Text>
              {extractedTexts?.texts.map((text, index) => (
                <Text key={index}>{text}</Text>
              ))}
            </Box>
            <Box mt={4}>
              <Text fontWeight="bold">Транскрибированный текст:</Text>
              <Text>{selectedVideo.transcribedText}</Text>
            </Box>
          </>
        )}
      </Flex>
    </Container>
  );
}
